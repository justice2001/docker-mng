import RemoteServer from "../core/remote_server";
import configuration from "../core/configuration";

export type ServerConfig = {
    name: string;
    ip: string;
    port: number;
    token: string;
    https: boolean;
}

class RemoteManage {
    private readonly map: Map<string, RemoteServer>;

    constructor() {
        this.map = new Map();
    }

    async initialize() {
        console.log("initial servers");
        const list = configuration.getConfig("serverList") as ServerConfig[];
        console.log(list)
        if (list.length <= 0) {
            await this.addServer({
                name: "default",
                ip: "127.0.0.1",
                port: 3001,
                token: "123456",
                https: false
            })
        }
        list.forEach((item) => {
            this.map.set(item.name, new RemoteServer(item.name, item.ip, item.port, item.token, item.https));
        })
    }

    async addServer(config: ServerConfig) {
        const server = new RemoteServer(config.name, config.ip, config.port, config.token, config.https);
        const serverList = configuration.getConfig("serverList") as ServerConfig[];
        serverList.push(config);
        configuration.updateConfig("serverList", serverList)
        this.map.set(config.name, server);
    }

    async getServer(uuid: string) {
        return this.map.get(uuid)
    }

    async getAllServers() {
        return this.map;
    }
}

export default new RemoteManage();