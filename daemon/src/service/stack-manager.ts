import Stack from "./stack";
import { spawn } from "promisify-child-process"

class StackManager {
    private readonly stackList: Map<string, Stack>

    constructor() {
        this.stackList = new Map();
        console.log("Loading stacks...")
        this.loadStack().then(_ => {
            console.log(`Stacks loaded! count: ${this.stackList.size}`)
        })
    }

    async getStack(name: string) {
        const stack = this.stackList.get(name);
        if (!stack) {
            await this.loadStack();
            return this.stackList.get(name)
        }
        return stack;
    }

    async getAllStackInfo() {
        for (const stack of this.stackList.values()) {
            
        }
    }

    async loadStack() {
        const res = await spawn("docker", ["compose", "ls", "--all", "--format", "json"], {
            encoding: "utf-8"
        });
        if (!res.stdout) {
            return;
        }
        const stacks = JSON.parse(res.stdout.toString());
        for (const stack of stacks) {
            const stackName = stack.Name;
            const composeFilePath = stack.ConfigFiles;
            this.stackList.set(stackName, new Stack(stackName, composeFilePath));
        }
    }
}

export default new StackManager();