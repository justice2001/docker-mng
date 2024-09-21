import { Outlet, useNavigate } from 'react-router-dom';
import { Dropdown } from 'antd';
import { ContainerOutlined, DashboardOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import { PageContainer, ProCard, ProLayout } from '@ant-design/pro-components';

import DocketLogo from '../assets/docker.svg';
import React from 'react';

const AppLayout: React.FC = () => {
  const navigate = useNavigate();
  const routes = {
    path: '/',
    routes: [
      {
        path: '/',
        name: '概览',
        icon: <DashboardOutlined />,
      },
      {
        path: '/compose',
        name: '堆栈',
        icon: <ContainerOutlined />,
      },
      // {
      //   path: '/images',
      //   name: 'Images',
      //   icon: <InboxOutlined />,
      // },
      // {
      //   path: '/backups',
      //   name: 'Backups',
      //   icon: <SaveOutlined />,
      // },
      // {
      //   path: '/store',
      //   name: 'App Store',
      //   icon: <AppstoreOutlined />,
      // },
      // {
      //   path: '/settings',
      //   name: 'Settings',
      //   icon: <SettingOutlined />,
      // },
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
          render: (_props, dom) => {
            return (
              <Dropdown
                menu={{
                  items: [
                    {
                      key: '/settings',
                      icon: <SettingOutlined />,
                      label: '设置',
                      onClick: () => {
                        navigate('/settings');
                      },
                    },
                    {
                      key: 'logout',
                      icon: <LogoutOutlined />,
                      label: '退出登陆',
                      onClick: () => {
                        window.localStorage.removeItem('token');
                        navigate('/login');
                      },
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
          return [];
        }}
        title=""
        logo={DocketLogo}
        layout={'mix'}
      >
        <PageContainer ghost>
          <ProCard direction="column" ghost gutter={[0, 16]}>
            <Outlet />
          </ProCard>
        </PageContainer>
      </ProLayout>
    </>
  );
};

export default AppLayout;
