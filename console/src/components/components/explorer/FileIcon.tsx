import { FileItem } from "@/constants/file-constants";
import { CornerLeftUp, File, Folder } from "lucide-react";
import React from "react";

interface FileIconProps {
    file: FileItem;
}

export const FileIcon: React.FC<FileIconProps> = ({file}: FileIconProps) => {
    const iconSize = 16;

    if (file.type === 'dir') {
        return (<Folder size={iconSize} />)
    } 
    if (file.name === '..') {
        return <CornerLeftUp size={iconSize} />
    }
    return <File size={iconSize} />
}