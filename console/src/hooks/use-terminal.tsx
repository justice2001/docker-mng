import { TerminalContext } from "@/context/terminal-context"
import { useContext } from "react"

export const useTerminal = () => {
    return useContext(TerminalContext)
}