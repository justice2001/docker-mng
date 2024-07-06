import Koa from 'koa';
import * as http from 'node:http';
import io from 'socket.io';
import { navigation } from './service/router';
import logger from 'common/dist/core/logger';
import * as fs from 'node:fs';
import { configPath, dataPath, stackPath } from 'common/dist/core/base-path';

// 处理必要的文件夹
if (!fs.existsSync(configPath)) {
  fs.mkdirSync(configPath, { recursive: true });
}
if (!fs.existsSync(stackPath)) {
  fs.mkdirSync(stackPath, { recursive: true });
}
if (!fs.existsSync(dataPath)) {
  fs.mkdirSync(dataPath, { recursive: true });
}

const app = new Koa();

app.use(async (ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', '*');
  ctx.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  ctx.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  await next();
});

const server = http.createServer(app.callback());

export const socketServer = new io.Server(server, {
  cors: {
    origin: '*',
  },
});

socketServer.on('connect', (socket) => {
  logger.info(`user connected: ${socket.id}`);

  navigation(socket);
});

server.listen(3001, () => {
  logger.info(`Server listening on port 3001`, 'app');
});
