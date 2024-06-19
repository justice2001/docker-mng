import React, { useEffect, useRef } from "react";
import {Terminal} from "@xterm/xterm"
import "@xterm/xterm/css/xterm.css"
import "./xterminal.css"

const XTerminal: React.FC = () => {

    const terminalRef = useRef(null);

    const terminal = new Terminal({
        fontFamily: 'Menlo, Monaco, "Courier New", monospace',
        disableStdin: false
    });
    let inited = false;

    useEffect(() => {
        if (terminalRef.current && !inited) {
            console.log("A")
            terminal.open(terminalRef.current);
            terminal.write('Hello from \x1B[1;3;31mxterm.js\x1B[0m $ \r\n')
            setInterval(() => terminal.write("Hello from \x1B[1;3;31mxterm.js\x1B[0m $ \r\n"), 1000)
            inited = true;
        }
    }, []);

    return (
        <div className="xterminal-container">
            <div ref={terminalRef}></div>
        </div>
    );
};

export default XTerminal;