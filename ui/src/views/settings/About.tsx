import React from 'react';
import { Button, Flex, message } from 'antd';
import Logo from '../../assets/docker-mark-blue.svg';
import { ArrowUpOutlined } from '@ant-design/icons';
import apiRequest from '../../api/api-request.ts';
import { NodeData } from 'common/dist/types/daemon';

const About: React.FC = () => {
  const updateAllDaemon = () => {
    apiRequest.get('overview/servers').then((res) => {
      const activeServer = res.data.servers.filter((s: NodeData) => s.nodeInfo.nodeStatus === 'connected');
      activeServer.map((s: NodeData) =>
        apiRequest.post(`nodes/${s.nodeName}/update`, {}).then((_) => {
          message.success(`${s.nodeName} 更新成功，请等待daemon重启`);
        }),
      );
    });
  };

  return (
    <Flex vertical gap={20} align={'center'} justify={'center'}>
      <img src={Logo} alt="logo" style={{ width: 100 }} />
      <div style={{ fontSize: 24 }}>Docker Manager</div>
      <div style={{ textAlign: 'center', color: '#999999' }}>
        <div>Panel 版本：v1.0.0</div>
      </div>
      <Button type={'primary'} icon={<ArrowUpOutlined />} disabled>
        检查更新
      </Button>
      <Button type={'primary'} icon={<ArrowUpOutlined />} onClick={updateAllDaemon}>
        强制更新所有daemon
      </Button>
      <div>
        Developed By zhengyi59 <a href="https://github.com/justice2001/docker-mng">GitHub</a>
      </div>
    </Flex>
  );
};

export default About;
