import * as fs from 'node:fs';
import { ServerConfig } from '../services/remote-manage';
import logger from 'common/dist/core/logger';
import { configPath, panelConfig } from 'common/dist/core/base-path';
import { generateSecrets } from '../utils/random-utils';

export type ConfigurationData = {
  secret: string;
  serverList: ServerConfig[];
  username: string;
  password: string;
};

const defaultConfig: ConfigurationData = {
  secret: generateSecrets(32),
  serverList: [],
  username: 'admin',
  password: '$2a$10$40vhxUEULq/TTiuMc93qGO0.sN2mc.95mC76KtMSZ9GwL0JSaMgnm',
};

class Configuration {
  private readonly config: ConfigurationData;

  constructor() {
    // Read Configuration
    const configFile = panelConfig;
    logger.info('Read Configuration from: ' + configFile);
    if (!fs.existsSync(configPath)) {
      fs.mkdirSync(configPath, { recursive: true });
    }
    if (!fs.existsSync(configFile)) {
      fs.writeFileSync(configFile, JSON.stringify(defaultConfig, null, 4));
    }
    this.config = JSON.parse(
      fs.readFileSync(configFile, {
        encoding: 'utf-8',
      }),
    );
    logger.debug(`Config: ${JSON.stringify(this.config)}`);
  }

  getConfig(key: keyof ConfigurationData) {
    if (this.config[key]) {
      logger.debug(`Get Config: ${key} = ${this.config[key]}`);
      return this.config[key];
    } else {
      const newConfig = defaultConfig[key];
      this.updateConfig(key, newConfig);
      return newConfig;
    }
  }

  updateConfig(key: keyof ConfigurationData, value: any) {
    this.config[key] = value;
    fs.writeFileSync(panelConfig, JSON.stringify(this.config, null, 4));
  }
}

export default new Configuration();
