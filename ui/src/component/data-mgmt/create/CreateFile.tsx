import React from 'react';
import { Form, Input, message, Modal } from 'antd';
import apiRequest from '../../../api/api-request.ts';

interface CreateFileProps {
  endpoint: string;
  stack: string;
  path: string;
  open: boolean;
  type: 'dir' | 'file';
  onClose?: () => void;
  onCreate?: (success: boolean) => void;
}

const CreateFile: React.FC<CreateFileProps> = (props: CreateFileProps) => {
  const [form] = Form.useForm();
  const modalSubmitHandle = () => {
    form.submit();
  };

  const onSubmit = (values: any) => {
    console.log(values, props);
    apiRequest
      .post(
        `/data/${props.endpoint}/${props.stack}/create?path=${props.path}/${values.name}&isDir=${props.type === 'dir'}`,
        {},
      )
      .then(() => {
        message.success('创建成功');
        form.resetFields();
        props.onCreate && props.onCreate(true);
      });
  };

  const closeHandler = () => {
    form.resetFields();
    props.onClose && props.onClose();
  };

  return (
    <Modal
      open={props.open}
      title={props.type === 'dir' ? '创建目录' : '创建文件'}
      onClose={closeHandler}
      onCancel={closeHandler}
      onOk={modalSubmitHandle}
    >
      <Form
        style={{
          margin: '10px 0',
        }}
        form={form}
        onFinish={onSubmit}
      >
        <Form.Item name="name" label={props.type === 'dir' ? '目录名' : '文件名'}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateFile;
