import { FileItem } from 'common';
import { formatFileSize, normalizePath } from '@/utils/path-utils';
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileIcon } from './FileIcon';
import { useTranslation } from 'react-i18next';
import {DataEditor} from "@/components/editor/DataEditor.tsx";
import {useDataEditor} from "@/components/editor/useDataEditor.ts";

interface FileExplorerProps {
  list: FileItem[];
  path: string;
  onRoute?: (path: string) => void;
}

let lastClickTime = -1;

export const FileExplorer: React.FC<FileExplorerProps> = (props: FileExplorerProps) => {
  const { t } = useTranslation();
  const editor = useDataEditor();

  const [selectedFile, setSelectedFile] = useState<string>('');

  const fileClick = (file: FileItem) => {
    const now = Date.now();
    console.log(now, lastClickTime)
    if (file.name !== selectedFile || now - lastClickTime > 300 ) {
      setSelectedFile(file.name);
      lastClickTime = now;
      return;
    }
    const p = normalizePath(`${props.path}/${file.name}`);
    if (file.type === 'file') {
      // Do file preview
      editor.openEditor(p);
    } else {
      setSelectedFile('');
      props.onRoute?.(p);
    }
  };

  return (
    <>
      <DataEditor editor={editor} />
      <Table>
        <TableHeader>
          <TableRow className="border-none">
            <TableHead>{t("explorer.filename")}</TableHead>
            <TableHead>{t("explorer.filesize")}</TableHead>
            <TableHead>{t("explorer.permission")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {props.list.map((item) => (
            <TableRow
              key={item.name}
              data-state={selectedFile === item.name ? 'selected' : ''}
              className="border-none cursor-pointer select-none rounded-sm"
              onClick={() => fileClick(item)}
            >
              <TableCell>
                <div className="flex items-center gap-1">
                  <FileIcon file={item} />
                  {item.name}
                </div>
              </TableCell>
              <TableCell>{formatFileSize(item.size)}</TableCell>
              <TableCell>{item.permission}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};
