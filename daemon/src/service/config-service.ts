import * as process from 'node:process';
import * as path from 'node:path';
import * as fs from 'node:fs';
import { v4 as uuidv4 } from 'uuid';
import * as jwt from 'jsonwebtoken';
import logger from 'common/dist/core/logger';

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

const configPath = process.env.CONFIG_PATH || path.normalize('config');

const configFile = path.join(configPath, 'config.json');

class ConfigService {
  private readonly config: Configuration;

  constructor() {
    logger.debug(`loading config: ${configFile}`);
    if (!fs.existsSync(configPath)) {
      fs.mkdirSync(configPath, { recursive: true });
    }
    if (!fs.existsSync(configFile)) {
      // Generate Access token
      const payload = {
        uuid: uuidv4(),
      };
      defaultConfig.accessToken = jwt.sign(payload, defaultConfig.jwtSecret, {});
      fs.writeFileSync(configFile, JSON.stringify(defaultConfig, null, 4));
    }
    this.config = JSON.parse(
      fs.readFileSync(configFile, {
        encoding: 'utf-8',
      }),
    );
  }

  getConfig(key: keyof Configuration) {
    return this.config[key];
  }
}

export default new ConfigService();
