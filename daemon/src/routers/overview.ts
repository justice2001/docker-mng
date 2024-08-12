import { response, routerApp } from '../service/router';
import { getSystemInfo } from '../service/system_info';
import { NodeInfo } from 'common/dist/types/daemon';

import * as pty from '@homebridge/node-pty-prebuilt-multiarch';
import SingleUseToken from '../service/single-use-token';
import ConfigService from '../service/config-service';
import { daemonVersion, dockerVersion } from '../app';
import StackManager from '../service/stack-manager';

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

routerApp.on('terminal', async (ctx, data) => {
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
});
