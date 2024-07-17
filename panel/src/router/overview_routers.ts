import Router from 'koa-router';
import remoteManage from '../services/remote-manage';
import { NodeData } from 'common/dist/types/daemon';
import RemoteRequest from '../services/remote_request';
import RemoteServer from '../core/remote_server';
import { Stacks } from 'common/dist/types/stacks';

const overviewRouter = new Router({
  prefix: '/overview',
});

overviewRouter.get('/servers', async (ctx) => {
  // 计算所有CPU核心的总使用情况
  const servers: NodeData[] = [];
  const allServer = await remoteManage.getAllServers();
  allServer.forEach((server) => {
    const info = server.getServerInfo();
    info && servers.push(info);
  });
  ctx.body = {
    serverCount: await remoteManage.serverCount(),
    activeServerCount: await remoteManage.activeCount(),
    servers,
  };
});

overviewRouter.get('/stacks', async (ctx) => {
  const servers = await remoteManage.getAllServers();
  const serverNames: RemoteServer[] = [];
  servers.forEach((server) => {
    if (server.getServerInfo()?.nodeInfo.nodeStatus === 'connected') {
      serverNames.push(server);
    }
  });
  const stacks: Stacks[] = (
    await Promise.all(serverNames.map(async (ser) => new RemoteRequest(ser).request('stack/list', {})))
  ).flatMap((res) => res as Stacks[]);
  try {
    ctx.body = stacks.reduce(
      (acc: { [key: string]: number }, stack) => {
        const state = stack.state;
        if (['unknown', 'running', 'deploying', 'warning', 'stopped'].includes(state)) {
          acc[state] = (acc[state] || 0) + 1;
        }
        return acc;
      },
      { all: stacks.length, running: 0, processing: 0, warning: 0, stopped: 0, unknown: 0 },
    );
  } catch (e: any) {
    ctx.status = 500;
    ctx.body = {
      message: 'Error: ' + e.message,
    };
  }
});

export default overviewRouter;
