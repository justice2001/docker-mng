import RemoteServer from '../core/remote_server';
import logger from 'common/dist/core/logger';
import { IPacket } from 'common/dist/types/community';

export default class RemoteRequest {
  private remoteServer: RemoteServer;

  constructor(remoteServer: RemoteServer) {
    this.remoteServer = remoteServer;
  }

  async request(event: string, data: any): Promise<any> {
    const uuid: string = 'abcdefghi';

    const packet = {
      uuid: uuid,
      data: data,
    };

    return new Promise((resolve, reject) => {
      const socket = this.remoteServer.getSocket();

      // Timeout
      setTimeout(() => {
        reject({ err: 'request timeout' });
      }, 3000);

      socket.on(event, (res: IPacket<any>) => {
        if (res.uuid !== uuid) {
          return;
        }
        if (!res.ok) {
          reject(res.data);
          return;
        }
        resolve(res.data);
      });

      logger.debug(`emit socket: ${event} -> ${JSON.stringify(packet.data)}`, 'remote');
      socket.emit(event, packet);
    });
  }
}
