import { response, routerApp } from "../service/router";
import { getSystemInfo } from "../service/system_info";
import { NodeInfo } from "../../../common/types/daemon";

import * as pty from "@homebridge/node-pty-prebuilt-multiarch";

routerApp.on("info", async (ctx, data) => {

    const systemInfo = await getSystemInfo();
    const resp: NodeInfo = {
        cpu: systemInfo.cpu,
        memory: systemInfo.mem,
        disk: systemInfo.disk,
        dockerVersion: "20.10.0",
        daemonVersion: "1.0.0",
        nodeStatus: "running"
    };
    response(ctx, resp);
})

routerApp.on("terminal", async (ctx, data) => {

    // create a process and send to client
    const ptyProcess = pty.spawn("/bin/bash", ["--login"], {
        cols: 80,
        rows: 24,
        cwd: process.env.HOME, // 或你希望的起始目录
        env: process.env
    });

    ptyProcess.onData((data) => {
        ctx.socket.emit("data", data);
    });

    ctx.socket.on("stdin", (data) => {
        console.log(data)
        ptyProcess.write(data)
    })

    ctx.socket.on("disconnect", () => {
        console.log("terminal disconnect")
    })
})