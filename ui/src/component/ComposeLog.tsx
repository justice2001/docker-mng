import React, { useEffect, useRef } from 'react';
import { Terminal } from '@xterm/xterm';
import '@xterm/xterm/css/xterm.css';
import './xterminal.css';
import { io, Socket } from 'socket.io-client';
import ApiRequest from '../api/api-request.ts';

type XTerminalProps = {
  endpoint: string;
  name: string;
  key?: number;
};

let socket: Socket | null = null;

const ComposeLog: React.FC<XTerminalProps> = (props) => {
  const terminalRef = useRef<HTMLDivElement>(null);

  const terminal = new Terminal({
    fontFamily: 'Menlo, Monaco, "Courier New", monospace',
    disableStdin: false,
    fontSize: 14,
  });

  let inited = false;

  const connect = () => {
    ApiRequest.get(`/stacks/${props.endpoint}/${props.name}/logs`).then((res) => {
      if (socket) return;
      socket = io(res.data.socket);
      socket.on('connect', () => {
        socket?.emit('stack/logs', {
          uuid: '345678908765434567',
          data: res.data.token,
        });
      });

      socket.on('data', (data) => {
        terminal.write(data);
      });
      socket.on('disconnect', () => {
        socket = null;
      });
    });
  };

  useEffect(() => {
    if (terminalRef.current && !inited) {
      terminal.open(terminalRef.current);
      inited = true;
    }
    if (!socket || !socket.connected) {
      connect();
    }

    const handleResize = () => {
      if (!terminalRef.current) return;
      const clientWidth = terminalRef.current.clientWidth;

      const span = document.createElement('span');
      span.style.fontFamily = terminal.options.fontFamily || 'monospace';
      span.style.fontSize = '14px';
      span.style.visibility = 'hidden';
      span.style.whiteSpace = 'nowrap';
      span.textContent = 'W';
      document.body.appendChild(span);

      const charWidth = span.getBoundingClientRect().width;
      document.body.removeChild(span);
      const newCols = Math.floor(clientWidth / charWidth) - 3;

      terminal.resize(newCols, terminal.rows);
    };

    // 监听resize
    window.addEventListener('resize', handleResize);

    window.addEventListener('load', handleResize);

    return () => {
      socket?.disconnect();
      socket = null;
      inited = false;
    };
  }, []);

  useEffect(() => {
    if (!socket) {
      connect();
    }
  }, [props.key]);

  return (
    <div className="xterminal-container">
      <div ref={terminalRef}></div>
    </div>
  );
};
export default ComposeLog;
