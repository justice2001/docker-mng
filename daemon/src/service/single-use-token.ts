import { v4 as uuidv4 } from 'uuid';

type SingleToken = {
  token: string;
  expire: number;
  permission: string;
  info: string;
};

class SingleUseToken {
  private readonly tokenList: Map<string, SingleToken>;

  constructor() {
    this.tokenList = new Map();
  }

  async addToken(token: string, expire: number, permission: string, info: string) {
    this.tokenList.set(token, {
      token: token,
      expire: expire,
      permission: permission,
      info: info,
    });
  }

  async createToken(permission: string, info: string) {
    const token = uuidv4().replace(/-/g, '');
    const expire = Date.now() + 1000 * 60 * 60;
    await this.addToken(token, expire, permission, info);
    return token;
  }

  async auth(token: string, permission: string) {
    const payload = this.tokenList.get(token);
    if (payload) {
      // Expire time
      if (payload.expire < Date.now()) {
        await this.removeToken(token);
        return null;
      }
      // Permission
      if (payload.permission === permission) {
        await this.removeToken(token);
        return payload;
      }
      return null;
    } else {
      return null;
    }
  }

  async removeToken(token: string) {
    this.tokenList.delete(token);
  }
}

export default new SingleUseToken();
