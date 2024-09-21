import { useNavigate } from 'react-router-dom';
import { LoginFormPage, ProFormText } from '@ant-design/pro-components';

import dockerLogo from '../assets/docker.svg';
import { LockOutlined, UserOutlined } from '@ant-design/icons';

import './login.css';
import apiRequest from '../api/api-request.ts';

const Login: React.FC = () => {
  const navigate = useNavigate();

  const loginHandler = (form: any) => {
    console.log(form);
    apiRequest
      .post('/auth/login', {
        username: form.username,
        password: form.password,
      })
      .then((res) => {
        localStorage.setItem('token', res.data.token);
        navigate('/', { replace: true });
      });
  };
  return (
    <>
      <LoginFormPage
        logo={dockerLogo}
        style={{
          height: '100vh',
        }}
        onFinish={loginHandler}
      >
        <ProFormText
          name="username"
          fieldProps={{
            size: 'large',
            prefix: <UserOutlined />,
          }}
          placeholder={'用户名: admin or user'}
          rules={[
            {
              required: true,
              message: '请输入用户名!',
            },
          ]}
        />
        <ProFormText.Password
          name="password"
          fieldProps={{
            size: 'large',
            prefix: <LockOutlined />,
          }}
          placeholder={'密码: ant.design'}
          rules={[
            {
              required: true,
              message: '请输入密码！',
            },
          ]}
        />
      </LoginFormPage>
    </>
  );
};

export default Login;
