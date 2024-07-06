import { ProList, ProListProps } from '@ant-design/pro-components';
import { Button, Flex, Input, Segmented, Space, Tag } from 'antd';
import { AppstoreOutlined, BarsOutlined, LinkOutlined, SearchOutlined } from '@ant-design/icons';
import Avatar from 'antd/es/avatar/avatar';
import StatusBadge from '../component/StatusBadge';
import { StackStatusMap, stringToColor, textColor } from '../utils/stack-utils';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { Plus } from '@icon-park/react';
import { Stacks } from 'common/dist/types/stacks';
import apiRequest from '../api/api-request.ts';
import { v4 } from 'uuid';
import { NodeData } from 'common/dist/types/daemon';

const ComposeView: React.FC = () => {
  const navigate = useNavigate();
  const [stack, setStack] = useState<Stacks[]>([]);

  useEffect(() => {
    setStack([]);
    apiRequest.get('/overview').then((res) => {
      const servers = res.data.servers as NodeData[];
      let stacks: Stacks[] = [];
      for (const server of servers) {
        if (server.nodeInfo.nodeStatus === 'connected') {
          apiRequest.get(`/stacks/${server.nodeName}`).then((res) => {
            const data = res.data as Stacks[];
            stacks = stacks.concat(data);
            setStack(stacks);
          });
        }
      }
    });
  }, []);

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
        render: (_dom, row) => <Avatar src={row.icon || '/docker.svg'} style={{ marginRight: 8 }} />,
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

  return (
    <>
      <ProList<Stacks>
        headerTitle={'堆栈列表'}
        dataSource={stack}
        rowKey={(_) => v4()}
        {...gridView}
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
