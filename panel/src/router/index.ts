import Router from 'koa-router';
import Koa from 'koa';
import nodeRouter from './node_router';
import overviewRouter from './overview_routers';
import terminalRouter from './terminal_router';
import stackRouter from './stack-router';
import authRouters from './auth-routers';

export function mountRouters(app: Koa<Koa.DefaultState, Koa.DefaultContext>) {
  const allRouters = new Router({
    prefix: '/api',
  });
  allRouters.use(authRouters.routes()).use(authRouters.allowedMethods());
  allRouters.use(nodeRouter.routes()).use(nodeRouter.allowedMethods());
  allRouters.use(overviewRouter.routes()).use(overviewRouter.allowedMethods());
  allRouters.use(terminalRouter.routes()).use(terminalRouter.allowedMethods());
  allRouters.use(stackRouter.routes()).use(stackRouter.allowedMethods());

  app.use(allRouters.routes());
}
