import { ReactNode } from 'react';
import { FileZipOutlined } from '@ant-design/icons';
import { Config, Log, Notes } from '@icon-park/react';

const map: { [key: string]: ReactNode } = {
  gz: <FileZipOutlined />,
  tar: <FileZipOutlined />,
  zip: <FileZipOutlined />,
  tgz: <FileZipOutlined />,
  rar: <FileZipOutlined />,
  '7z': <FileZipOutlined />,
  yaml: <Config />,
  conf: <Config />,
  yml: <Config />,
  env: <Config />,
  md: <Notes />,
  log: <Log />,
};

export default map;

export const supportedEditExt = ['md', 'yaml', 'yml', 'conf', 'env'];

export const editLanguages = {
  md: 'markdown',
  yaml: 'yaml',
  yml: 'yaml',
  conf: 'yaml',
  env: 'properties',
};
