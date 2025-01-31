import {useEffect, useRef, useState} from "react";
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "../ui/drawer";
import { Button } from "../ui/button";
import ReactDOM from "react-dom";
import { Terminal } from "@xterm/xterm";
import '@xterm/xterm/css/xterm.css'
import { TerminalContext } from "@/context/terminal-context";
import {io, Socket} from "socket.io-client";
import ApiRequest from "@/utils/api-request.ts";

let terminal: Terminal | null;
let socket: Socket | null;
let type: 'operation'|'terminal' = 'operation';
let callbackFunction: () => void = () => {};

export const TerminalProvider = ({ children }: {
    children: JSX.Element | JSX.Element[]
}) => {
    const terminalRef = useRef<HTMLDivElement>(null);

    const [ terminalData, setTerminalData ] = useState({
        endpoint: "",
        name: "",
        cmd: ""
    });
    const [ open, setOpen ] = useState(false);
    const [ lock, setLock ] = useState(false);
    /**
     * 打开终端（可读写）
     * @param endpoint 节点
     * @param nodeName 堆栈标识
     * @param bash 终端类型
     */
    const openTerminal = (endpoint: string, nodeName: string, bash="/bin/bash") => {
        setTerminalData({
            endpoint: endpoint,
            name: nodeName,
            cmd: bash
        });
        setOpen(true);
        setLock(false);
    }

    /**
     * 打开日志（只读，锁定关闭按钮）
     * @param endpoint 节点
     * @param nodeName 堆栈标识
     * @param operation 操作
     * @param fn
     */
    const openLog = (endpoint: string, nodeName: string, operation: string, fn = () => {}) => {
      console.log(endpoint, nodeName, operation);
      setTerminalData({
          endpoint: endpoint,
          name: nodeName,
          cmd: operation
      });
      setOpen(true)
      setLock(true);
      type = 'operation';
      callbackFunction = fn;
    }

    useEffect(() => {
        console.log(terminalRef.current)
        if (open) {
            setTimeout(initTerminal, 0);
        }

        return () => {
            terminal?.clear();
            terminal = null;
        }
    }, [open]);

    /**
     * 初始化Terminal
     */
    const initTerminal = async () => {
        if (!terminal && terminalRef.current) {
            // 创建终端
            terminal = new Terminal({
                cols: 120,
                rows: 15,
            });
            terminal.open(terminalRef.current);
            terminal.write("Hello World!");
            // 处理终端连接
            switch (type) {
                case "terminal":
                    return;
                case 'operation':
                    await connectToOperation()
            }
        }
    }

    /**
     * 操作socket连接
     */
    const connectToOperation = async () => {
        const res = await ApiRequest.get(`/stacks/${terminalData.endpoint}/${terminalData.name}/operation/${terminalData.cmd}`)
        console.log(`terminal socket: ${res.data.socket}`, res);
        terminal?.write(`\r\nsocket url: ${res.data.socket}`);
        terminal?.write(`\r\nonce token: ${res.data.token}`);
        // connect to socket
        socket = io(res.data.socket);
        socket.on('connect', () => {
            console.log('connected to server');
            terminal?.reset();
            // auth
            socket?.emit('stack/operation', {
                uuid: '',
                data: res.data.token,
            });
        });
        //
        socket.on('data', (data: string) => {
            console.debug(`Received data: ${data}`);
            terminal?.write(data);
        });
        socket.on('disconnect', () => {
            setLock(false);
        })
    }

    const close = () => {
        setTerminalData({
            name: "",
            endpoint: "",
            cmd: ""
        });
        callbackFunction();
        setOpen(false);
        socket?.close();
        terminal?.clear();
    }

    return (
        <TerminalContext.Provider value={{ openTerminal, openLog }}>
            {children}
            {ReactDOM.createPortal(
                <Drawer open={open} dismissible={false}>
                <DrawerContent>
                  <div className="px-80 w-full mx-auto">
                    <DrawerHeader>
                      <DrawerTitle>Starting {terminalData.name}...</DrawerTitle>
                      <DrawerDescription>Please wait containers started up...</DrawerDescription>
                    </DrawerHeader>
                    <div className="px-4 pb-0">
                      <div ref={terminalRef} className="rounded-lg overflow-hidden p-2 bg-black"></div>
                    </div>
                    <DrawerFooter>
                        <Button disabled={lock} onClick={close}>Done</Button>
                    </DrawerFooter>
                  </div>
                </DrawerContent>
              </Drawer>,
              document.body
            )}
        </TerminalContext.Provider>
    )
}
