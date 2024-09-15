import * as fs from 'node:fs';
import * as path from 'node:path';

export interface FileInfo {
  type: 'file' | 'dir' | 'dot';
  name: string;
  size: number;
  lastModified: Date;
  permission: string;
  owner: string;
  group: string;
}

function convertToRwx(mode: number) {
  const owner = (mode & 0o700) >> 6; // 拥有者权限
  const group = (mode & 0o070) >> 3; // 组权限
  const others = mode & 0o007; // 其他用户权限

  return (
    `${owner & 4 ? 'r' : '-'}${owner & 2 ? 'w' : '-'}${owner & 1 ? 'x' : '-'}` +
    `${group & 4 ? 'r' : '-'}${group & 2 ? 'w' : '-'}${group & 1 ? 'x' : '-'}` +
    `${others & 4 ? 'r' : '-'}${others & 2 ? 'w' : '-'}${others & 1 ? 'x' : '-'}`
  );
}

// TODO 获取GID和UID对应用户
async function getFileInfo(filePath: string): Promise<FileInfo> {
  try {
    const stats = await fs.promises.stat(filePath);
    return {
      name: path.basename(filePath), // 文件或文件夹名称
      type: stats.isDirectory() ? 'dir' : 'file', // 类型
      size: stats.size, // 文件大小
      lastModified: stats.birthtime, // 创建日期
      permission: `${stats.isDirectory() ? 'd' : '-'}${convertToRwx(stats.mode)}`, // 权限信息
      owner: stats.uid.toString(),
      group: stats.gid.toString(),
    };
  } catch (err: any) {
    throw new Error(`Error getting file info: ${err.message}`);
  }
}

// 遍历目录，获取所有文件和文件夹的信息
async function getDirectoryInfo(basePath: string, aPath: string) {
  try {
    const dirPath = path.join(basePath, aPath);
    const items = await fs.promises.readdir(dirPath, { withFileTypes: true });
    const result: FileInfo[] = [];
    if (basePath !== dirPath) {
      result.push({
        name: '..',
        type: 'dot',
        size: 0,
        lastModified: new Date(),
        permission: '0',
        owner: '',
        group: '',
      });
    }
    for (const item of items) {
      const itemPath = path.join(dirPath, item.name);
      const info = await getFileInfo(itemPath);
      result.push(info);
    }
    return result;
  } catch (err: any) {
    throw new Error(`Error reading directory: ${err.message}`);
  }
}

export default {
  getFileInfo,
  getDirectoryInfo,
};
