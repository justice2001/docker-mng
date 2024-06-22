import Router from "koa-router";
import RemoteManage from "../services/remote_manage";
import RemoteRequest from "../services/remote_request";

const nodeRouter = new Router({prefix: "/nodes"});

nodeRouter.get("/info/:endpoint", async (ctx) => {
    console.log("endpoint: ", ctx.params.endpoint)
    // 计算所有CPU核心的总使用情况
    const server = await RemoteManage.getServer(ctx.params.endpoint);
    if (!server) {
        ctx.status = 404;
        ctx.body = {
            message: "server not found"
        }
        return;
    }
    try {
        ctx.body = await new RemoteRequest(server).request("info", {});
    } catch (e: any) {
        ctx.status = 500;
        ctx.body = {
            message: e
        }
        return;
    }
})

export default nodeRouter;