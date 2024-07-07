import { Flex, Form, Input, Modal, Segmented, Select, Switch } from 'antd';
import { useEffect, useState } from 'react';
import apiRequest from '../../../api/api-request';
import { StackExtend, Stacks } from 'common/dist/types/stacks';
import { Editor } from '@monaco-editor/react';
import { AxiosResponse } from 'axios';
import './editor.css';
import { useForm } from 'antd/es/form/Form';

interface ComposeEditProps {
  endpoint?: string;
  name?: string;
  open: boolean;
  isAdd?: boolean;
  onSubmit: (config: Stacks) => void;
  onClose: () => void;
}

const ComposeEdit: React.FC<ComposeEditProps> = (props) => {
  const [data, setData] = useState<Stacks | null>(null);
  const [mode, setMode] = useState('loading');
  const [type, setType] = useState('compose');

  // Columns
  const [baseForm] = useForm();
  const [serverList, setServerList] = useState([]);

  const updateFile = (value: string | undefined) => {
    setData((prev) => {
      if (!prev) return prev;
      if (type === 'compose') {
        return { ...prev, composeFile: value };
      } else if (type === 'env') {
        return { ...prev, envFile: value };
      }
      return prev;
    });
  };

  useEffect(() => {
    console.log(props);
    if (props.open) {
      console.log('open');
      if (props.isAdd) {
        setData({
          endpoint: '',
          name: '',
          icon: '',
          tags: [],
          state: 'unknown',
          composeFile: '',
          envFile: '',
        });
        setType('compose');
        setMode('base');
        // Get Server List for endpoint select
        apiRequest.get('/overview/servers').then((res: AxiosResponse) => {
          setServerList(res.data.servers.map((item: any) => ({ label: item.nodeName, value: item.nodeName })));
        });
        return;
      }
      apiRequest.get(`/stacks/${props.endpoint}/${props.name}`).then((res: AxiosResponse) => {
        setData(res.data);
        setType('compose');
        setMode('base');
      });
    }
  }, [props.open]);

  const submit = () => {
    baseForm.validateFields().then((values: StackExtend) => {
      const submitData = data!;
      submitData.name = values.name || '';
      submitData.endpoint = values.endpoint || '';
      clear();
      props.onSubmit(submitData!);
    });
  };

  const clear = () => {
    setData({
      endpoint: '',
      name: '',
      icon: '',
      tags: [],
      state: 'unknown',
      composeFile: '',
      envFile: '',
    });

    setMode('loading');
  };

  const editorValue = () => {
    switch (type) {
      case 'compose':
        return data?.composeFile;
      case 'env':
        return data?.envFile;
    }
    return '';
  };

  const language = () => {
    switch (type) {
      case 'compose':
        return 'yaml';
      case 'env':
        return '.env';
    }
  };

  return (
    <>
      <Modal
        open={props.open}
        title={props.isAdd ? '创建堆栈' : `编辑堆栈 - ${data?.name}`}
        width="80%"
        onOk={submit}
        onCancel={() => {
          clear();
          props.onClose();
        }}
      >
        <Flex justify="space-between">
          <Segmented
            options={[
              { label: '基础配置', value: 'base' },
              { label: '堆栈配置', value: 'stack', disabled: true },
              { label: '代码', value: 'code' },
            ]}
            value={mode}
            onChange={setMode}
          />
          {mode === 'code' && (
            <Select
              options={[
                { label: 'Compose', value: 'compose' },
                { label: '环境变量', value: 'env' },
              ]}
              value={type}
              onChange={setType}
            ></Select>
          )}
        </Flex>
        {mode === 'base' && (
          <div className="editor">
            <Form layout="vertical" form={baseForm}>
              <Form.Item<StackExtend> label={'name'} name="name">
                <Input disabled={!props.isAdd} defaultValue={data?.name}></Input>
              </Form.Item>
              <Form.Item<StackExtend> label={'endpoint'} name="endpoint">
                <Select disabled={!props.isAdd} defaultValue={data?.endpoint} options={serverList}></Select>
              </Form.Item>
              <Form.Item<StackExtend> label={'icon'} name="icon">
                <Input disabled defaultValue={data?.icon}></Input>
              </Form.Item>
              <Form.Item<StackExtend> label={'tags'} name="tags">
                <Select disabled mode="tags" defaultValue={data?.tags} style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item<StackExtend> label={'protected'} name="protected">
                <Switch disabled />
              </Form.Item>
            </Form>
          </div>
        )}
        {mode === 'code' && (
          <Editor
            className="editor"
            height={400}
            value={editorValue()}
            language={language()}
            onChange={updateFile}
            options={{
              domReadOnly: true,
              readOnly: false,
              scrollBeyondLastLine: false,
            }}
          />
        )}
      </Modal>
    </>
  );
};

export default ComposeEdit;
