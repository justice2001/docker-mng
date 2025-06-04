import React from "react";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";
import {useDataEditor} from "@/components/editor/useDataEditor.ts";
import {TextProvider} from "@/components/editor/provider/TextProvider.tsx";

interface DataEditorProps {
  editor: ReturnType<typeof useDataEditor>
}

export const DataEditor: React.FC<DataEditorProps> = ( { editor } ) => {
  const getEditor = () => {
    if (["log", "yaml", "info", "json"].includes(editor.fileType)) return <TextProvider path={editor.path} />
    return <>Not Support for this file (.{editor.fileType})</>
  }

  return (<Dialog open={editor.open} onOpenChange={open => {
    if (!open) editor.closeEditor()
  }} modal={true}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Edit file: {editor.fileName}</DialogTitle>
      </DialogHeader>
      <div>
        {getEditor()}
      </div>
    </DialogContent>
  </Dialog>)
}