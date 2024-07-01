import { response, routerApp } from '../service/router';
import StackManager from '../service/stack-manager';
import SingleUseToken from '../service/single-use-token';
import { IPty, spawn } from '@homebridge/node-pty-prebuilt-multiarch';
import logger from 'common/dist/core/logger';

routerApp.on('stack/list', async (ctx, data) => {
  await StackManager.getStack('nginx');
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
  response(ctx, await stack.getInfo());
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

    process = spawn('docker', ['compose', '-f', composePath, 'logs', '-f'], {
      encoding: 'utf-8',
      cols: 60,
      rows: 80,
    });

    process.onExit((code) => {
      logger.debug('compose log process exited', ctx.socket.id);
      ctx.socket.emit('data', `\x1b[1;31mProcess exited with code ${code.exitCode}, restarting \x1b[0m\r\n`);
      if (!ctx.socket.connected) return;
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
