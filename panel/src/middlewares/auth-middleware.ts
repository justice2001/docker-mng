import Koa from 'koa';
import logger from 'common/dist/core/logger';
import auth from '../core/auth';

export const authMiddleware: Koa.Middleware<Koa.DefaultState, Koa.DefaultContext, any> = async (ctx, next) => {
  const safetyRoutes = ['/api/auth/login'];
  // 检查是否为安全路由
  if (safetyRoutes) {
    if (Array.isArray(safetyRoutes)) {
      for (const route of safetyRoutes) {
        const reg = new RegExp(route);
        if (reg.test(ctx.url)) {
          logger.debug('Allowed router: ' + ctx.url, 'auth');
          return await next();
        }
      }
    } else {
      throw new Error('safetyRoutes must be an array');
    }
  }
  // 获取令牌
  const token = getTokenFromHeader(ctx);
  // 验证 jwt
  if (await auth.checkToken(token)) {
    return await next();
  } else {
    ctx.status = 401;
    ctx.body = {
      message: 'Unauthorized',
    };
  }
};

export const getTokenFromHeader = (ctx: Koa.ParameterizedContext) => {
  // 暂时只处理来自 header 的 token
  const token = ctx.request.headers['authorization'];
  if (!token) return '';
  return token.replace('Bearer ', '');
};
