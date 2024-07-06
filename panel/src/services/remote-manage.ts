import RemoteServer from '../core/remote_server';
import configuration from '../core/configuration';
import logger from 'common/dist/core/logger';

export type ServerConfig = {
  name: string;
  ip: string;
  port: number;
  token: string;
  https: boolean;
};

class RemoteManage {
  private readonly map: Map<string, RemoteServer>;

  constructor() {
    this.map = new Map();
  }

  async initialize() {
    logger.info('Initializing Remote Servers');
    const list = configuration.getConfig('serverList') as ServerConfig[];
    logger.debug('Server List: ' + JSON.stringify(list));
    if (list.length <= 0) {
      await this.addServer({
        name: 'default',
        ip: '127.0.0.1',
        port: 3001,
        token: '123456',
        https: false,
      });
      return;
    }
    list.forEach((item) => {
      this.map.set(item.name, new RemoteServer(item.name, item.ip, item.port, item.token, item.https));
    });
  }

  /**
   * 添加节点服务器
   * @param config 节点配置
   */
  async addServer(config: ServerConfig) {
    // Check name
    if (this.map.has(config.name)) {
      throw new Error('节点名称已存在');
    }
    const server = new RemoteServer(config.name, config.ip, config.port, config.token, config.https);
    const serverList = configuration.getConfig('serverList') as ServerConfig[];
    serverList.push(config);
    configuration.updateConfig('serverList', serverList);
    this.map.set(config.name, server);
  }

  /**
   * 删除节点服务器
   * @param endpoint 节点
   */
  async removeServer(endpoint: string) {
    const server = await this.getServer(endpoint);
    if (server) {
      // Disconnect Server
      server.disconnect();
      // Remove
      this.map.delete(endpoint);
      // Update config
      const config = configuration.getConfig('serverList') as ServerConfig[];
      const index = config.findIndex((item) => item.name === endpoint);
      if (index !== -1) {
        config.splice(index, 1);
        configuration.updateConfig('serverList', config);
      }
    }
  }

  /**
   * 获取某个服务器
   * @param name 获取一个节点
   */
  async getServer(name: string) {
    return this.map.get(name);
  }

  /**
   * 获取所有服务器
   */
  async getAllServers() {
    return this.map;
  }

  /**
   * 获取服务器数量
   */
  async serverCount() {
    return this.map.size;
  }

  /**
   * 获取活跃服务器数量
   */
  async activeCount() {
    let count = 0;
    this.map.forEach((item) => {
      if (item.getServerInfo()?.nodeInfo.nodeStatus === 'connected') {
        count++;
      }
    });
    return count;
  }
}

export default new RemoteManage();
