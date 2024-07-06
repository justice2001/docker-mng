import * as fs from 'node:fs';
import { ServerConfig } from '../services/remote-manage';
import logger from 'common/dist/logger';
import { configPath, panelConfig } from 'common/dist/core/base-path';

export type ConfigurationData = {
  token: string;
  serverList: ServerConfig[];
};

const defaultConfig: ConfigurationData = {
  token: '',
  serverList: [],
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
    return this.config[key];
  }

  updateConfig(key: keyof ConfigurationData, value: any) {
    this.config[key] = value;
    fs.writeFileSync(panelConfig, JSON.stringify(this.config, null, 4));
  }
}

export default new Configuration();
