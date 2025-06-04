import {useState} from "react";

export const useDataEditor = () => {
  const [fileName, setFileName] = useState<string>('');
  const [fileType, setFileType] = useState<string>('');
  const [path, setPath] = useState<string>('');
  const [open, setOpen] = useState<boolean>(false);

  const openEditor = (path: string) => {
    setPath(path);
    const filename = path.substring(path.lastIndexOf("/") + 1);
    const lastDotIdx = filename.lastIndexOf(".");
    setFileName(filename.substring(0, lastDotIdx));
    setFileType(filename.substring(lastDotIdx + 1));
    setOpen(true)
  }

  const closeEditor = () => {
    setOpen(false);
    setFileName("");
    setFileType("");
  }

  return {
    fileName,
    fileType,
    open,
    path,
    openEditor,
    closeEditor
  }
}