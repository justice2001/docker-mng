import configService from './config-service';
import logger from 'common/dist/core/logger';

class AuthService {
  authList: string[] = [];
  authToken: string;

  constructor() {
    this.authList = [];
    this.authToken = configService.getConfig('accessToken');
  }

  authorize(token: string, clientId: string) {
    if (token !== this.authToken) {
      throw new Error('认证失败，请检查令牌是否正确！');
    }
    this.authList.push(clientId);
  }

  check(clientId: string) {
    return this.authList.includes(clientId);
  }

  disconnect(clientId: string) {
    logger.debug('Destroy user authorize: ' + clientId, 'AuthService');
    this.authList = this.authList.filter((id) => id !== clientId);
  }
}

export default new AuthService();
