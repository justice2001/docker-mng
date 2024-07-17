import React, { useEffect } from 'react';
import { ProCard, StatisticCard } from '@ant-design/pro-components';
import { Button, Space } from 'antd';
import NodeList from '../component/home/NodeList';
import RingChart from '../component/RingChart.tsx';
import { NodeData } from 'common/dist/types/daemon.ts';
import apiRequest from '../api/api-request.ts';
import { PlusOutlined } from '@ant-design/icons';
import ServerAddModel, { ServerAddData } from '../component/home/ServerAddModel.tsx';
import ApiRequest from '../api/api-request.ts';

type ResourceStat = {
  cpu: number;
  memory: number;
  disk?: number;
};

let serverInterval = -1;

const HomeView: React.FC = () => {
  const [resStat] = React.useState<ResourceStat>({
    cpu: 0,
    memory: 0,
    disk: 0,
  });

  const [servers, setServers] = React.useState<NodeData[]>([]);
  const [stackCount, setStackCount] = React.useState({
    all: 0,
    running: 0,
    processing: 0,
    warning: 0,
    stopped: 0,
    unknown: 0,
  });

  const [serverCount, setServerCount] = React.useState<{
    count: number;
    active: number;
  }>({ count: 0, active: 0 });

  const [modalVisible, setModalVisible] = React.useState<boolean>(false);

  useEffect(() => {
    loadData();

    return () => {
      clearInterval(serverInterval);
      serverInterval = -1;
    };
  }, []);

  const interval = (fn: () => void) => {
    fn.apply(this);
    return setInterval(() => {
      fn.apply(this);
    }, 2000);
  };

  const loadData = () => {
    apiRequest.get('overview/stacks').then((res) => {
      setStackCount(res.data);
    });
    // 刷新 server 信息
    if (serverInterval !== -1) {
      clearInterval(serverInterval);
    }
    serverInterval = interval(() => {
      apiRequest.get('overview/servers').then((r) => {
        console.log(r);
        setServers(r.data.servers);
        setServerCount({
          count: r.data.serverCount,
          active: r.data.activeServerCount,
        });
      });
    });
  };

  const addServer = (server: ServerAddData) => {
    ApiRequest.post('/nodes', server).then((res) => {
      if (res.data.ok) {
        setModalVisible(false);
        loadData();
      }
    });
  };

  return (
    <>
      <Space direction="vertical" style={{ width: '100%' }}>
        <ProCard headerBordered title={'容器概览'} bordered>
          <StatisticCard.Group>
            <StatisticCard
              statistic={{
                title: '总计',
                value: stackCount.all,
              }}
            />
            <StatisticCard.Divider />
            <StatisticCard
              statistic={{
                title: '未部署',
                value: stackCount.unknown,
                status: 'default',
              }}
            />
            <StatisticCard
              statistic={{
                title: '正在运行',
                value: stackCount.running,
                status: 'success',
              }}
            />
            <StatisticCard
              statistic={{
                title: '部署中',
                value: stackCount.processing,
                status: 'processing',
              }}
            />
            <StatisticCard
              statistic={{
                title: '状态异常',
                value: stackCount.warning,
                status: 'warning',
              }}
            />
            <StatisticCard
              statistic={{
                title: '已停止',
                value: stackCount.stopped,
                status: 'error',
              }}
            />
          </StatisticCard.Group>
        </ProCard>

        <ProCard title={'资源池'} bordered headerBordered>
          <StatisticCard.Group>
            <StatisticCard
              statistic={{
                title: '已注册节点',
                value: serverCount.count,
                status: 'default',
              }}
            />
            <StatisticCard
              statistic={{
                title: '已联机节点',
                value: serverCount.active,
                status: 'success',
              }}
            />
            <StatisticCard.Divider />
            <StatisticCard
              statistic={{
                title: 'CPU 占用率',
                value: (resStat.cpu * 100).toFixed(2) + '%',
              }}
              chart={<RingChart data={resStat.cpu} width={50} />}
              chartPlacement={'left'}
            />
            <StatisticCard
              statistic={{
                title: '内存占用率',
                value: (resStat.memory * 100).toFixed(2) + '%',
              }}
              chart={<RingChart data={resStat.memory} color={['#ffc245', '#E8EFF5']} width={50} />}
              chartPlacement={'left'}
            />
          </StatisticCard.Group>
        </ProCard>
        <ProCard
          title={'节点列表'}
          bordered
          headerBordered
          extra={[
            <Button type={'primary'} icon={<PlusOutlined />} onClick={() => setModalVisible(true)}>
              添加
            </Button>,
          ]}
        >
          <NodeList lists={servers} onRefresh={loadData} />
        </ProCard>
      </Space>

      <ServerAddModel visible={modalVisible} onClose={() => setModalVisible(false)} onSubmit={addServer} />
    </>
  );
};

export default HomeView;
