import Router from "koa-router";
import si from 'systeminformation';
import RemoteRequest from "../services/remote-request";
import RemoteManage from "../services/remote-manage";

const router = new Router;

router.get("/api/overview", async (ctx) => {
    // 计算所有CPU核心的总使用情况
    const load = (await si.currentLoad()).currentLoad;
    const mem = await si.mem();
    ctx.body = {
        cpuUsage: (load / 100),
        memUsage: (mem.available / mem.total)
    }
})

router.get("/api/info/:endpoint", async (ctx) => {
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
        const res = await new RemoteRequest(server).request("info", {});
        console.log(res);
        ctx.body = res;
    } catch (e: any) {
        ctx.status = 500;
        ctx.body = {
            message: e
        }
        return;
    }
})

export default router;