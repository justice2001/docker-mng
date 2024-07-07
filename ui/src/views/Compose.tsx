import { ProList, ProListProps } from '@ant-design/pro-components';
import { Button, Flex, Input, Segmented, Space, Tag } from 'antd';
import { AppstoreOutlined, BarsOutlined, LinkOutlined, SearchOutlined } from '@ant-design/icons';
import Avatar from 'antd/es/avatar/avatar';
import StatusBadge from '../component/StatusBadge';
import { StackStatusMap, stringToColor, textColor } from '../utils/stack-utils';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { Plus, Refresh } from '@icon-park/react';
import { Stacks } from 'common/dist/types/stacks';
import apiRequest from '../api/api-request.ts';
import { v4 } from 'uuid';
import { NodeData } from 'common/dist/types/daemon';
import './compose.css';
import ComposeEdit from '../component/compose/compose-edit/ComposeEdit.tsx';

const ComposeView: React.FC = () => {
  const navigate = useNavigate();
  const [stack, setStack] = useState<Stacks[]>([]);
  const [loading, setLoading] = useState(false);

  const [composeAdd, setComposeAdd] = useState(false);

  const loadStacks = () => {
    setStack([]);
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
        const stacks = res.flatMap((stack) => stack);
        setStack(stacks);
        setLoading(false);
      });
    });
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
                <LinkOutlined />
                <a href={'//localhost:8080'}>8080</a>
              </Space>
              <Flex gap={'4px 0'} wrap>
                <Tag color={'processing'}>{row.endpoint}</Tag>
                {row.tags.map((tag, index) => {
                  const color = stringToColor(tag);
                  return (
                    <Tag key={index} color={color} style={{ color: textColor(color) }}>
                      {tag}
                    </Tag>
                  );
                })}
              </Flex>
            </Space>
          );
        },
      },
      actions: {
        render: () => [<a>编辑</a>, <a>删除</a>],
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
        dataSource={stack}
        rowKey={(_) => v4()}
        {...gridView}
        toolBarRender={() => [
          <Button type={'primary'} icon={<Plus />} onClick={() => setComposeAdd(true)}>
            添加
          </Button>,
          <Button icon={<Refresh />} onClick={loadStacks}>
            刷新
          </Button>,
          <Input prefix={<SearchOutlined />} placeholder={'Search'} />,
          <Segmented
            options={[
              { label: '', value: 'List', icon: <BarsOutlined /> },
              { label: '', value: 'Kanban', icon: <AppstoreOutlined /> },
            ]}
          />,
        ]}
      />
    </>
  );
};

export default ComposeView;
