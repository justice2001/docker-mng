import Router from 'koa-router';
import RemoteManage from '../services/remote-manage';
import RemoteRequest from '../services/remote_request';

const terminalRouter = new Router({
  prefix: '/terminal',
});

terminalRouter.get('/:endpoint/:name', async (ctx) => {
  const server = await RemoteManage.getServer(ctx.params.endpoint);
  // Get Token
  if (server) {
    const resp = await new RemoteRequest(server).request('auth/single-token', {
      permission: 'terminal',
      // bash则为命令行，进入容器bash则使用｜分隔，如 nginx|nginx_pri|bash
      info: ctx.params.name,
    });
    ctx.body = {
      socket: server.getSocketUrl(),
      token: resp,
    };
  } else {
    ctx.status = 404;
    ctx.body = {
      message: 'server not found',
    };
  }
});

export default terminalRouter;
