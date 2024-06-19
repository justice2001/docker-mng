import React from "react";
import { Editor } from "@monaco-editor/react";

export type MonacoEditorProps = {
    value: string | undefined;
}

const MonacoEditor: React.FC<MonacoEditorProps> = (props: MonacoEditorProps) => {
    return (<>
        <Editor height={400} value={props.value} defaultLanguage={"yaml"} options={{
            domReadOnly: true,
            readOnly: true,
            scrollBeyondLastLine: false
        }} />
    </>);
}

export default MonacoEditor;