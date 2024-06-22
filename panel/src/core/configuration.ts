import * as process from "node:process";
import * as path from "node:path";
import * as fs from "node:fs";
import { ServerConfig } from "../services/remote_manage";

export type ConfigurationData = {
    token: string;
    serverList: ServerConfig[]
}

const defaultConfig: ConfigurationData = {
    token: "",
    serverList: []
}

const configPath = process.env.CONFIG_PATH || path.normalize("config")

class Configuration {
    private readonly config: ConfigurationData;

    constructor() {
        // Read Configuration
        console.log(fs.existsSync(configPath))
        console.log(configPath)
        if (!fs.existsSync(configPath)) {
            fs.mkdirSync(configPath, { recursive: true });
        }
        const configFile = path.join(configPath, "config.json");
        if (!fs.existsSync(configFile)) {
            fs.writeFileSync(configFile, JSON.stringify(defaultConfig, null, 4));
        }
        this.config = JSON.parse(fs.readFileSync(configFile, {
            encoding: "utf-8"
        }));
    }

    getConfig(key: keyof ConfigurationData) {
        return this.config[key]
    }

    updateConfig(key: keyof ConfigurationData, value: any) {
        this.config[key] = value
        const configFile = path.join(configPath, "config.json");
        fs.writeFileSync(configFile, JSON.stringify(this.config, null, 4));
    }
}

export default new Configuration();