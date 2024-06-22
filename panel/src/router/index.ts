import Router from "koa-router";
import Koa from "koa";
import nodeRouter from "./node_router";
import overviewRouter from "./overview_routers";

export function mountRouters(app: Koa<Koa.DefaultState, Koa.DefaultContext>) {
    const allRouters = new Router({
        prefix: "/api"
    });
    allRouters.use(nodeRouter.routes()).use(nodeRouter.allowedMethods());
    allRouters.use(overviewRouter.routes()).use(overviewRouter.allowedMethods());

    app.use(allRouters.routes());
}