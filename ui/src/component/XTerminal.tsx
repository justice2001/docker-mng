import React, { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import {Terminal} from "@xterm/xterm"
import "@xterm/xterm/css/xterm.css"
import "./xterminal.css"

type XTerminalProps = {
    onInit?: (terminal: Terminal) => void;
    onData?: (data: string) => void;
}

type XTerminalRef = {
    writeTerminal: (text: string) => void;
}

const XTerminal: React.ForwardRefRenderFunction<XTerminalRef, XTerminalProps> = (_, ref) => {

    const terminalRef = useRef(null);

    const terminal = new Terminal({
        fontFamily: 'Menlo, Monaco, "Courier New", monospace',
        disableStdin: false
    });

    let inited = false;

    useImperativeHandle(ref, () => ({
        writeTerminal: (text: string) => {
            console.log(inited)
            if (!inited) {
                console.error("Terminal not inited!")
                return
            }
            terminal.write(text);
        }
    }))

    useEffect(() => {
        if (terminalRef.current && !inited) {
            terminal.open(terminalRef.current);
            inited = true;
        }
    }, []);

    return (
        <div className="xterminal-container">
            <div ref={terminalRef}></div>
        </div>
    );
};
const XTerminalRef = forwardRef(XTerminal)
export default XTerminalRef;