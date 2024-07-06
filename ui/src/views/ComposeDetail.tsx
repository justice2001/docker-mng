import React, { useEffect } from 'react';
import { ProCard } from '@ant-design/pro-components';
import { Button, Flex, Space } from 'antd';
import { Delete, DocumentFolder, Edit, PlayOne, Save, Square, UpdateRotation } from '@icon-park/react';
import Editor from '../component/Editor.tsx';
import { Stack } from '../types/Stacks.ts';
import Avatar from 'antd/es/avatar/avatar';
import StatusBadge from '../component/StatusBadge.tsx';
import { StackStatusMap } from '../utils/stack-utils.ts';
import ApiRequest from '../api/api-request.ts';
import { useParams } from 'react-router-dom';
import ComposeLog from '../component/ComposeLog.tsx';
import ComposeEdit from '../component/compose/compose-edit/ComposeEdit.tsx';
import { StackOperation, Stacks } from 'common/dist/types/stacks';
import ComposeOperation from '../component/compose/compose-operation/ComposeOperation.tsx';

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
  const [edit, setEdit] = React.useState(false);
  const [reconnectKey, setReconnectKey] = React.useState(0);

  const [opOpen, setOpOpen] = React.useState(false);
  const [operation, setOperation] = React.useState<StackOperation>('up');

  const handleOperation = (operation: StackOperation) => {
    setOperation(operation);
    setOpOpen(true);
  };

  const endpoint = params.endpoint || '';
  const name = params.name || '';

  useEffect(() => {
    getInfo();
  }, []);

  const getInfo = () => {
    ApiRequest.get(`/stacks/${params.endpoint}/${params.name}`).then((res) => {
      setStack(res.data);
    });
  };

  const updateCompose = (stack: Stacks) => {
    console.log('submit, ', stack);
    ApiRequest.put(`/stacks/${params.endpoint}/${params.name}`, {
      data: {
        name: stack.name,
        composeFile: stack.composeFile,
        envFile: stack.envFile,
      },
    }).then((res) => {
      if (res.data.ok) {
        setEdit(false);
        handleOperation('up');
      }
    });
  };

  return (
    <>
      <ComposeEdit
        open={edit}
        endpoint={endpoint}
        name={name}
        onSubmit={updateCompose}
        onClose={() => setEdit(false)}
      />
      <ComposeOperation
        open={opOpen}
        endpoint={endpoint}
        name={name}
        operation={operation}
        onClose={() => setOpOpen(false)}
        onRefresh={(log: boolean) => {
          getInfo();
          log && setReconnectKey(reconnectKey + 1);
        }}
      />

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
                  <Button type={'primary'} icon={<PlayOne />} onClick={() => handleOperation('up')}>
                    启动
                  </Button>
                )}
                {stack.state === 'running' && (
                  <Button type={'primary'} danger icon={<Square />} onClick={() => handleOperation('down')}>
                    停止
                  </Button>
                )}
                <Button icon={<Edit />} onClick={() => setEdit(true)}>
                  编辑
                </Button>
                <Button icon={<UpdateRotation />} onClick={() => handleOperation('update')}>
                  更新
                </Button>
                <Button disabled icon={<DocumentFolder />}>
                  数据管理
                </Button>
                <Button disabled icon={<Save />}>
                  备份
                </Button>
                <Button disabled danger icon={<Delete />}>
                  删除
                </Button>
              </Flex>
            </>
          }
        >
          <ComposeLog endpoint={endpoint} name={name} key={reconnectKey} />
        </ProCard>
        <ProCard title={'Compose配置'}>
          <Editor value={stack.composeFile} />
        </ProCard>
      </Space>
    </>
  );
};

export default ComposeDetail;
