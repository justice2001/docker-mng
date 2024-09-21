import path from 'node:path';

export const basePath = process.env.BASE_PATH || '/opt/docker';

export const logPath = path.join(basePath, 'logs');

export const stackPath = path.join(basePath, 'stacks');

export const dataPath = path.join(basePath, 'data');

export const configPath = path.join(basePath, 'config');

export const panelConfig = path.join(configPath, 'panel.json');

export const daemonConfig = path.join(configPath, 'daemon.json');
