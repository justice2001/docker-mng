import { StackOperation } from 'common/dist/types/stacks';
import { Button, Modal } from 'antd';
import React, { useEffect, useRef } from 'react';
import { Terminal } from '@xterm/xterm';
import { io, Socket } from 'socket.io-client';
import apiRequest from '../../../api/api-request.ts';

interface ComposeOperationProps {
  open: boolean;
  endpoint: string;
  name: string;
  operation: StackOperation;
  onClose: () => void;
  onRefresh: (log: boolean) => void;
}

let terminal: Terminal | null = null;
let socket: Socket | null = null;

const ComposeOperation: React.FC<ComposeOperationProps> = (props: ComposeOperationProps) => {
  const terminalRef = useRef(null);

  const [canClsoe, setCanClose] = React.useState(false);

  useEffect(() => {
    if (!props.open) return;
    setCanClose(false);
    // 建立终端
    if (!terminal) {
      terminal = new Terminal({
        fontFamily: 'Menlo, Monaco, "Courier New", monospace',
        rows: 20,
      });
      terminal.open(terminalRef.current as any);
    }
    // 获取并建立连接
    if (!socket) {
      apiRequest.get(`/stacks/${props.endpoint}/${props.name}/operation/${props.operation}`).then((res) => {
        socket = io(res.data.socket);
        socket.on('connect', () => {
          terminal?.reset();
          // auth
          socket?.emit('stack/operation', {
            uuid: '1234567890',
            data: res.data.token,
          });
        });

        socket?.on('data', (data: any) => {
          terminal?.write(data);
        });

        socket.on('disconnect', () => {
          setCanClose(true);
          const logRefresh = ['up', 'restart', 'update'].includes(props.operation);
          props.onRefresh(logRefresh);
        });
      });
    }
  }, [props.open]);

  const close = () => {
    terminal?.reset();
    socket?.disconnect();
    socket?.close();
    socket = null;
    props.onClose();
    terminal?.dispose();
    terminal = null;
  };

  return (
    <Modal
      open={props.open}
      width={'80%'}
      title={'容器操作'}
      closable={false}
      footer={
        <Button disabled={!canClsoe} onClick={close}>
          关闭
        </Button>
      }
    >
      <div ref={terminalRef} />
    </Modal>
  );
};

export default ComposeOperation;
