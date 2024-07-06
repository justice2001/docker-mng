import { StackOperation, Stacks, StackStatus } from 'common/dist/types/stacks';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { spawn } from 'promisify-child-process';
import * as yaml from 'js-yaml';
import { spawnSync } from 'child_process';

class Stack {
  private readonly name: string;
  private readonly composeFilePath: string;
  private readonly workDir: string;
  private readonly managed: boolean;

  private composeFile: string = '';
  private envFile: string = '';
  private verified: boolean = false;

  constructor(name: string, composeFilePath: string) {
    this.name = name;
    this.composeFilePath = composeFilePath;
    this.managed = true;
    this.workDir = path.dirname(composeFilePath);
    // Not managed stack
    if (!fs.existsSync(composeFilePath)) {
      this.managed = false;
      return;
    }
    // Load compose file
    this.composeFile = fs.readFileSync(composeFilePath, {
      encoding: 'utf-8',
    });
    // Load compose env
    if (!fs.existsSync(path.join(this.workDir, '.env'))) {
      fs.writeFileSync(path.join(this.workDir, '.env'), '');
    }
    this.envFile = fs.readFileSync(path.join(this.workDir, '.env'), {
      encoding: 'utf-8',
    });

    const res = spawnSync('docker', ['compose', '-f', this.composeFilePath, 'config']);
    this.verified = res.status === 0;
  }

  async getInfo(): Promise<Stacks> {
    return {
      name: this.name,
      icon: '',
      tags: ['compose'],
      endpoint: '',
      state: await this.status(),
      envFile: this.envFile,
      composeFile: this.composeFile,
    };
  }

  async status(): Promise<StackStatus> {
    if (!this.verified) return 'warning';
    const res = await spawn('docker', ['compose', '-f', this.composeFilePath, 'ps', '-a', '--format', 'json'], {
      encoding: 'utf-8',
      shell: true,
    });
    if (!res.stdout) {
      return 'unknown';
    }
    const containers = res.stdout
      .toString()
      .split('\n')
      .filter((container) => container.length > 0)
      .map((container) => {
        return JSON.parse(container);
      });
    if (containers.some((container) => container.State === 'running')) {
      return 'running';
    }
    return 'stopped';
  }

  async getComposePath() {
    return this.composeFilePath;
  }

  async runningContainerCount() {
    const res = await spawn('docker', ['compose', '-f', this.composeFilePath, 'ps'], {
      encoding: 'utf-8',
    });
    if (!res.stdout) {
      return 0;
    }
    return res.stdout.toString().split('\n').length - 2;
  }

  async getOperationCmd(operation: StackOperation) {
    if (!this.verified) {
      return 'echo "The stacks is not verified"!';
    }
    switch (operation) {
      case 'up':
        return `docker compose -f ${this.composeFilePath} up -d`;
      case 'down':
        return `docker compose -f ${this.composeFilePath} down`;
      case 'restart':
        return `docker compose -f ${this.composeFilePath} restart`;
      case 'update':
        return `docker compose -f ${this.composeFilePath} pull && docker compose -f ${this.composeFilePath} up -d`;
    }
  }

  async updateConfig(envFile: string, composeFile: string, name: string) {
    try {
      yaml.load(composeFile);
    } catch (e: any) {
      return 'Invalid compose file, ' + e.message;
    }
    if (this.managed) {
      fs.writeFileSync(this.composeFilePath, composeFile);
      const res = spawnSync('docker', ['compose', '-f', this.composeFilePath, 'config']);
      if (res.status !== 0) {
        fs.writeFileSync(this.composeFilePath, this.composeFile);
        return res.stderr.toString();
      }

      fs.writeFileSync(path.join(this.workDir, '.env'), envFile);
      this.envFile = envFile;
      this.composeFile = composeFile;
      this.verified = true;
      return null;
    }
    return 'This stack not managed by docker mng';
  }
}

export default Stack;
