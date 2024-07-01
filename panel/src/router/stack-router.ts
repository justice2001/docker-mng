import Router from 'koa-router';
import RemoteManage from '../services/remote-manage';
import RemoteRequest from '../services/remote_request';

const stackRouter = new Router({
  prefix: '/stacks',
});

stackRouter.get('/:endpoint/:name', async (ctx) => {
  const server = await RemoteManage.getServer(ctx.params.endpoint);
  if (!server) {
    ctx.status = 404;
    ctx.body = {
      message: 'Server not found',
    };
    return;
  }
  try {
    ctx.body = await new RemoteRequest(server).request('stack/get', ctx.params.name);
  } catch (e: any) {
    ctx.status = 500;
    ctx.body = {
      message: e.message,
    };
  }
});

stackRouter.get('/:endpoint/:name/logs', async (ctx) => {
  const server = await RemoteManage.getServer(ctx.params.endpoint);
  if (!server) {
    ctx.status = 404;
    ctx.body = {
      message: 'Server not found',
    };
    return;
  }
  try {
    const resp = await new RemoteRequest(server).request('auth/single-token', {
      permission: 'compose-logs',
      info: ctx.params.name,
    });
    ctx.body = {
      socket: server.getSocketUrl(),
      token: resp,
    };
  } catch (e: any) {
    ctx.status = 500;
    ctx.body = {
      message: e.message,
    };
  }
});

export default stackRouter;
