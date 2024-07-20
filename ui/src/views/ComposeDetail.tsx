import React, { useEffect } from 'react';
import { ProCard } from '@ant-design/pro-components';
import { Button, Dropdown, Flex, Space, Tag } from 'antd';
import {
  Close,
  Delete,
  DocumentFolder,
  Edit,
  More,
  PlayOne,
  Refresh,
  Save,
  Square,
  UpdateRotation,
} from '@icon-park/react';
import Editor from '../component/Editor.tsx';
import Avatar from 'antd/es/avatar/avatar';
import ApiRequest from '../api/api-request.ts';
import { useParams } from 'react-router-dom';
import ComposeLog from '../component/ComposeLog.tsx';
import ComposeEdit from '../component/compose/compose-edit/ComposeEdit.tsx';
import { StackOperation, Stacks, StackStatus } from 'common/dist/types/stacks';
import ComposeOperation from '../component/compose/compose-operation/ComposeOperation.tsx';
import './compose.css';
import { parseCompose } from 'common/dist/utils/compose-utils';
import { Compose } from 'common/dist/types/compose';
import ContainerInfo from '../component/compose/container-info/ContainerInfoProps.tsx';
import ServerOutlined from '../icon/ServerOutlined.tsx';
import ColorTag from '../component/color-tag/ColorTag.tsx';
import { LinkOutlined } from '@ant-design/icons';
import './compose-detail.css';
import StatusTag from '../component/status-tag/StatusTag.tsx';

const ComposeDetail: React.FC = () => {
  const params = useParams();

  const [stack, setStack] = React.useState<Stacks>({
    name: '',
    composeFile: '',
    envFile: '',
    state: 'running',
    icon: '',
    endpoint: '',
    tags: [],
    links: [],
    protected: false,
  });
  const [status, setStatus] = React.useState<{ [key: string]: StackStatus }>({});

  const [compose, setCompose] = React.useState<Compose>({});
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
      const parsedCompose = parseCompose(res.data.composeFile);
      setCompose(parsedCompose);
    });
    ApiRequest.get(`/stacks/${params.endpoint}/${params.name}/status`).then((res) => {
      setStatus(res.data);
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
            <Flex vertical gap={5}>
              <Flex gap={5} align={'center'}>
                <Avatar size={'large'} src={stack.icon || '/docker.png'} style={{ marginRight: 8 }} />
                <Flex vertical gap={5}>
                  <Flex gap={3} align={'center'}>
                    <span style={{ marginRight: 8 }}>{stack.name}</span>
                    <Flex align={'center'}>
                      {stack.links.length > 0 && (
                        <Flex gap={3} className={'stack-link'}>
                          <LinkOutlined />
                          {stack.links.map((link) => (
                            <a href={`//${link}`} target="_blank">
                              {link}
                            </a>
                          ))}
                        </Flex>
                      )}
                    </Flex>
                  </Flex>
                  <Flex gap={5} align={'center'}>
                    <StatusTag status={stack.state} />
                    <Tag icon={<ServerOutlined />} color={'geekblue'}>
                      {stack.endpoint}
                    </Tag>
                    {stack.tags.map((tag, index) => {
                      return <ColorTag key={index} tag={tag} />;
                    })}
                  </Flex>
                </Flex>
              </Flex>
            </Flex>
          }
          extra={
            <>
              <Flex gap={10}>
                {stack.protected ? (
                  <>
                    <Button disabled icon={<DocumentFolder />}>
                      数据管理
                    </Button>
                    <Button disabled icon={<Save />}>
                      备份
                    </Button>
                  </>
                ) : (
                  <>
                    {stack.state !== 'running' && (
                      <Button type={'primary'} icon={<PlayOne />} onClick={() => handleOperation('up')}>
                        启动
                      </Button>
                    )}
                    {stack.state === 'running' && (
                      <Button type={'primary'} danger icon={<Square />} onClick={() => handleOperation('stop')}>
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
                    {!stack.protected && (
                      <Dropdown
                        menu={{
                          items: [
                            {
                              key: 'restart',
                              label: '重启容器',
                              icon: <Refresh />,
                              disabled: stack.state !== 'running',
                            },
                            {
                              key: 'down',
                              label: '取消部署',
                              icon: <Close />,
                              disabled: stack.state !== 'running',
                            },
                          ],
                          onClick: (e) => {
                            const key = e.key;
                            if (['restart', 'down'].includes(key)) {
                              handleOperation(key as StackOperation);
                            }
                          },
                        }}
                        placement="bottomRight"
                      >
                        <Button icon={<More />} />
                      </Dropdown>
                    )}
                  </>
                )}
              </Flex>
            </>
          }
        >
          <ComposeLog endpoint={endpoint} name={name} key={reconnectKey} />
        </ProCard>
        <ProCard title={'堆栈信息'}>
          <Flex gap={10} vertical>
            {Object.entries(compose?.services || {}).map(([key, service]) => (
              <ContainerInfo
                compose={service}
                name={key}
                endpoint={stack.address || 'localhost'}
                status={
                  status[key] || status[service.container_name || ''] || status[`${stack.name}-${key}-1`] || 'unknown'
                }
              />
            ))}
          </Flex>
        </ProCard>
        <ProCard title={'Compose配置'}>
          <Editor value={stack.composeFile} />
        </ProCard>
      </Space>
    </>
  );
};

export default ComposeDetail;
