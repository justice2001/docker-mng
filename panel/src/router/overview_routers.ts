import Router from 'koa-router';
import remoteManage from '../services/remote-manage';
import { NodeData } from 'common/dist/types/daemon';

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

export default overviewRouter;
