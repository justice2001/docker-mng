import { FileItem } from '@/constants/file-constants';
import { formatFileSize, normalizePath } from '@/utils/path-utils';
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileIcon } from './FileIcon';
import { useTranslation } from 'react-i18next';

interface FileExplorerProps {
  list: FileItem[];
  path: string;
  onRoute?: (path: string) => void;
}

export const FileExplorer: React.FC<FileExplorerProps> = (props: FileExplorerProps) => {
  const { t } = useTranslation();

  const [selectedFile, setSelectedFile] = useState<string>('');

  const fileClick = (file: FileItem) => {
    if (file.name !== selectedFile) {
      setSelectedFile(file.name);
      return;
    }
    if (file.type === 'file') {
      // Do file preview
    } else {
      const p = normalizePath(`${props.path}/${file.name}`);
      setSelectedFile('');
      props.onRoute?.(p);
    }
  };

  return (
    <>
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
