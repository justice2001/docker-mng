import { Flex, Form, Input, message, Modal, Segmented, Select, Switch } from 'antd';
import { useEffect, useState } from 'react';
import apiRequest from '../../../api/api-request';
import { StackExtend, Stacks } from 'common/dist/types/stacks';
import { Editor } from '@monaco-editor/react';
import { AxiosResponse } from 'axios';
import './editor.css';
import { useForm } from 'antd/es/form/Form';
import { Tips } from '@icon-park/react';
import { Compose } from 'common/dist/types/compose';
import { parseCompose } from 'common/dist/utils/compose-utils';

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
  const [mode, setMode] = useState('base');
  const [type, setType] = useState('compose');
  const [submitting, setSubmitting] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [stackModal, setStackModal] = useState<Compose>();

  // Columns
  const [baseForm] = useForm();
  const [serverList, setServerList] = useState([]);

  const updateFile = (value: string | undefined) => {
    if (type === 'compose') {
      setStackModal(parseCompose(value || ''));
    }
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
          links: [],
          protected: false,
        });
        setType('compose');
        setLoaded(true);
        // Get Server List for endpoint select
        apiRequest.get('/overview/servers').then((res: AxiosResponse) => {
          setServerList(res.data.servers.map((item: any) => ({ label: item.nodeName, value: item.nodeName })));
        });
        return;
      }
      apiRequest.get(`/stacks/${props.endpoint}/${props.name}`).then((res: AxiosResponse) => {
        setData(res.data);
        console.log(parseCompose(res.data.composeFile));
        setStackModal(parseCompose(res.data.composeFile));
        setType('compose');
        setLoaded(true);
      });
    }
  }, [props.open]);

  const submit = async () => {
    setSubmitting(true);
    try {
      const values = await baseForm.validateFields();
      const submitData = data!;
      submitData.name = values.name || '';
      submitData.endpoint = values.endpoint || '';
      if (props.isAdd) {
        await apiRequest.post(`/stacks/${submitData.endpoint}`, submitData);
      } else {
        await apiRequest.put(`/stacks/${props.endpoint}/${props.name}`, {
          data: submitData,
        });
      }
      setSubmitting(false);
      clear();
      props.onSubmit(submitData!);
    } catch (e: any) {
      setSubmitting(false);
      message.error(`创建/修改堆栈失败: ${e.message}`);
      return;
    }
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
      links: [],
      protected: false,
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
        okButtonProps={{
          loading: submitting,
        }}
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
        {loaded && (
          <>
            {['stack', 'code'].includes(mode) && (
              <p style={{ color: '#999999' }}>
                <Tips style={{ marginRight: 5 }} />
                使用 DM_DATA 环境变量来配置数据目录，该目录可以通过 dm 管理
              </p>
            )}
            <div className="editor" hidden={mode !== 'base'}>
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
            <div hidden={mode !== 'stack'}>
              {Object.entries(stackModal?.services || {}).map(([key, service]) => (
                <div>
                  {key} =&gt; {service.image}
                </div>
              ))}
            </div>
            <div hidden={mode !== 'code'}>
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
            </div>
          </>
        )}
      </Modal>
    </>
  );
};

export default ComposeEdit;
