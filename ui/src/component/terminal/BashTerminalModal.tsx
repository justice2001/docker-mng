import React, { useEffect, useRef } from 'react';
import { Button, Form, Modal, Select } from 'antd';
import { Terminal } from '@xterm/xterm';
import ApiRequest from '../../api/api-request.ts';
import { io, Socket } from 'socket.io-client';

type BashTerminalModalProps = {
  endpoint: string;
  name: string;
  open: boolean;
  onClose?: () => void;
};

let terminal: Terminal | null = null;
let socket: Socket | null = null;

const BashTerminalModal: React.FC<BashTerminalModalProps> = (props) => {
  const terminalRef = useRef(null);

  const isStack = props.name.startsWith('stack');

  const connectToTerminal = (type: string) => {
    let cmd = 'bash';
    if (isStack) {
      cmd = props.name + '|' + type;
    }
    ApiRequest.get(`/terminal/${props.endpoint}/${cmd}`).then((res) => {
      console.log(`terminal socket: ${res.data.socket}`);
      terminal?.write(`\r\nsocket url: ${res.data.socket}`);
      terminal?.write(`\r\nonce token: ${res.data.token}`);
      // connect to socket
      socket = io(res.data.socket);
      socket.on('connect', () => {
        console.log('connected to server');
        terminal?.reset();
        // auth
        socket?.emit('terminal', {
          uuid: '',
          data: res.data.token,
        });
      });

      socket.on('data', (data: string) => {
        console.debug(`Received data: ${data}`);
        terminal?.write(data);
      });
    });
  };

  useEffect(() => {
    console.log(terminalRef.current);
    console.log(terminal);
    if (terminalRef.current && !terminal) {
      console.log('init Terminal');
      terminal = new Terminal({
        fontFamily: 'Menlo, Monaco, "Courier New", monospace',
      });
      terminal.open(terminalRef.current);
      terminal.onData((data: string) => {
        socket?.emit('stdin', data);
      });
    }
    if (!terminal || !props.open) return;
    terminal.write('Terminal will refresh when connected to endpoint');
    terminal.write('\r\nendpoint: ' + props.endpoint);
    terminal.write('\r\nname: ' + props.name);
    // get socket url and auth token
    connectToTerminal('bash');
  }, [props.open]);

  const close = () => {
    props.onClose?.();
    socket?.disconnect();
    terminal?.reset();
  };

  return (
    <>
      <Modal
        title={`Terminal - ${props.endpoint} - ${props.name}`}
        open={props.open}
        onCancel={close}
        footer={null}
        destroyOnClose={false}
        width={'80%'}
      >
        <Form
          layout={'inline'}
          style={{ margin: 10 }}
          onFinish={(values) => {
            console.log(`Change bash to ${values.type}`);
            socket?.disconnect();
            connectToTerminal(values.type);
          }}
        >
          <Form.Item name="type" label="终端类型" initialValue={'bash'}>
            <Select
              style={{ width: 200 }}
              options={[
                { value: 'bash', label: 'bash' },
                { value: 'sh', label: 'sh' },
              ]}
            ></Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              切换
            </Button>
          </Form.Item>
        </Form>
        <div ref={terminalRef} />
      </Modal>
    </>
  );
};

export default BashTerminalModal;
