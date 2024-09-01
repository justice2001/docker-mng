import { response, routerApp } from '../service/router';
import { getSystemInfo } from '../service/system_info';
import { NodeInfo } from 'common/dist/types/daemon';

import * as pty from '@homebridge/node-pty-prebuilt-multiarch';
import SingleUseToken from '../service/single-use-token';
import ConfigService from '../service/config-service';
import { daemonVersion, dockerVersion } from '../app';
import StackManager from '../service/stack-manager';
import * as process from 'node:process';
import * as child_process from 'node:child_process';
import logger from 'common/dist/core/logger';
import * as path from 'node:path';

routerApp.on('info', async (ctx) => {
  const systemInfo = await getSystemInfo();
  const resp: NodeInfo = {
    cpu: systemInfo.cpu,
    memory: systemInfo.mem,
    disk: systemInfo.disk,
    dockerVersion: dockerVersion,
    daemonVersion: daemonVersion,
    nodeStatus: 'running',
  };
  response(ctx, resp);
});

routerApp.on(
  'terminal',
  async (ctx, data) => {
    const token = await SingleUseToken.auth(data, 'terminal');
    if (!token) {
      ctx.socket.emit('data', 'Unauthorized!');
      ctx.socket.disconnect();
      return;
    }

    let cmd = '';
    let args = [];

    // Start Command
    if (token.info === 'bash') {
      cmd = ConfigService.getConfig('defaultBash');
      args = ['--login'];
    } else if (token.info.startsWith('stack')) {
      const [_, stack, service, type = 'bash'] = token.info.split('|');
      if (!stack || !service) {
        ctx.socket.emit('data', 'Invalid stack or service');
        ctx.socket.disconnect();
        return;
      }
      const stacks = await StackManager.getStack(stack);
      if (!stacks) {
        ctx.socket.emit('data', 'Stack not found!');
        ctx.socket.disconnect();
        return;
      }
      cmd = 'docker';
      args = ['compose', '-f', await stacks.getComposePath(), 'exec', service, `/bin/${type}`];
    } else {
      ctx.socket.emit('data', 'Unsupported terminal type');
      ctx.socket.disconnect();
      return;
    }

    // create a process and send to client
    const ptyProcess = pty.spawn(cmd, args, {
      cols: 80,
      rows: 24,
      cwd: process.env.HOME, // 或你希望的起始目录
      env: process.env,
    });

    ptyProcess.onData((data) => {
      ctx.socket.emit('data', data);
    });

    ctx.socket.on('stdin', (data) => {
      ptyProcess.write(data);
    });

    ctx.socket.on('disconnect', () => {
      console.log('terminal disconnect');
    });
  },
  2,
);

routerApp.on('update', async (ctx) => {
  // const host = process.env.HOSTNAME;
  const host = process.env.HOSTNAME;
  logger.info(`Host name: ${host}`, 'updater');
  try {
    const containerInfo = child_process.execSync(`docker inspect ${host} --format json`, { encoding: 'utf-8' });
    const infoJson = JSON.parse(containerInfo);
    const labels = infoJson[0].Config.Labels;
    if (labels['com.docker.compose.project.config_files']) {
      const composeFile = labels['com.docker.compose.project.config_files'];
      logger.info(`Found docker compose file: ${composeFile}`);
      const basename = path.dirname(composeFile);
      const updateCmd = `docker run -itd --rm --name=selfupdate \
        -v ${basename}:${basename} \
        -v /var/run/docker.sock:/var/run/docker.sock \
        -e STACK_PATH=${composeFile} \
        git.mczhengyi.top/zhengyi/dm-updater:latest`;
      logger.info(`Update command: ${updateCmd}`, 'updater');
      response(ctx, '正在执行更新容器...');
      child_process.exec(updateCmd);
    } else {
      response(ctx, '暂不支持该类型容器更新!', false);
    }
  } catch (e) {
    logger.error(`Update failed: ${e}`, 'updater');
    response(ctx, '寻找容器失败！', false);
  }
});
