import { NodeData } from "../../../common/types/daemon";
import { io, Socket } from "socket.io-client";

/**
 * 远程服务器，用于连接 daemon，并向 daemon 发送指令
 */
export default class RemoteServer {
    private readonly address: string;
    private readonly port: number;
    private readonly token: string;

    private serverInfo: NodeData | null = null;

    private readonly socket: Socket;

    constructor(address: string, port: number, token: string, https: boolean = false) {
        this.address = address;
        this.port = port;
        this.token = token;
        const socket = io(`${https ? "https" : "http"}://${this.address}:${this.port}`);
        socket.on("connect", () => {
            console.log("connected to server: " + this.address);
            socket.emit("auth", this.token);
        });
        this.socket = socket;
    }

    getSocket() {
        return this.socket;
    }
}