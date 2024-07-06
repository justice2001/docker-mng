import { Flex, Input, Modal, Segmented, Select } from 'antd';
import { useEffect, useState } from 'react';
import apiRequest from '../../../api/api-request';
import { Stacks } from 'common/dist/types/stacks';
import { Editor } from '@monaco-editor/react';
import { AxiosResponse } from 'axios';
import './editor.css';

interface ComposeEditProps {
  endpoint: string;
  name: string;
  open: boolean;
  onSubmit: (config: Stacks) => void;
  onClose: () => void;
}

const ComposeEdit: React.FC<ComposeEditProps> = (props) => {
  const [data, setData] = useState<Stacks | null>(null);
  const [mode, setMode] = useState('code');
  const [type, setType] = useState('compose');

  const nameChange = (ev: any) => {
    console.log(ev);
    setData((prev) => {
      if (!prev) return prev;
      return { ...prev, name: ev.currentTarget.value };
    });
  };

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
      apiRequest.get(`/stacks/${props.endpoint}/${props.name}`).then((res: AxiosResponse) => {
        setData(res.data);
        setType('compose');
      });
    }
  }, [props.open]);

  const submit = () => {
    props.onSubmit(data!);
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
        title={<Input size={'small'} style={{ width: 140 }} value={data?.name} onChange={nameChange} />}
        width="80%"
        onOk={submit}
        onCancel={props.onClose}
      >
        <Flex justify="space-between">
          <Segmented
            options={[
              { label: '图形化', value: 'graph', disabled: true },
              { label: '代码', value: 'code' },
            ]}
            value={mode}
            onChange={setMode}
          />
          <Select
            options={[
              { label: 'Compose', value: 'compose' },
              { label: '环境变量', value: 'env' },
            ]}
            value={type}
            onChange={setType}
          ></Select>
        </Flex>
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
      </Modal>
    </>
  );
};

export default ComposeEdit;
