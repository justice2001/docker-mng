import React, { useEffect } from 'react';
import { ProCard } from '@ant-design/pro-components';
import { Button, Flex, Space } from 'antd';
import { Delete, DocumentFolder, Edit, PlayOne, Square, UpdateRotation } from '@icon-park/react';
import Editor from '../component/Editor.tsx';
import { Stack } from '../types/Stacks.ts';
import Avatar from 'antd/es/avatar/avatar';
import StatusBadge from '../component/StatusBadge.tsx';
import { StackStatusMap } from '../utils/stack-utils.ts';
import ApiRequest from '../api/api-request.ts';
import { useParams } from 'react-router-dom';
import ComposeLog from '../component/ComposeLog.tsx';

const ComposeDetail: React.FC = () => {
  const params = useParams();

  const [stack, setStack] = React.useState<Stack>({
    name: '',
    composeFile: '',
    envFile: '',
    state: 'running',
    icon: '',
    endpoint: '',
    tags: [],
  });

  const endpoint = params.endpoint || '';
  const name = params.name || '';

  useEffect(() => {
    ApiRequest.get(`/stacks/${params.endpoint}/${params.name}`).then((res) => {
      setStack(res.data);
    });
  }, []);

  return (
    <Space direction={'vertical'} style={{ width: '100%' }}>
      <ProCard
        title={
          <>
            <Flex gap={5} align={'center'}>
              <Avatar size={'large'} src={stack.icon || '/vite.svg'} style={{ marginRight: 8 }} />
              <Flex vertical>
                <span style={{ marginRight: 8 }}>{stack.name}</span>
                <StatusBadge map={StackStatusMap} value={stack.state} />
              </Flex>
            </Flex>
          </>
        }
        extra={
          <>
            <Flex gap={10}>
              {stack.state !== 'running' && (
                <Button type={'primary'} icon={<PlayOne />}>
                  启动
                </Button>
              )}
              {stack.state === 'running' && (
                <Button type={'primary'} danger icon={<Square />}>
                  停止
                </Button>
              )}
              <Button icon={<Edit />}>编辑</Button>
              <Button icon={<UpdateRotation />}>更新</Button>
              <Button icon={<DocumentFolder />}>数据管理</Button>
              <Button danger icon={<Delete />}>
                删除
              </Button>
            </Flex>
          </>
        }
      >
        <ComposeLog endpoint={endpoint} name={name} />
      </ProCard>
      <ProCard title={'Compose配置'}>
        <Editor value={stack.composeFile} />
      </ProCard>
    </Space>
  );
};

export default ComposeDetail;
