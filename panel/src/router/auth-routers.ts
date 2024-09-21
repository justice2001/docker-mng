import Router from 'koa-router';
import auth from '../core/auth';
import logger from 'common/dist/core/logger';

const authRouters = new Router({
  prefix: '/auth',
});

authRouters.post('/login', async (ctx) => {
  if (!ctx.request.body.username || !ctx.request.body.password) {
    ctx.status = 400;
    ctx.body = {
      message: 'username or password is empty',
    };
    return;
  }
  try {
    const token = await auth.authorize(ctx.request.body.username, ctx.request.body.password);
    ctx.body = {
      token,
    };
  } catch (e: any) {
    logger.error('login failed: ' + e);
    ctx.status = 530;
    ctx.body = {
      message: e.message,
    };
  }
});

export default authRouters;
