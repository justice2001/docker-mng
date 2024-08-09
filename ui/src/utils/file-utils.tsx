import { FileOutlined, FileZipOutlined } from '@ant-design/icons';

export function getFileIcon(filename: string) {
  const ext = filename.split('.').pop()?.toLowerCase();
  if (!ext) return <FileOutlined />;
  if (isZipFile(filename)) {
    return <FileZipOutlined />;
  }
  return <FileOutlined />;
}

export function isZipFile(filename: string) {
  const ext = filename.split('.').pop()?.toLowerCase();
  if (!ext) return false;
  return ['zip', 'tar', 'gz', 'bz2', 'rar', '7z'].includes(ext);
}
