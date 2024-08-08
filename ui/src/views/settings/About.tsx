import React from 'react';
import { Button, Flex } from 'antd';
import Logo from '../../assets/docker-mark-blue.svg';
import { ArrowUpOutlined } from '@ant-design/icons';

const About: React.FC = () => {
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
      <div>
        Developed By zhengyi59 <a href="https://github.com/justice2001/docker-mng">GitHub</a>
      </div>
    </Flex>
  );
};

export default About;
