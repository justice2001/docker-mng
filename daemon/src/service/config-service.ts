import * as process from 'node:process';
import * as fs from 'node:fs';
import { v4 as uuidv4 } from 'uuid';
import * as jwt from 'jsonwebtoken';
import logger from 'common/dist/core/logger';
import { configPath, daemonConfig } from 'common/dist/core/base-path';

type Configuration = {
  defaultBash: string;
  accessToken: string;
  jwtSecret: string;
};

const defaultConfig: Configuration = {
  defaultBash: process.platform === 'win32' ? 'C:\\Windows\\System32\\cmd.exe' : '/bin/bash',
  accessToken: '',
  jwtSecret: '1234567890qwertyuiopasdfghjklzxcvbnm',
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
      const payload = {
        uuid: uuidv4(),
      };
      defaultConfig.accessToken = jwt.sign(payload, defaultConfig.jwtSecret, {});
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
