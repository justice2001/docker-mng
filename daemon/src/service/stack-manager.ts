import Stack from './stack';
import logger from 'common/dist/core/logger';
import { Stacks } from 'common/dist/types/stacks';
import * as path from 'node:path';
import * as fs from 'node:fs';
import { stackPath } from 'common/dist/core/base-path';

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
    for (const stack of this.stackList.values()) {
      stacks.push(await stack.getInfo());
    }
    return stacks;
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
