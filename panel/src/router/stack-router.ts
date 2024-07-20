import Router from 'koa-router';
import RemoteManage from '../services/remote-manage';
import RemoteRequest from '../services/remote_request';
import { Stacks } from 'common/dist/types/stacks';
import { SINGLE_AUTH_OPERATION } from 'common/dist/types/auth';

const stackRouter = new Router({
  prefix: '/stacks',
});

stackRouter.get('/:endpoint', async (ctx) => {
  const server = await RemoteManage.getServer(ctx.params.endpoint);
  if (!server) {
    ctx.status = 404;
    ctx.body = {
      message: 'Server not found',
    };
    return;
  }
  try {
    const resp = (await new RemoteRequest(server).request('stack/list', {})) as Stacks[];
    resp.forEach((stack) => {
      stack.endpoint = ctx.params.endpoint;
      if (!stack.address) {
        stack.address = server.getServerInfo()?.nodeIp;
      }
    });
    ctx.body = resp;
  } catch (e: any) {
    ctx.status = 500;
    ctx.body = {
      message: e.message,
    };
  }
});

stackRouter.post('/:endpoint', async (ctx) => {
  const server = await RemoteManage.getServer(ctx.params.endpoint);
  if (!server) {
    ctx.status = 404;
    ctx.body = {
      message: 'Server not found',
    };
    return;
  }
  try {
    ctx.body = await new RemoteRequest(server).request('stack/create', {
      name: ctx.request.body.name,
      composeFile: ctx.request.body.composeFile,
      envFile: ctx.request.body.envFile,
    });
  } catch (e: any) {
    ctx.status = 500;
    ctx.body = {
      message: e,
    };
  }
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
    const stack = await new RemoteRequest(server).request('stack/get', ctx.params.name);
    stack.endpoint = ctx.params.endpoint;
    if (!stack.address) {
      stack.address = server.getServerInfo()?.nodeIp;
    }
    ctx.body = stack;
  } catch (e: any) {
    ctx.status = 500;
    ctx.body = {
      message: e.message,
    };
  }
});

stackRouter.get('/:endpoint/:name/status', async (ctx) => {
  const server = await RemoteManage.getServer(ctx.params.endpoint);
  if (!server) {
    ctx.status = 404;
    ctx.body = {
      message: 'Server not found',
    };
    return;
  }
  try {
    ctx.body = await new RemoteRequest(server).request('stack/status', ctx.params.name);
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

stackRouter.get('/:endpoint/:name/operation/:operation', async (ctx) => {
  const server = await RemoteManage.getServer(ctx.params.endpoint);
  if (!server) {
    ctx.status = 404;
    ctx.body = {
      message: 'Server not found',
    };
    return;
  }
  if (!['up', 'stop', 'down', 'restart', 'update'].includes(ctx.params.operation)) {
    ctx.status = 401;
    ctx.body = {
      message: 'Operation not allowed!',
    };
    return;
  }
  try {
    const resp = await new RemoteRequest(server).request('auth/single-token', {
      permission: SINGLE_AUTH_OPERATION,
      info: `${ctx.params.name}|${ctx.params.operation}`,
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

stackRouter.put('/:endpoint/:name', async (ctx) => {
  const server = await RemoteManage.getServer(ctx.params.endpoint);
  if (!server) {
    ctx.status = 404;
    ctx.body = {
      message: 'Server not found',
    };
    return;
  }
  try {
    ctx.body = await new RemoteRequest(server).request('stack/update', {
      stackName: ctx.params.name,
      name: ctx.request.body.name,
      composeFile: ctx.request.body.composeFile,
      envFile: ctx.request.body.envFile,
    });
  } catch (e: any) {
    ctx.status = 500;
    ctx.body = {
      message: e.message,
    };
  }
});

export default stackRouter;
