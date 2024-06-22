import Koa from 'koa';
import * as http from "node:http";
import io from 'socket.io';
import { IPacket } from "../../common/types/Community";
import { NodeInfo } from "../../common/types/daemon";

const app = new Koa();

app.use(async (ctx, next) => {
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    ctx.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    await next();
});

const server = http.createServer(app.callback());

export const socketServer = new io.Server(server, {
    cors: {
        origin: "*"
    }
});

socketServer.on("connect", (socket) => {
    console.log("USER CONNECTED!")
    socket.on("info", (data: IPacket<any>) => {
        const res: IPacket<NodeInfo> = {
            event: "info",
            data: {
                cpu: "2C",
                memory: "10GB",
                disk: "100GB",
                dockerVersion: "20.10.0",
                daemonVersion: "1.0.0",
                nodeStatus: "running"
            },
            uuid: data.uuid,
            ok: true
        }
        socket.emit("info", res)
    })
})

server.listen(3001);