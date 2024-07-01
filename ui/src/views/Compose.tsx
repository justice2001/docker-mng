import { Stack } from '../types/Stacks';
import { ProList, ProListProps } from '@ant-design/pro-components';
import { Button, Flex, Input, Segmented, Space, Tag } from 'antd';
import { AppstoreOutlined, BarsOutlined, LinkOutlined, SearchOutlined } from '@ant-design/icons';
import Avatar from 'antd/es/avatar/avatar';
import StatusBadge from '../component/StatusBadge';
import { StackStatusMap, stringToColor, textColor } from '../utils/stack-utils';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import { Plus } from '@icon-park/react';

const demoData: Stack[] = [
  {
    name: 'nginx',
    icon: 'https://www.svgrepo.com/show/373924/nginx.svg',
    tags: ['website'],
    endpoint: 'default',
    state: 'running',
    envFile: 'PORT=880\nSSL_PORT=8443',
    composeFile: 'version: 3.0\nservices....',
  },
  {
    name: 'redis',
    icon: 'https://cdn4.iconfinder.com/data/icons/redis-2/1451/Untitled-2-1024.png',
    tags: ['tools', 'dev'],
    endpoint: 'default',
    state: 'stopped',
    envFile: 'PORT=880\nSSL_PORT=8443',
    composeFile: 'version: 3.0\nservices....',
  },
];

const ComposeView: React.FC = () => {
  const navigate = useNavigate();

  const gridView: ProListProps<Stack> = {
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
        render: (_dom, row) => <Avatar src={row.icon} style={{ marginRight: 8 }} />,
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
                {row.tags.map((tag) => {
                  const color = stringToColor(tag);
                  return (
                    <Tag color={color} style={{ color: textColor(color) }}>
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

  return (
    <>
      <ProList<Stack>
        headerTitle={'堆栈列表'}
        dataSource={demoData}
        {...gridView}
        rowKey={'name'}
        toolBarRender={() => [
          <Button type={'primary'} icon={<Plus />}>
            添加
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
