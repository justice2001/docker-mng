import { useParams } from 'react-router-dom';
import { Button, Card, message, Popconfirm, Space, Table } from 'antd';
import { DeleteOutlined, FileOutlined, FolderOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import React, { useEffect } from 'react';
import { getFileIcon, pathNormalize, supportEdit, supportView } from '../utils/file-utils.tsx';
import apiRequest from '../api/api-request.ts';
import { CornerLeftUp, Edit } from '@icon-park/react';
import CreateFile from '../component/data-mgmt/create/CreateFile.tsx';
import FileEditor from '../component/data-mgmt/file-editor/FileEditor.tsx';

const DataManagement: React.FC = () => {
  const params = useParams();

  const endpoint = params.endpoint || '';
  const name = params.name || '';

  console.log('DataManagement', endpoint, name);

  const [dirFiles, setDirFiles] = React.useState<any[]>([]);
  const [currentPath, setPath] = React.useState('/');

  // Create Dir Var
  const [type, setType] = React.useState<'dir' | 'file'>('dir');
  const [createOpen, setCreateOpen] = React.useState(false);
  // File Editor
  const [filePath, setFilePath] = React.useState('');
  const [fileEditorOpen, setFileEditorOpen] = React.useState(false);

  const onFileClick = (_: string, col: any) => {
    console.log('Clicked', col);
    if (col.type === 'dir' || col.type === 'dot') {
      loadPathData(pathNormalize(`${currentPath}/${col.name}`));
    } else {
      if (supportEdit(col.name)) {
        editFile(col.name);
      } else if (supportView(col.name)) {
      } else {
        message.error('该文件格式暂不支持预览或编辑');
      }
      // TODO Edit or preview
    }
  };

  const editFile = (file: string) => {
    setFilePath(pathNormalize(`${currentPath}/${file}`));
    setFileEditorOpen(true);
  };

  const deleteFile = (file: string) => {
    apiRequest.delete(`/data/${endpoint}/${name}/file?path=${pathNormalize(`${currentPath}/${file}`)}`).then(() => {
      message.success('删除成功');
      loadPathData(currentPath);
    });
  };

  const openCreateModal = (type: 'dir' | 'file') => {
    setType(type);
    setCreateOpen(true);
  };

  const columns = [
    {
      title: '文件名',
      dataIndex: 'name',
      key: 'name',
      render: (text: any, col: any) => {
        return (
          <Button
            type={'link'}
            icon={getFileIcon(col.name, col.type)}
            style={{ padding: 0 }}
            onClick={() => onFileClick(text, col)}
          >
            {text}
          </Button>
        );
      },
    },
    {
      title: '大小',
      dataIndex: 'size',
    },
    {
      title: '权限',
      dataIndex: 'permission',
    },
    {
      title: '拥有者',
      dataIndex: 'owner',
    },
    {
      title: '组',
      dataIndex: 'group',
    },
    {
      title: '修改时间',
      dataIndex: 'lastModified',
    },
    {
      title: '操作',
      key: 'action',
      render: (_text: any, record: any) => {
        return (
          <>
            {supportEdit(record.name) && <Button type="link" icon={<Edit />} onClick={() => editFile(record.name)} />}
            {/*{record.type === 'file' && <Button type="link" icon={<DownloadOutlined />} />}*/}
            {/*{isZipFile(record.name) && <Button type="link" icon={<FileZipOutlined />} />}*/}
            {/*<Button type="link" icon={<CopyOutlined />} />*/}
            {/*<Button type="link" icon={<ScissorOutlined />} />*/}
            {record.type === 'file' && (
              <Popconfirm
                title="删除文件"
                description={`你确定要删除${record.name}吗？`}
                icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                onConfirm={() => deleteFile(record.name)}
              >
                <Button type="link" danger icon={<DeleteOutlined />} />
              </Popconfirm>
            )}
          </>
        );
      },
    },
  ];

  const loadPathData = (path: string) => {
    setPath(path);
    console.log(`Loading path => ${path}`);
    apiRequest.get(`/data/${endpoint}/${name}?path=${path}`).then((res) => {
      setDirFiles(res.data);
    });
  };

  useEffect(() => {
    loadPathData('/');
  }, []);

  return (
    <>
      <CreateFile
        endpoint={endpoint}
        stack={name}
        type={type}
        open={createOpen}
        path={currentPath}
        onClose={() => setCreateOpen(false)}
        onCreate={() => {
          setCreateOpen(false);
          loadPathData(currentPath);
        }}
      />
      <FileEditor
        endpoint={endpoint}
        stack={name}
        path={filePath}
        open={fileEditorOpen}
        onClose={() => setFileEditorOpen(false)}
      />

      <Card
        title={
          <Space>
            <FolderOutlined />
            <span>
              {name} 数据管理 - 当前目录： {currentPath}
            </span>
          </Space>
        }
      >
        <Space
          style={{
            marginBottom: 10,
          }}
        >
          {currentPath !== '/' && (
            <Button
              type="primary"
              icon={<CornerLeftUp />}
              onClick={() => loadPathData(pathNormalize(`${currentPath}/..`))}
            >
              上一级
            </Button>
          )}
          <Button icon={<FolderOutlined />} onClick={() => openCreateModal('dir')}>
            新建文件夹
          </Button>
          <Button icon={<FileOutlined />} onClick={() => openCreateModal('file')}>
            新建文件
          </Button>
        </Space>
        <Table dataSource={dirFiles} columns={columns} rowKey="name" size="small" />
      </Card>
    </>
  );
};

export default DataManagement;
