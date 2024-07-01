import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { Dropdown, Space } from 'antd';
import React from 'react';
import {
  AppstoreOutlined,
  ContainerOutlined,
  HomeOutlined,
  InboxOutlined,
  InfoCircleOutlined,
  KeyOutlined,
  LogoutOutlined,
  SaveOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { PageContainer, ProCard, ProLayout } from '@ant-design/pro-components';

import DocketLogo from '../assets/docker.svg';

export default function () {
  const navigate = useNavigate();

  const user = window.localStorage.getItem('user');
  if (!user) {
    return <Navigate to="/login" />;
  }

  const logout = () => {
    window.localStorage.removeItem('user');
    navigate('/login', { replace: true });
  };

  const routes = {
    path: '/',
    routes: [
      {
        path: '/',
        name: 'Home',
        icon: <HomeOutlined />,
      },
      {
        path: '/compose',
        name: 'Compose',
        icon: <ContainerOutlined />,
      },
      {
        path: '/images',
        name: 'Images',
        icon: <InboxOutlined />,
      },
      {
        path: '/backups',
        name: 'Backups',
        icon: <SaveOutlined />,
      },
      {
        path: '/store',
        name: 'App Store',
        icon: <AppstoreOutlined />,
      },
      {
        path: '/settings',
        name: 'Settings',
        icon: <SettingOutlined />,
      },
    ],
  };

  return (
    <>
      <ProLayout
        route={routes}
        menuItemRender={(item, dom) => {
          return (
            <div
              onClick={() => {
                navigate(item.path || '/');
              }}
            >
              {dom}
            </div>
          );
        }}
        avatarProps={{
          src: 'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
          size: 'small',
          title: 'zhengyi59',
          render: (props, dom) => {
            return (
              <Dropdown
                menu={{
                  items: [
                    {
                      key: 'password',
                      icon: <KeyOutlined />,
                      label: '修改密码',
                    },
                    {
                      key: 'about',
                      icon: <InfoCircleOutlined />,
                      label: '关于',
                    },
                  ],
                }}
              >
                {dom}
              </Dropdown>
            );
          },
        }}
        token={{
          sider: {
            colorMenuBackground: '#fff',
            colorMenuItemDivider: '#dfdfdf',
            colorTextMenu: '#595959',
            colorTextMenuSelected: 'rgba(42,122,251,1)',
            colorBgMenuItemSelected: 'rgba(230,243,254,1)',
          },
        }}
        actionsRender={(props) => {
          if (props.isMobile) {
            return [];
          }
          if (typeof window === 'undefined') {
            return [];
          }
          return [<LogoutOutlined onClick={logout} key="GithubFilled" />];
        }}
        title=""
        logo={DocketLogo}
        layout={'mix'}
      >
        <PageContainer
          ghost
          header={{
            title: (
              <Space>
                <HomeOutlined />
                <span>页面</span>
              </Space>
            ),
          }}
        >
          <ProCard direction="column" ghost gutter={[0, 16]}>
            <Outlet />
          </ProCard>
        </PageContainer>
      </ProLayout>
    </>
  );
}
