import * as process from 'node:process';
import * as fs from 'node:fs';
import logger from 'common/dist/core/logger';
import { configPath, daemonConfig } from 'common/dist/core/base-path';
import * as crypto from 'node:crypto';

type Configuration = {
  defaultBash: string;
  accessToken: string;
};

const defaultConfig: Configuration = {
  defaultBash: process.platform === 'win32' ? 'C:\\Windows\\System32\\cmd.exe' : '/bin/bash',
  accessToken: '',
};

class ConfigService {
  private readonly config: Configuration;

  constructor() {
    logger.debug(`loading config: ${daemonConfig}`);
    if (!fs.existsSync(configPath)) {
      fs.mkdirSync(configPath, { recursive: true });
    }
    if (!fs.existsSync(daemonConfig)) {
      // Generate Access token
      defaultConfig.accessToken = 'dm-' + crypto.randomBytes(32).toString('hex');
      fs.writeFileSync(daemonConfig, JSON.stringify(defaultConfig, null, 4));
    }
    this.config = JSON.parse(
      fs.readFileSync(daemonConfig, {
        encoding: 'utf-8',
      }),
    );
  }

  getConfig(key: keyof Configuration) {
    return this.config[key];
  }
}

export default new ConfigService();
