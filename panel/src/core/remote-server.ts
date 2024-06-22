import { NodeData } from "../../../common/types/daemon";
import { io, Socket } from "socket.io-client";
import RemoteRequest from "../services/remote-request";

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
        this.socket = socket;
        socket.on("connect", () => {
            console.log("connected to server: " + this.address);
            socket.emit("auth", this.token);

            new RemoteRequest(this).request("info", {}).then(res => {
                console.debug(`server ${this.port} info: ${JSON.stringify(res)}`)
                this.serverInfo = {
                    nodeName: "node-1",
                    nodeIp: address,
                    nodeMngPort: port,
                    nodeInfo: res
                };
            });
        });
    }

    getSocket() {
        return this.socket;
    }

    getServerInfo() {
        return this.serverInfo;
    }
}