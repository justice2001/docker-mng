import { StackOperation, Stacks, StackStatus } from 'common/dist/types/stacks';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { spawn } from 'promisify-child-process';
import * as yaml from 'js-yaml';
import { spawnSync } from 'child_process';
import logger from 'common/dist/core/logger';

class Stack {
  private readonly name: string;
  private readonly composeFilePath: string;
  private readonly workDir: string;
  private managed: boolean;

  private composeFile: string = '';
  private envFile: string = '';
  private verified: boolean = false;

  private icon: string = '';
  private tags: string[] = [];

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
    // Load compose env
    if (!fs.existsSync(path.join(this.workDir, '.env'))) {
      fs.writeFileSync(path.join(this.workDir, '.env'), '');
    }

    const res = spawnSync('docker', ['compose', '-f', this.composeFilePath, 'config']);
    this.verified = res.status === 0;

    this.loadConfig().then((_) => null);
  }

  async create(envFile: string, composeFile: string) {
    if (fs.existsSync(this.workDir)) {
      throw new Error('Stack already exists');
    }
    this.managed = true;
    fs.mkdirSync(this.workDir, { recursive: true });
    const res = await this.updateConfig(envFile, composeFile, this.name);
    if (res) {
      fs.rmSync(this.workDir, { recursive: true, force: true });
      throw new Error(res);
    }
  }

  async loadConfig() {
    this.composeFile = fs.readFileSync(this.composeFilePath, {
      encoding: 'utf-8',
    });
    this.envFile = fs.readFileSync(path.join(this.workDir, '.env'), {
      encoding: 'utf-8',
    });
    await this.loadProperties();
  }

  /**
   * 拓展属性
   */
  async loadProperties(): Promise<void> {
    const compose: any = yaml.load(this.composeFile);
    if (!compose) {
      return;
    }
    if ('x-dockge' in compose || 'x-dm' in compose) {
      const extendProperties = compose['x-dockge'] || compose['x-dm'];
      logger.debug(`find extend properties: ${JSON.stringify(extendProperties)}`);
      if ('tags' in extendProperties) {
        this.tags = extendProperties['tags'];
      }
      if ('icon' in extendProperties) {
        this.icon = extendProperties['icon'];
      }
    }
  }

  async getInfo(): Promise<Stacks> {
    await this.loadConfig();
    return {
      name: this.name,
      icon: this.icon,
      tags: this.tags,
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

      await this.loadProperties();

      return null;
    }
    return 'This stack not managed by docker mng';
  }
}

export default Stack;
