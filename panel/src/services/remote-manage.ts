import RemoteServer from "../core/remote-server";

class RemoteManage {
    private readonly map: Map<string, RemoteServer>;

    constructor() {
        this.map = new Map();
    }

    async initialize() {
        console.log("initial");
        this.map.set("1234", new RemoteServer("127.0.0.1", 3001, "abcd"));
    }

    async getServer(uuid: string) {
        return this.map.get(uuid)
    }

    async getAllServers() {
        return this.map;
    }
}

export default new RemoteManage();