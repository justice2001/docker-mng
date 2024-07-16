import { ProList, ProListProps } from '@ant-design/pro-components';
import { Button, Flex, Input, Segmented, Space, Tag } from 'antd';
import { AppstoreOutlined, BarsOutlined, LinkOutlined, SearchOutlined } from '@ant-design/icons';
import Avatar from 'antd/es/avatar/avatar';
import StatusBadge from '../component/StatusBadge';
import { StackStatusMap } from '../utils/stack-utils';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { Api, Plus, Refresh } from '@icon-park/react';
import { Stacks } from 'common/dist/types/stacks';
import apiRequest from '../api/api-request.ts';
import { v4 } from 'uuid';
import { NodeData } from 'common/dist/types/daemon';
import './compose.css';
import ComposeEdit from '../component/compose/compose-edit/ComposeEdit.tsx';
import ServerOutlined from '../icon/ServerOutlined.tsx';
import ColorTag from '../component/color-tag/ColorTag.tsx';

type ShowType = 'list' | 'grid';

let stacks: Stacks[] = [];

const ComposeView: React.FC = () => {
  const navigate = useNavigate();
  const [filteredStacks, setFilteredStacks] = useState<Stacks[]>([]);
  const [loading, setLoading] = useState(false);
  const [showType, setShowType] = useState<ShowType>('list');

  const [composeAdd, setComposeAdd] = useState(false);

  const host = window.location.host;

  const loadStacks = () => {
    stacks = [];
    setLoading(true);
    apiRequest.get('/overview/servers').then((res) => {
      const servers = res.data.servers as NodeData[];
      Promise.all(
        servers.map(async (server) => {
          if (server.nodeInfo.nodeStatus === 'connected') {
            const res = await apiRequest.get(`/stacks/${server.nodeName}`);
            return res.data as Stacks[];
          } else {
            return Promise.resolve([]);
          }
        }),
      ).then((res) => {
        stacks = res.flatMap((stack) => stack);
        setFilteredStacks(stacks);
        setLoading(false);
      });
    });
  };

  const search = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFilteredStacks(
      stacks.filter(
        (st) =>
          st.name.includes(value) ||
          st.endpoint.includes(value) ||
          st.tags.filter((tag) => tag.includes(value)).length > 0,
      ),
    );
  };

  useEffect(loadStacks, []);

  const gridView: ProListProps<Stacks> = {
    grid: {
      gutter: 16,
      column: 3,
    },
    metas: {
      title: {
        render: (_dom, row) => (
          <>
            <div onClick={() => navigate(`/compose/${row.endpoint}/${row.name}`)}>{row.name}</div>
            <StatusBadge map={StackStatusMap} value={row.state} />
          </>
        ),
      },
      avatar: {
        dataIndex: 'icon',
        render: (_dom, row) => <Avatar shape="square" src={row.icon || '/docker.png'} style={{ marginRight: 8 }} />,
      },
      content: {
        render: (_dom, row) => {
          return (
            <Space direction={'vertical'}>
              <Space>
                <Api />
                <a href={`//${row.address || host}:8080`}>8080</a>
              </Space>
              <Space>
                {row.links.length > 0 && (
                  <>
                    <LinkOutlined />
                    {row.links.map((link) => (
                      <a href={`//${link}`} target="_blank">
                        {link}
                      </a>
                    ))}
                  </>
                )}
              </Space>
              <Flex gap={'4px 0'} wrap>
                <Tag color={'geekblue'} icon={<ServerOutlined />}>
                  {row.endpoint}
                </Tag>
                {row.tags.map((tag, index) => {
                  return <ColorTag key={index} tag={tag} />;
                })}
              </Flex>
            </Space>
          );
        },
      },
      actions: {
        render: (_, row) => {
          if (row.protected) {
            return [<Tag color={'warning'}>受保护的容器</Tag>];
          }
          return [<a>编辑</a>, <a>删除</a>];
        },
      },
    },
  };

  const listView: ProListProps<Stacks> = {
    metas: {
      title: {
        render: (_dom, row) => (
          <>
            <div onClick={() => navigate(`/compose/${row.endpoint}/${row.name}`)}>{row.name}</div>
          </>
        ),
      },
      subTitle: {
        render: (_dom, row) => (
          <Flex gap={'4px 0'} wrap style={{ fontWeight: 'normal' }}>
            <Tag icon={<ServerOutlined />} color={'geekblue'}>
              {row.endpoint}
            </Tag>
            {row.tags.map((tag, index) => {
              return <ColorTag key={index} tag={tag} />;
            })}
          </Flex>
        ),
      },
      description: {
        render: (_dom, row) => (
          <>
            <StatusBadge map={StackStatusMap} value={row.state} />
          </>
        ),
      },
      content: {
        render: (_dom, row) => (
          <>
            <Space>
              <Api />
              <a href={`//${row.address || host}:8080`}>8080</a>
            </Space>
            <Space>
              {row.links.length > 0 && (
                <>
                  <LinkOutlined />
                  {row.links.map((link) => (
                    <a href={`//${link}`} target="_blank">
                      {link}
                    </a>
                  ))}
                </>
              )}
            </Space>
          </>
        ),
      },
      avatar: {
        dataIndex: 'icon',
        render: (_dom, row) => <Avatar shape="square" src={row.icon || '/docker.png'} style={{ marginRight: 8 }} />,
      },
      actions: {
        render: (_, row) => {
          if (row.protected) {
            return [<Tag color={'warning'}>受保护的容器</Tag>];
          }
          return [<a>编辑</a>, <a>删除</a>];
        },
      },
    },
  };

  const addSubmit = (values: Stacks) => {
    console.log(values);
    apiRequest
      .post(`/stacks/${values.endpoint}`, {
        name: values.name,
        envFile: values.envFile,
        composeFile: values.composeFile,
      })
      .then((_) => {
        loadStacks();
        setComposeAdd(false);
      });
  };

  return (
    <>
      <ComposeEdit open={composeAdd} onSubmit={addSubmit} onClose={() => setComposeAdd(false)} isAdd />

      <ProList<Stacks>
        loading={loading}
        headerTitle={'堆栈列表'}
        dataSource={filteredStacks}
        rowKey={(_) => v4()}
        {...(showType === 'list' ? listView : gridView)}
        toolBarRender={() => [
          <Button type={'primary'} icon={<Plus />} onClick={() => setComposeAdd(true)}>
            添加
          </Button>,
          <Button icon={<Refresh />} onClick={loadStacks}>
            刷新
          </Button>,
          <Input prefix={<SearchOutlined />} placeholder={'Search'} onChange={search} />,
          <Segmented
            options={[
              { label: '', value: 'list', icon: <BarsOutlined /> },
              { label: '', value: 'grid', icon: <AppstoreOutlined /> },
            ]}
            onChange={setShowType}
          />,
        ]}
      />
    </>
  );
};

export default ComposeView;
