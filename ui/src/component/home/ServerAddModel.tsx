import React from 'react';
import { Checkbox, Form, Input, Modal } from 'antd';

type ServerAddModelProps = {
  visible: boolean;
  onClose: () => void;
  onSubmit?: (data: ServerAddData) => void;
};

export type ServerAddData = {
  name: string;
  ip: string;
  port: number;
  token: string;
  https: boolean;
};

// TODO 校验IP、端口是否合法
const ServerAddModel: React.FC<ServerAddModelProps> = (props: ServerAddModelProps) => {
  const [form] = Form.useForm();

  const submit = (e: ServerAddData) => {
    console.log(e);
    props.onSubmit?.(e);
  };

  return (
    <Modal open={props.visible} title={'添加服务器'} onOk={form.submit} onCancel={props.onClose} destroyOnClose={true}>
      <Form
        style={{ marginTop: 30 }}
        preserve={false}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 16 }}
        form={form}
        onFinish={submit}
        requiredMark={false}
      >
        <Form.Item<ServerAddData>
          label="服务器名称"
          name={'name'}
          rules={[{ required: true, message: '请输入服务器名称!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item<ServerAddData>
          label="服务器地址"
          name={'ip'}
          rules={[{ required: true, message: '请输入服务器地址!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item<ServerAddData>
          label="服务器端口"
          name={'port'}
          rules={[{ required: true, message: '请输入服务器端口!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item<ServerAddData>
          label="Token"
          name={'token'}
          rules={[{ required: true, message: '请输入服务器Token!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item<ServerAddData> valuePropName="checked" name={'https'} wrapperCol={{ offset: 6, span: 16 }}>
          <Checkbox>HTTPS</Checkbox>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ServerAddModel;
