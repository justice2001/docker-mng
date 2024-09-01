import { response, routerApp } from '../service/router';
import SingleUseToken from '../service/single-use-token';
import authService from '../service/auth-service';

routerApp.on('auth/single-token', async (ctx, data) => {
  const stringPromise = await SingleUseToken.createToken(data.permission, data.info);
  response(ctx, stringPromise);
});

routerApp.on(
  'auth',
  async (ctx, data) => {
    try {
      authService.authorize(data.token, ctx.socket.id);
      response(ctx, {
        ok: true,
        message: '认证成功',
      });
    } catch (e: any) {
      response(ctx, {
        ok: false,
        message: e.message,
      });
    }
  },
  0,
);
