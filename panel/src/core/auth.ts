import configuration from './configuration';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

class AuthService {
  tokenList: string[] = [];
  secret: string = '';

  constructor() {
    this.secret = configuration.getConfig('secret') as string;
  }

  /**
   * 检查token
   * @param token 令牌
   * @returns {boolean} 是否位于鉴权列表中
   */
  async checkToken(token: string): Promise<boolean> {
    //token验证
    const err = await new Promise((resolve) => {
      jwt.verify(token, this.secret, function (err) {
        resolve(err);
      });
    });
    if (err) {
      return false;
    }
    // 验证令牌是否在鉴权列表中
    return this.tokenList.includes(token);
  }

  /**
   * 签发token
   * @param username 用户名
   * @param password 密码
   */
  async authorize(username: string, password: string) {
    // 验证用户名
    if (username !== configuration.getConfig('username')) {
      throw new Error('用户名或密码错误！');
    }
    // 验证密码
    if (!bcrypt.compareSync(password, configuration.getConfig('password') as string)) {
      throw new Error('用户名或密码错误！');
    }
    // 签发Token
    const token = jwt.sign({ username }, this.secret, { expiresIn: '90d' });
    this.tokenList.push(token);
    return token;
  }
}

export default new AuthService();
