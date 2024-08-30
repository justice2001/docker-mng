import React from 'react';
import { Card, Tabs, TabsProps } from 'antd';
import { InfoCircleOutlined, LockOutlined, SettingOutlined } from '@ant-design/icons';
import About from './settings/About.tsx';
import Security from './settings/Security.tsx';
import { useParams } from 'react-router-dom';

const Settings: React.FC = () => {
  const { tab } = useParams();
  const items: TabsProps['items'] = [
    // {
    //   key: 'basic',
    //   label: '基本配置',
    //   icon: <AppstoreOutlined />,
    //   children: 'There is noting settings',
    // },
    {
      key: 'security',
      label: '安全设置',
      icon: <LockOutlined />,
      children: <Security />,
    },
    {
      key: 'about',
      label: '关于',
      icon: <InfoCircleOutlined />,
      children: <About />,
    },
  ];

  return (
    <Card
      title={
        <>
          <SettingOutlined /> 系统设置
        </>
      }
    >
      <Tabs items={items} defaultActiveKey={tab || 'security'} tabPosition={'left'} />
    </Card>
  );
};

export default Settings;
