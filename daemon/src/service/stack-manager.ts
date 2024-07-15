import Stack from './stack';
import logger from 'common/dist/core/logger';
import { Stacks, StackStatus } from 'common/dist/types/stacks';
import * as path from 'node:path';
import * as fs from 'node:fs';
import { stackPath } from 'common/dist/core/base-path';
import * as child_process from 'node:child_process';

class StackManager {
  private readonly stackList: Map<string, Stack>;

  constructor() {
    this.stackList = new Map();
    logger.info('Loading stacks with docker compose', 'StackManager');
    this.loadStack().then((_) => {
      logger.info(`Stacks loaded! count: ${this.stackList.size}`, 'StackManager');
    });
  }

  async getStack(name: string) {
    const stack = this.stackList.get(name);
    if (!stack) {
      await this.loadStack();
      return this.stackList.get(name);
    }
    return stack;
  }

  async getAllStackInfo() {
    const stacks: Stacks[] = [];
    const statusMap = await this.getAllStackStatus();
    for (const stack of this.stackList.values()) {
      const stackInfo = await stack.getInfo();
      stackInfo.state = statusMap[stackInfo.name] || 'unknown';
      stacks.push(stackInfo);
    }
    return stacks;
  }

  async getAllStackStatus(): Promise<{ [key: string]: StackStatus }> {
    const res = child_process.spawnSync('docker', ['compose', 'ls', '--all', '--format', 'json'], {
      encoding: 'utf-8',
    });
    if (!res.stdout) {
      return {};
    }
    const status: Record<string, StackStatus> = {};
    JSON.parse(res.stdout).map((stack: any) => {
      if (stack.Status.startsWith('running')) {
        status[stack.Name] = 'running';
      } else if (stack.Status.startsWith('exited')) {
        status[stack.Name] = 'stopped';
      } else if (stack.Status.startsWith('created')) {
        status[stack.Name] = 'stopped';
      } else {
        status[stack.Name] = 'unknown';
      }
    });
    return status;
  }

  async loadStack() {
    const configPath = stackPath;
    const dir = await fs.promises.readdir(configPath);
    for (const stack of dir) {
      const stackPath = path.join(configPath, stack);
      if ((await fs.promises.stat(stackPath)).isDirectory()) {
        logger.info(`Read stack: ${stackPath}`);
        const composeFile = await fs.promises.readdir(stackPath);
        for (const file of composeFile) {
          if (['compose.yaml', 'compose.yml', 'docker-compose.yaml', 'docker-compose.yml'].includes(file)) {
            this.stackList.set(stack, new Stack(stack, path.join(stackPath, file)));
            break;
          }
        }
      }
    }
  }

  async addStack(name: string, envFile: string, composeFile: string) {
    const newStack = new Stack(name, path.join(stackPath, name, 'compose.yaml'));
    if (newStack) {
      await newStack.create(envFile, composeFile);
    }
    this.stackList.set(name, newStack);
    return newStack;
  }
}

export default new StackManager();
