import Router from "koa-router";
import RemoteManage from "../services/remote_manage";

const terminalRouter = new Router({
    prefix: "/terminal"
});

terminalRouter.get("/:endpoint/:name", async (ctx) => {
    const server = await RemoteManage.getServer(ctx.params.endpoint);
    if (server) {
        ctx.body = {
            socket: server.getSocketUrl(),
            token: "1234567890"
        }
    } else {
        ctx.status = 404;
        ctx.body = {
            message: "server not found"
        };
    }
})

export default terminalRouter;