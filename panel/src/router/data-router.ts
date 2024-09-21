import Router from 'koa-router';
import RemoteManage from '../services/remote-manage';
import RemoteRequest from '../services/remote_request';

const dataRouter = new Router({
  prefix: '/data',
});

dataRouter.get('/:endpoint/:stack', async (ctx) => {
  const path = ctx.query.path;
  const server = await RemoteManage.getServer(ctx.params.endpoint);
  if (!server) {
    ctx.status = 404;
    ctx.body = {
      message: 'Server not found',
    };
    return;
  }
  try {
    ctx.body = await new RemoteRequest(server).request('data/list', {
      name: ctx.params.stack,
      path: path,
    });
  } catch (e: any) {
    ctx.status = 500;
    ctx.body = {
      message: e,
    };
  }
});

dataRouter.get('/:endpoint/:stack/file', async (ctx) => {
  const server = await RemoteManage.getServer(ctx.params.endpoint);
  if (!server) {
    ctx.status = 404;
    ctx.body = {
      message: 'Server not found',
    };
    return;
  }
  try {
    ctx.body = await new RemoteRequest(server).request('data/file', {
      name: ctx.params.stack,
      path: ctx.query.path,
    });
  } catch (e: any) {
    ctx.status = 500;
    ctx.body = {
      message: e,
    };
  }
});

dataRouter.put('/:endpoint/:stack/file', async (ctx) => {
  const server = await RemoteManage.getServer(ctx.params.endpoint);
  if (!server) {
    ctx.status = 404;
    ctx.body = {
      message: 'Server not found',
    };
    return;
  }
  try {
    await new RemoteRequest(server).request('data/update', {
      name: ctx.params.stack,
      path: ctx.query.path,
      data: ctx.request.body,
    });
    ctx.status = 200;
  } catch (e: any) {
    ctx.status = 500;
    ctx.body = {
      message: e,
    };
  }
});

dataRouter.delete('/:endpoint/:stack/file', async (ctx) => {
  const server = await RemoteManage.getServer(ctx.params.endpoint);
  if (!server) {
    ctx.status = 404;
    ctx.body = {
      message: 'Server not found',
    };
    return;
  }
  try {
    await new RemoteRequest(server).request('data/delete', {
      name: ctx.params.stack,
      path: ctx.query.path,
    });
    ctx.status = 200;
  } catch (e: any) {
    ctx.status = 500;
    ctx.body = {
      message: e,
    };
  }
});

dataRouter.post('/:endpoint/:stack/create', async (ctx) => {
  const server = await RemoteManage.getServer(ctx.params.endpoint);
  if (!server) {
    ctx.status = 404;
    ctx.body = {
      message: 'Server not found',
    };
    return;
  }
  try {
    await new RemoteRequest(server).request('data/create', {
      name: ctx.params.stack,
      path: ctx.query.path,
      isDir: ctx.query.isDir === 'true',
    });
    ctx.status = 201;
  } catch (e: any) {
    ctx.status = 500;
    ctx.body = {
      message: e,
    };
  }
});

export default dataRouter;
