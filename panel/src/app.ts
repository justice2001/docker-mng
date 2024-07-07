import Koa from 'koa';
import bodyParser from 'koa-body';
import RemoteManage from './services/remote-manage';
import * as process from 'node:process';
import { mountRouters } from './router';
import serve from 'koa-static';
import logger from 'common/dist/core/logger';
import path from 'node:path';

async function main() {
  logger.info('Docker Manager version 1.0.0');
  logger.info('Daemon Version 1.0.0');

  const app: Koa = new Koa();

  app.use(serve(path.join(__dirname, 'public')));
  app.use(bodyParser());

  app.use(async (ctx, next) => {
    logger.info(`Received request: [${ctx.method}] ${ctx.url}`);
    logger.debug(`Received request: [${ctx.method}] ${ctx.url} data: ${JSON.stringify(ctx.request.body)}`);
    await next();
    logger.debug(`Response content: [${ctx.method}] ${ctx.url} data: ${JSON.stringify(ctx.response.body)}`);
  });

  mountRouters(app);

  await RemoteManage.initialize();

  const port = process.env.PORT || 3000;

  app.listen(port, () => {
    logger.info('App listening on port ' + port);
  });
}

main().catch((err) => {
  logger.error(err);
  process.exit(1);
});
