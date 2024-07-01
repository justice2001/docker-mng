import { io, Socket } from 'socket.io-client';
import { NodeData } from 'common/dist/types/daemon';
import RemoteRequest from '../services/remote_request';
import logger from 'common/dist/core/logger';

/**
 * 远程服务器，用于连接 daemon，并向 daemon 发送指令
 */
export default class RemoteServer {
  private readonly address: string;
  private readonly port: number;
  private readonly token: string;
  private readonly name: string;
  private readonly https: boolean;

  private serverInfo: NodeData | null = null;

  private readonly socket: Socket;
  private errCount: number = 0;

  constructor(name: string, address: string, port: number, token: string, https: boolean = false) {
    this.name = name;
    this.address = address;
    this.port = port;
    this.token = token;
    this.https = https;

    const socket = io(`${https ? 'https' : 'http'}://${this.address}:${this.port}`);
    this.socket = socket;

    this.setConnectStatus('registered');

    socket.on('connect', () => {
      logger.info('connected to server: ' + this.address, 'remote_server');
      socket.emit('auth', this.token);
      this.errCount = 0;

      new RemoteRequest(this).request('info', {}).then((res) => {
        logger.debug(`server ${this.port} info: ${JSON.stringify(res)}`, 'remote_server');
        this.serverInfo = {
          nodeName: name,
          nodeIp: address,
          nodeMngPort: port,
          nodeInfo: res,
        };
        this.serverInfo.nodeInfo.nodeStatus = 'connected';
      });
    });

    socket.on('connect_error', () => {
      this.setConnectStatus('registered');

      logger.error(`connect_error (${this.address}), error count: ${this.errCount++}`, 'remote_server');
      if (this.errCount > 5) {
        logger.error(`Error count limited! disconnecting (${this.address})`, 'remote_server');
        this.setConnectStatus('disconnected');
        socket.disconnect();
      }
    });

    socket.on('disconnect', () => {
      this.setConnectStatus('disconnected');
      logger.info('node disconnected: ' + this.socket.id, 'remote_server');
    });
  }

  setConnectStatus(status: string) {
    if (this.serverInfo) {
      this.serverInfo.nodeInfo.nodeStatus = status;
    } else {
      this.serverInfo = {
        nodeName: this.name,
        nodeIp: this.address,
        nodeMngPort: this.port,
        nodeInfo: {
          cpu: '0 Cores',
          memory: '0.00 GB',
          disk: '0.00 GB',
          dockerVersion: '00.0.0',
          daemonVersion: '0.0.0',
          nodeStatus: status,
        },
      };
    }
  }

  reconnect() {
    if (this.socket.connected) {
      return;
    }
    this.socket.connect();
    this.setConnectStatus('registered');
  }

  getSocket() {
    return this.socket;
  }

  getSocketUrl() {
    return `${this.https ? 'https' : 'http'}://${this.address}:${this.port}`;
  }

  getServerInfo() {
    return this.serverInfo;
  }

  disconnect() {
    this.socket.disconnect();
  }
}
