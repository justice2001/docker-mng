import Koa from 'koa';
import * as http from 'node:http';
import io from 'socket.io';
import { navigation } from './service/router';
import logger from 'common/dist/core/logger';
import * as fs from 'node:fs';
import { configPath, dataPath, stackPath } from 'common/dist/core/base-path';
import * as child_process from 'node:child_process';
import configService from './service/config-service';
import authService from './service/auth-service';

export const dockerVersion = child_process
  .spawnSync('docker', ['version', '--format', '{{.Server.Version}}'])
  .stdout.toString()
  .trim();
export const daemonVersion = '1.0.0';

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

socketServer.on('disconnect', (socket) => {
  logger.debug(`user disconnected: ${socket.id}`);
  authService.disconnect(socket.id);
});

server.listen(3001, () => {
  console.log(`\n     _                        _                                       
  __| | _ __ ___           __| |  __ _   ___  _ __ ___    ___   _ __  
 / _\` || '_ \` _ \\  _____  / _\` | / _\` | / _ \\| '_ \` _ \\  / _ \\ | '_ \\ 
| (_| || | | | | ||_____|| (_| || (_| ||  __/| | | | | || (_) || | | |
 \\__,_||_| |_| |_|        \\__,_| \\__,_| \\___||_| |_| |_| \\___/ |_| |_|
 
    Daemon Version: ${daemonVersion}  |  Docker Version: ${dockerVersion}\n`);
  logger.info(`Server listening on port 3001`, 'app');
  logger.info(`You can use this token connect to the daemon: ${configService.getConfig('accessToken')}`);
});
