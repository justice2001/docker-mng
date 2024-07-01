import Router from 'koa-router';
import { NodeData } from '../../../common/types/daemon';
import remoteManage from '../services/remote-manage';

const overviewRouter = new Router({
  prefix: '/overview',
});

overviewRouter.get('/', async (ctx) => {
  // 计算所有CPU核心的总使用情况
  const servers: NodeData[] = [];
  const allServer = await remoteManage.getAllServers();
  allServer.forEach((server) => {
    const info = server.getServerInfo();
    info && servers.push(info);
  });
  ctx.body = {
    cpuUsage: 0,
    memUsage: 0,
    serverCount: await remoteManage.serverCount(),
    activeServerCount: await remoteManage.activeCount(),
    servers,
  };
});

export default overviewRouter;
