import Stack from './stack';
import { spawn } from 'promisify-child-process';
import logger from 'common/dist/core/logger';

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
    for (const stack of this.stackList.values()) {
    }
  }

  async loadStack() {
    const res = await spawn('docker', ['compose', 'ls', '--all', '--format', 'json'], {
      encoding: 'utf-8',
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
