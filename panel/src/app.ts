import Koa from 'koa';
import bodyParser from 'koa-body';
import RemoteManage from './services/remote-manage';
import * as process from 'node:process';
import { mountRouters } from './router';
import serve from 'koa-static';
import logger from 'common/dist/core/logger';
import path from 'node:path';
import historyApiFallback from 'koa2-connect-history-api-fallback';
import { authMiddleware } from './middlewares/auth-middleware';

export const panelVersion = '1.0.0';

async function main() {
  const app: Koa = new Koa();

  app.use(historyApiFallback({ whiteList: ['/api'] }));
  app.use(serve(path.join(__dirname, 'public')));
  app.use(bodyParser());

  app.use(async (ctx, next) => {
    logger.info(`Received request: [${ctx.method}] ${ctx.url}`);
    logger.debug(`Received headers: ${JSON.stringify(ctx.headers)}`);
    logger.debug(`Received request: [${ctx.method}] ${ctx.url} data: ${JSON.stringify(ctx.request.body)}`);
    await next();
    logger.debug(`Response content: [${ctx.method}] ${ctx.url} data: ${JSON.stringify(ctx.response.body)}`);
  });

  app.use(authMiddleware);

  mountRouters(app);

  await RemoteManage.initialize();

  const port = process.env.PORT || 3000;

  app.listen(port, () => {
    console.log(`\n      _                       ____                           _
   __| |  _ __ ___           |  _ \\    __ _   _ __     ___  | |
  / _\` | | '_ \` _ \\   _____  | |_) |  / _\` | | '_ \\   / _ \\ | |
 | (_| | | | | | | | |_____| |  __/  | (_| | | | | | |  __/ | |
  \\__,_| |_| |_| |_|         |_|      \\__,_| |_| |_|  \\___| |_|

               Panel Version: ${panelVersion}\n`);
    logger.info('App listening on port ' + port);
  });
}

main().catch((err) => {
  logger.error(err);
  process.exit(1);
});
