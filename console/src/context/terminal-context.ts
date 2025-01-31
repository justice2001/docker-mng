import { createContext } from "react";

export const TerminalContext = createContext<{
    openTerminal: (endpoint: string, nodeName: string, bash?: string) => void,
    openLog: (endpoint: string, nodeName: string, operation: string, fn: () => void) => void
  }>({
    openTerminal: () => {},
    openLog: () => {}
  });