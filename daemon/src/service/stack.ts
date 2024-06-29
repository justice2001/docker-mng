import { StackInfo } from "../../../common/types/StackInfo";
import * as fs from "node:fs";
import * as path from "node:path";
import { spawn } from "promisify-child-process";

class Stack {
    private readonly name: string;
    private readonly composeFilePath: string;
    private readonly workDir: string;
    private readonly managed: boolean;

    private composeFile: string = "";
    private envFile: string = "";

    constructor(name: string, composeFilePath: string) {
        this.name = name;
        this.composeFilePath = composeFilePath;
        this.managed = true;
        this.workDir = path.dirname(composeFilePath);
        // Load compose file
        this.composeFile = fs.readFileSync(composeFilePath, {
            encoding: "utf-8"
        });
        // Load compose env
        if (!fs.existsSync(path.join(this.workDir, ".env"))) {
            fs.writeFileSync(path.join(this.workDir, ".env"), "");
        }
        this.envFile = fs.readFileSync(path.join(this.workDir, ".env"), {
            encoding: "utf-8"
        });
    }

    async getInfo(): Promise<StackInfo> {
        return {
            name: this.name,
            icon: "",
            tags: [""],
            endpoint: "",
            state: "running",
            envFile: this.envFile,
            composeFile: this.composeFile
        };
    }

    async getComposePath() {
        return this.composeFilePath
    }

    async runningContainerCount() {
        const res = await spawn("docker", ["compose", "-f", this.composeFilePath, "ps"], {
            encoding: "utf-8"
        });
        if (!res.stdout) {
            return 0;
        }
        return res.stdout.toString().split("\n").length - 2;
    }
}

export default Stack;