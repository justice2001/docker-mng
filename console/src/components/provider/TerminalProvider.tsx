import {useEffect, useRef, useState} from "react";
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "../ui/drawer";
import { Button } from "../ui/button";
import ReactDOM from "react-dom";
import { Terminal } from "@xterm/xterm";
import '@xterm/xterm/css/xterm.css'
import { TerminalContext } from "@/context/terminal-context";

let terminal: Terminal | null;

export const TerminalProvider = ({ children }: {
    children: JSX.Element | JSX.Element[]
}) => {
    const terminalRef = useRef<HTMLDivElement>(null);

    const [ terminalData, setTerminalData ] = useState('');
    const [ open, setOpen ] = useState(false);
    const [ lock, setLock ] = useState(false);

    /**
     * 打开终端（可读写）
     * @param endpoint 节点
     * @param nodeName 堆栈标识
     * @param bash 终端类型
     */
    const openTerminal = (endpoint: string, nodeName: string, bash="/bin/bash") => {
        setTerminalData(`${endpoint}-${nodeName}-${bash}`);
        setOpen(true);
        setLock(false);
    }

    /**
     * 打开日志（只读，锁定关闭按钮）
     * @param endpoint 节点
     * @param nodeName 堆栈标识
     * @param operation 操作
     */
    const openLog = (endpoint: string, nodeName: string, operation: string) => {
      console.log(endpoint, nodeName, operation);
      setTerminalData(`${endpoint}-${nodeName}-${operation}`);
      setOpen(true)
      setLock(false);
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
    const initTerminal = () => {
        if (!terminal && terminalRef.current) {
            // 创建终端
            terminal = new Terminal({
                cols: 20,
                rows: 15,

            });
            terminal.open(terminalRef.current);
            terminal.write("Hello World!");
            // 处理终端连接
        }
    }

    const close = () => {
        setTerminalData('');
        setOpen(false);
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
                      <DrawerTitle>Starting {terminalData}...</DrawerTitle>
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
