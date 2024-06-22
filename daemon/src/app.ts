import Koa from 'koa';
import * as http from "node:http";
import io from 'socket.io';
import { IPacket } from "../../common/types/Community";
import { NodeInfo } from "../../common/types/daemon";
import { navigation } from "./service/router";

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

    navigation(socket);
})

server.listen(3001);