import { response, routerApp } from '../service/router';
import StackManager from '../service/stack-manager';
import SingleUseToken from '../service/single-use-token';
import { IPty, spawn } from '@homebridge/node-pty-prebuilt-multiarch';
import logger from 'common/dist/core/logger';
import { StackOperation } from 'common/dist/types/stacks';
import { SINGLE_AUTH_OPERATION } from 'common/dist/types/auth';

routerApp.on('stack/list', async (ctx) => {
  const stacks = await StackManager.getAllStackInfo();
  stacks.forEach((stack) => {
    stack.envFile = undefined;
    stack.composeFile = undefined;
  });
  response(ctx, stacks);
});

routerApp.on('stack/get', async (ctx, data) => {
  const stack = await StackManager.getStack(data);
  if (!stack) {
    response(
      ctx,
      {
        ok: false,
        message: 'Stack not found!',
      },
      false,
    );
    return;
  }
  const info = await stack.getInfo();
  info.state = await stack.status();
  response(ctx, info);
});

routerApp.on('stack/create', async (ctx, data) => {
  const { name, envFile, composeFile } = data;
  try {
    const stack = await StackManager.addStack(name, envFile, composeFile);
    response(ctx, await stack.getInfo());
  } catch (e: any) {
    response(ctx, e.message, false);
  }
});

routerApp.on('stack/logs', async (ctx, data) => {
  const token = await SingleUseToken.auth(data, 'compose-logs');
  if (!token) {
    ctx.socket.emit('data', 'Unauthorized!');
    ctx.socket.disconnect();
    return;
  }

  const stack = await StackManager.getStack(token.info);
  if (!stack) {
    ctx.socket.emit('data', 'Stack not found!');
    ctx.socket.disconnect();
    return;
  }

  let process: IPty | null = null;

  async function startProcess(composePath: string) {
    logger.debug(`compose process launching, cmd: docker compose -f ${composePath} logs -f`, ctx.socket.id);

    process = spawn('docker', ['compose', '-f', composePath, 'logs', '--tail', '200', '-f'], {
      encoding: 'utf-8',
      cols: 60,
      rows: 80,
    });

    process.onExit((code) => {
      logger.debug('compose log process exited', ctx.socket.id);
      ctx.socket.emit('data', `\x1b[1;31mProcess exited with code ${code.exitCode} \x1b[0m\r\n`);
      if (!ctx.socket.connected) return;
      if (code.exitCode !== 0) return;
      setTimeout(async () => {
        const runCount = (await stack?.runningContainerCount()) || 0;
        if (runCount > 0) {
          await startProcess(composePath);
        } else {
          ctx.socket.emit('data', '\x1b[1;31mNo containers running, exiting\x1b[0m\r\n');
          ctx.socket.disconnect();
        }
      }, 1000);
    });

    process.onData((data) => {
      ctx.socket.emit('data', data);
    });
  }

  await startProcess(await stack.getComposePath());

  ctx.socket.on('disconnect', () => {
    process?.kill();
    logger.debug('console log disconnect', ctx.socket.id);
  });
});

routerApp.on('stack/operation', async (ctx, data) => {
  const token = await SingleUseToken.auth(data, SINGLE_AUTH_OPERATION);
  if (!token) {
    ctx.socket.emit('data', 'Unauthorized!');
    ctx.socket.disconnect();
    return;
  }

  const [name, op] = token.info.split('|');

  const stack = await StackManager.getStack(name);
  if (!stack) {
    ctx.socket.emit('data', 'Stack not found!');
    ctx.socket.disconnect();
    return;
  }

  const cmd = await stack.getOperationCmd(op as StackOperation);

  logger.debug(`stack operation, cmd: ${cmd}`, ctx.socket.id);
  if (!cmd) {
    ctx.socket.emit('data', 'Operation not found!');
    ctx.socket.disconnect();
    return;
  }

  const iPty = spawn('bash', ['-c', cmd], {
    encoding: 'utf-8',
  });

  iPty.onData((data) => {
    ctx.socket.emit('data', data);
  });

  iPty.onExit((code) => {
    logger.debug('stack operation process exited', ctx.socket.id);
    ctx.socket.emit('data', `\x1b[0;32mProcess complated with code ${code.exitCode} \x1b[0m\r\n`);
    ctx.socket.disconnect();
  });
});

routerApp.on('stack/update', async (ctx, data) => {
  const { stackName, name, envFile, composeFile } = data;
  const stack = await StackManager.getStack(stackName);
  if (!stack) {
    response(ctx, { ok: false, message: 'Stack not found!' }, false);
    return;
  }

  const result = await stack.updateConfig(envFile, composeFile, name);
  if (result) {
    response(ctx, { ok: false, message: result }, false);
  } else {
    response(ctx, { ok: true });
  }
});
