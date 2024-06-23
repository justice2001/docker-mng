import Router from "koa-router";
import RemoteManage from "../services/remote_manage";
import RemoteRequest from "../services/remote_request";

const terminalRouter = new Router({
    prefix: "/terminal"
});

terminalRouter.get("/:endpoint/:name", async (ctx) => {
    const server = await RemoteManage.getServer(ctx.params.endpoint);
    // Get Token
    if (server) {
        const resp = await new RemoteRequest(server).request("auth/single-token", {
            permission: "terminal",
            info: "bash"
        })
        ctx.body = {
            socket: server.getSocketUrl(),
            token: resp
        }
    } else {
        ctx.status = 404;
        ctx.body = {
            message: "server not found"
        };
    }
})

export default terminalRouter;