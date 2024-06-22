import { response, routerApp } from "../service/router";
import { getSystemInfo } from "../service/system_info";
import { NodeInfo } from "../../../common/types/daemon";

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