import { response, routerApp } from "../service/router";
import StackManager from "../service/stack-manager";
import SingleUseToken from "../service/single-use-token";
import { spawn } from "@homebridge/node-pty-prebuilt-multiarch";

routerApp.on("stack/list", async (ctx, data) => {
    await StackManager.getStack("nginx")
})

routerApp.on("stack/get", async (ctx, data) => {
    const stack = await StackManager.getStack(data);
    if (!stack) {
        response(ctx, {
            ok: false,
            message: "Stack not found!"
        }, false)
        return
    }
    response(ctx, await stack.getInfo());
})

routerApp.on("stack/logs", async (ctx, data) => {
    const token = await SingleUseToken.auth(data, "compose-logs")
    if (!token) {
        ctx.socket.emit("data", "Unauthorized!")
        ctx.socket.disconnect();
        return
    }

    const stack = await StackManager.getStack(token.info);
    if (!stack) {
        ctx.socket.emit("data", "Stack not found!");
        ctx.socket.disconnect();
        return;
    }

    const process = spawn("docker", ["compose", "-f", await stack.getComposePath(), "logs", "-f"], {
        encoding: "utf-8",
    });

    process.onData((data) => {
        ctx.socket.emit("data", data);
    });

    ctx.socket.on("disconnect", () => {
        console.log("terminal disconnect")
        process.kill("9");
    })
})