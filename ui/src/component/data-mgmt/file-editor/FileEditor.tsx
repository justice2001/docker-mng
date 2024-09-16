import { Button, Flex, message, Modal, Space } from 'antd';
import { useEffect, useState } from 'react';
import { Save } from '@icon-park/react';
import DEditor from '../../d-editor/DEditor.tsx';
import apiRequest from '../../../api/api-request.ts';
import { getFileExt } from '../../../utils/file-utils.tsx';
import { editLanguages } from '../../../utils/file-map.tsx';

interface FileEditorProps {
  endpoint: string;
  stack: string;
  path: string;
  open: boolean;
  onClose: () => void;
}

const FileEditor = (props: FileEditorProps) => {
  const [fileName, setFileName] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState('');

  useEffect(() => {
    if (!props.open) return;
    console.log(props);
    apiRequest.get(`/data/${props.endpoint}/${props.stack}/file?path=${props.path}`).then((res) => {
      setContent(res.data);
      setLanguage(editLanguages[getFileExt(props.path) as keyof typeof editLanguages]);
      setLoading(false);
    });
    setFileName(props.path.split('/').pop() || '');
  }, [props.open]);

  const close = () => {
    setLoading(true);
    props.onClose();
  };

  const saveHandler = () => {
    apiRequest
      .put(`/data/${props.endpoint}/${props.stack}/file?path=${props.path}`, {
        data: content,
        headers: {
          'Content-Type': 'text/plain',
        },
      })
      .then(() => {
        message.success('保存成功');
      });
    console.log(content);
  };

  return (
    <Modal
      open={props.open}
      onCancel={close}
      width={'80%'}
      footer={null}
      keyboard={false}
      maskClosable={false}
      title={`编辑文件: ${fileName}`}
      loading={loading}
    >
      <Flex vertical gap={10}>
        <Space>
          <Button icon={<Save />} onClick={saveHandler} />
        </Space>
        <DEditor value={content} language={language} onChange={(c) => setContent(c || '')} />
      </Flex>
    </Modal>
  );
};

export default FileEditor;
