import { Editor } from '@monaco-editor/react';
import './d-editor.css';

interface DEditorProps {
  value: string;
  language?: string;
  readOnly?: boolean;
  onChange?: (value: string | undefined) => void;
}

const DEditor = (props: DEditorProps) => {
  return (
    <Editor
      className="d-editor"
      height={400}
      value={props.value}
      language={props.language}
      options={{
        domReadOnly: props.readOnly,
        readOnly: props.readOnly,
        scrollBeyondLastLine: false,
        minimap: {
          enabled: false,
        },
      }}
      onChange={props.onChange}
    />
  );
};

export default DEditor;
