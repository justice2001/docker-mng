import React, {useEffect} from "react";
import apiRequest from "@/utils/api-request.ts";
import {useParams} from "react-router";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/theme-monokai";
import {loadAceMode} from "@/utils/ace-utils.ts";

interface TextProviderProps {
  path: string;
}

export const TextProvider: React.FC<TextProviderProps> = ({ path }) => {
  const [content, setContent] = React.useState('');
  const [language, setLanguage] = React.useState<string>('');
  const {node, stack} = useParams();

  useEffect(() => {
    console.log("The path changed", path)
    const ext = path.substring(path.lastIndexOf(".") + 1);
    setLanguage(loadAceMode(ext))

    if (path) {
      apiRequest.get(`/data/${node}/${stack}/file?path=` + path).then(res => {
        if (ext === 'json') {
          res.data = JSON.stringify(res.data, null, 2);
        }
        setContent(res.data)
      })
    }
  }, [path]);

  return (<AceEditor
      mode={language}
      theme="monokai"
      name="dynamic-ace-editor"
      width="100%"
      height="400px"
      fontSize={14}
      value={content}
      setOptions={{
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true,
        enableSnippets: true,
      }}
  />)
}