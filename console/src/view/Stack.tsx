import {DTooltip} from '@/components/common/DTooltip';
import {StatusIcon} from '@/components/components/stacks/StatusIcon';
import {Stacks} from '@/constants/stack-constants';
import apiRequest from '@/utils/api-request';
import {borderColor} from '@/utils/stack-utils';
import {OctagonX, PlayIcon, ServerIcon, TagIcon} from 'lucide-react';
import {useEffect, useRef, useState} from 'react';
import {useParams} from 'react-router';
import TraefikLogo from '@/assets/platforms/traefik.svg'
import DockerLogo from '@/assets/docker.svg'
import {useTranslation} from 'react-i18next';
import {DButton} from "@/components/common/DButton.tsx";
import {useTerminal} from "@/hooks/use-terminal.tsx";
import {Terminal} from '@xterm/xterm';
import ApiRequest from "@/utils/api-request";
import {io, Socket} from "socket.io-client";

let terminal: null | Terminal = null;
let socket: null | Socket = null;

export function Stack() {
  const {node, stack} = useParams();
  const {t} = useTranslation();
  const {openLog} = useTerminal();
  const terminalRef = useRef<HTMLDivElement>(null);

  const [stackInfo, setStackInfo] = useState<Stacks>();

  useEffect(() => {
    terminal = null;
    socket = null;
    getData();
    connectLog().then(() => {
      handleResize();
    })

    return () => {
      if (terminal) {
        terminal.clear();
        terminal = null;
        socket?.disconnect();
        socket = null;
      }
    }
  }, []);

  const connectLog = async () => {
    if (!terminal && terminalRef.current) {
      terminal = new Terminal({
        fontFamily: 'Menlo, Monaco, "Courier New", monospace',
        disableStdin: false,
        fontSize: 14
      });
      terminal.open(terminalRef.current);
      terminal.write(`Hello ${node}/${stack}!\r\n`);
    }
    if (!socket) {
      // 打开日志通道
      const token = await ApiRequest.get(`/stacks/${node}/${stack}/logs`);
      socket = io(token.data.socket);
      socket.on('connect', () => {
        // 发送读取指令
        socket?.emit('stack/logs', {
          uuid: '345678908765434567',
          data: token.data.token,
        });
        terminal?.clear();
        terminal?.write("\x1b[32mThe log was connected successfully.\x1b[0m\r\n\r\n");
      });
      socket.on('data', (data) => {
        terminal?.write(data);
      });
      socket.on('disconnect', () => {
        terminal?.write("Disconnected from server!");
        socket = null;
      })
    }
  }

  const handleResize = () => {
    if (!terminalRef.current || !terminal) return;
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

  const getData = () => {
    apiRequest.get(`/stacks/${node}/${stack}`).then((res) => {
      setStackInfo(res.data);
    });
  }

  const operation = (oper: string) => {
    if (!node || !stack) return
    openLog(node, stack, oper, () => {
      getData();
      connectLog();
    })
  }

  return (
      <div className="p-2">
        <div className="text-2xl font-bold">
          {node} / {stack}
        </div>
        <div className="mt-5 flex items-center">
          {/* 头像侧 */}
          <StatusIcon status={stackInfo?.state || 'unknown'} icon={stackInfo?.icon || DockerLogo}/>
          <div className="ml-4 flex flex-col gap-1 flex-1">
            <div className="flex items-center gap-1">
              <a href={`/stack/${stackInfo?.endpoint}/${stackInfo?.name}`} className="text-base">
                {stackInfo?.name}
              </a>
              {/* TODO: 更新提示 */}
              {/*<DTooltip tips={t('stack.have_update', {version: "unknown"})}>*/}
              {/*  <CircleArrowUpIcon fill='#15803d' size="1.0em" color='white' />*/}
              {/*</DTooltip>*/}
              {/* TODO: 后续需要添加管理类型字段，当前存在链接则识别为traefik */}
              {stackInfo?.links && (
                  <DTooltip tips={t('stack.support_ext', {ext: 'traefik'})}>
                    <img className="h-2" src={TraefikLogo} alt="Supoorted traefik"/>
                  </DTooltip>
              )}
            </div>
            <div className="flex items-center text-xs gap-2">
            <span className="flex items-center gap-1 text-blue-700">
              <ServerIcon size="1em"/>
              {node}
            </span>
              {stackInfo?.tags.map((tag) => (
                  <span className="flex items-center gap-1" style={{color: borderColor(tag)}} key={tag}>
                <TagIcon size="1em"/>
                    {tag}
              </span>
              ))}
            </div>
          </div>
          {/* 操作按钮 */}
          <div className="flex items-center gap-2">
            {stackInfo?.state !== "running" &&
                <DButton icon={<PlayIcon/>} onClick={() => operation('up')}>{t("stack.start")}</DButton>}
            {stackInfo?.state === "running" &&
                <DButton icon={<OctagonX/>} onClick={() => operation('stop')} variant="destructive">{t("stack.stop")}</DButton>}
          </div>
        </div>
        {/* 日志 */}
        <div className="w-[100%] p-2 overflow-hidden bg-black mt-4 rounded-md">
          <div ref={terminalRef} className="no-scrollbar"></div>
        </div>
      </div>
  );
}
