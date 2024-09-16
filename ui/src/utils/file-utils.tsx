import { FileOutlined, FolderOutlined } from '@ant-design/icons';
import { CornerLeftUp } from '@icon-park/react';
import fileMap, { supportedEditExt } from './file-map.tsx';

export function getFileIcon(filename: string, type: string) {
  if (type === 'dir') {
    return <FolderOutlined />;
  }
  if (type === 'dot') {
    return <CornerLeftUp />;
  }
  const ext = filename.split('.').pop()?.toLowerCase();
  if (!ext) return <FileOutlined />;

  return fileMap[ext] || <FileOutlined />;
}

export function getFileExt(filename: string) {
  const ext = filename.split('.').pop()?.toLowerCase();
  if (!ext) return '';
  return ext;
}

export function isZipFile(filename: string) {
  return ['zip', 'tar', 'gz', 'bz2', 'rar', '7z'].includes(getFileExt(filename));
}

export function supportEdit(filename: string) {
  return supportedEditExt.includes(getFileExt(filename));
}

export function supportView(filename: string) {
  return ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'].includes(getFileExt(filename));
}

export function pathNormalize(path: string) {
  const parts = path.split('/'); // 将路径按 '/' 分割
  const stack = [];

  for (let part of parts) {
    if (part === '' || part === '.') {
      // 忽略空字符串和当前目录的符号 '.'
    } else if (part === '..') {
      // 如果是 '..'，则返回上一级目录（从栈中弹出一个元素）
      if (stack.length > 0) {
        stack.pop();
      }
    } else {
      // 否则将目录或文件名压入栈
      stack.push(part);
    }
  }

  // 如果路径以 '/' 开头，表示是绝对路径，结果也应当以 '/' 开头
  const resolvedPath = (path.startsWith('/') ? '/' : '') + stack.join('/');

  return resolvedPath || '.'; // 如果解析后为空，则返回当前目录 '.'
}
