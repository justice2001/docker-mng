import Router from 'koa-router';
import RemoteManage from '../services/remote-manage';
import RemoteRequest from '../services/remote_request';
import logger from 'common/dist/core/logger';

const nodeRouter = new Router({ prefix: '/nodes' });

nodeRouter.get('/info/:endpoint', async (ctx) => {
  // 计算所有CPU核心的总使用情况
  const server = await RemoteManage.getServer(ctx.params.endpoint);
  if (!server) {
    ctx.status = 404;
    ctx.body = {
      message: 'server not found',
    };
    return;
  }
  try {
    ctx.body = await new RemoteRequest(server).request('info', {});
  } catch (e: any) {
    ctx.status = 500;
    ctx.body = {
      message: e,
    };
    return;
  }
});

nodeRouter.post('/', async (ctx) => {
  try {
    await RemoteManage.addServer(ctx.request.body);
    ctx.body = {
      ok: true,
    };
  } catch (e: any) {
    ctx.status = 500;
    ctx.body = {
      message: e.message,
    };
  }
});

nodeRouter.put('/reconnect/:endpoint', async (ctx) => {
  const server = await RemoteManage.getServer(ctx.params.endpoint);
  if (!server) {
    ctx.status = 404;
    ctx.body = {
      message: 'server not found',
    };
    return;
  }
  server.reconnect();
  ctx.body = {
    ok: true,
  };
});

nodeRouter.delete('/:endpoint', async (ctx) => {
  await RemoteManage.removeServer(ctx.params.endpoint);
  ctx.body = {
    ok: true,
  };
});

export default nodeRouter;
