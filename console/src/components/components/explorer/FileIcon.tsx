import { FileItem } from "common";
import {CornerLeftUp, File, FileCode2Icon, FileCogIcon, FileTerminalIcon, Folder, LogsIcon} from "lucide-react";
import React from "react";

interface FileIconProps {
    file: FileItem;
}

const codeExt = ["js", "css", "java", "go", "py"];
const configExt = ["yaml", "yml", "conf", "json", "ini"];

export const FileIcon: React.FC<FileIconProps> = ({file}: FileIconProps) => {
    const iconSize = 16;

    if (file.type === 'dir') {
        return (<Folder size={iconSize} />)
    } 
    if (file.name === '..') {
        return <CornerLeftUp size={iconSize} />
    }
    const extIdx = file.name.lastIndexOf(".");
    if (extIdx > 0) {
        const ext = file.name.substring(extIdx + 1);
        if (configExt.indexOf(ext) > -1) return <FileCogIcon size={iconSize} />
        if (codeExt.indexOf(ext) > -1) return <FileCode2Icon size={iconSize} />
        if ("log" === ext) return <LogsIcon size={iconSize} />
        if ("sh" === ext) return <FileTerminalIcon size={iconSize} />
    }

    return <File size={iconSize} />
}