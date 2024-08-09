import { useParams } from 'react-router-dom';
import { Button, Card, Space, Table } from 'antd';
import {
  CopyOutlined,
  DeleteOutlined,
  DownloadOutlined,
  FileZipOutlined,
  FolderOutlined,
  ScissorOutlined,
} from '@ant-design/icons';
import React, { useEffect } from 'react';
import { getFileIcon, isZipFile } from '../utils/file-utils.tsx';

const DataManagement: React.FC = () => {
  const params = useParams();

  const endpoint = params.endpoint || '';
  const name = params.name || '';

  console.log('DataManagement', endpoint, name);

  const [dirFiles, setDirFiles] = React.useState<any[]>([]);

  const columns = [
    {
      title: '文件名',
      dataIndex: 'name',
      key: 'name',
      render: (text: any, col: any) => {
        return (
          <Button
            type={'link'}
            icon={col.type === 'dir' ? <FolderOutlined /> : getFileIcon(col.name)}
            style={{ padding: 0 }}
          >
            {text}
          </Button>
        );
      },
    },
    {
      title: '大小',
      dataIndex: 'size',
      key: 'size',
    },
    {
      title: '修改时间',
      dataIndex: 'mtime',
      key: 'mtime',
    },
    {
      title: '操作',
      key: 'action',
      render: (_text: any, record: any) => {
        return (
          <>
            {record.type === 'file' && <Button type="link" icon={<DownloadOutlined />} />}
            {isZipFile(record.name) && <Button type="link" icon={<FileZipOutlined />} />}
            <Button type="link" icon={<CopyOutlined />} />
            <Button type="link" icon={<ScissorOutlined />} />
            <Button type="link" danger icon={<DeleteOutlined />} />
          </>
        );
      },
    },
  ];

  const loadPathData = (path: string) => {
    console.log(`Loading path => ${path}`);
    setDirFiles([
      {
        name: '..',
        path: '',
        type: 'dir',
        size: '-',
        mtime: '-',
      },
      {
        name: 'data',
        path: '/data',
        type: 'dir',
        size: '-',
        mtime: '-',
      },
      {
        name: 'test.zip',
        path: '/test.zip',
        type: 'file',
        size: '13MB',
        mtime: '2023-01-01 00:00:00',
      },
      {
        name: 'test.txt',
        path: '/test.txt',
        type: 'file',
        size: '1KB',
        mtime: '2023-01-01 00:00:00',
      },
    ]);
  };

  useEffect(() => {
    loadPathData('/');
  }, []);

  return (
    <Card
      title={
        <Space>
          <FolderOutlined />
          <span>
            {name} 数据管理 - 当前目录： {'/'}
          </span>
        </Space>
      }
    >
      <Table dataSource={dirFiles} columns={columns} />
    </Card>
  );
};

export default DataManagement;
