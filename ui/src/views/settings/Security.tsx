import React from 'react';
import { Button, Divider, Form, Input } from 'antd';

interface PasswordForm {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface BasicForm {
  username: string;
}

const Security: React.FC = () => {
  return (
    <>
      <Form
        name="basic"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        autoComplete="off"
        labelAlign={'left'}
      >
        <Form.Item<BasicForm> label="用户名" name="username" rules={[{ required: true, message: '请输入用户名!' }]}>
          <Input />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 4, span: 16 }}>
          <Button type="primary" htmlType="submit">
            更新用户名
          </Button>
        </Form.Item>
      </Form>
      <Divider orientation="left" plain orientationMargin={10}>
        密码设置
      </Divider>
      <Form
        name="password"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        autoComplete="off"
        labelAlign={'left'}
      >
        <Form.Item<PasswordForm>
          label="旧密码"
          name="oldPassword"
          rules={[{ required: true, message: '请输入旧密码!' }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item<PasswordForm>
          label="新密码"
          name="newPassword"
          rules={[{ required: true, message: '请输入新密码!' }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item<PasswordForm>
          label="确认密码"
          name="confirmPassword"
          rules={[{ required: true, message: '请输入确认密码!' }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 4, span: 16 }}>
          <Button type="primary" htmlType="submit">
            更新密码
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default Security;
