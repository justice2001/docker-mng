import { response, routerApp } from "../service/router";
import StackManager from "../service/stack-manager";
import SingleUseToken from "../service/single-use-token";
import { IPty, spawn } from "@homebridge/node-pty-prebuilt-multiarch";

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

    let process: IPty | null = null

    async function startProcess(composePath: string) {
        console.log("process launching...")

        process = spawn("docker", ["compose", "-f", composePath, "logs", "-f"], {
            encoding: "utf-8",
            cols: 60,
            rows: 80
        });

        process.onExit((code) => {
            console.log("process exited")
            ctx.socket.emit("data", `Process exited with code ${code.exitCode}, restarting\r\n`);
            if (!ctx.socket.connected) return;
            setTimeout(async () => {
                const runCount = await stack?.runningContainerCount() || 0;
                if (runCount > 0) {
                    await startProcess(composePath);
                } else {
                    ctx.socket.emit("data", "No containers running, exiting\r\n");
                    ctx.socket.disconnect();
                }
            }, 1000)
        });

        process.onData((data) => {
            ctx.socket.emit("data", data);
        });
    }

    await startProcess(await stack.getComposePath());

    ctx.socket.on("disconnect", () => {
        process?.kill();
        console.log("terminal disconnect")
    })
})