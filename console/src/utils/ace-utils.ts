export const loadAceMode = (language: string) => {
  switch (language) {
    case "javascript":
    case "js":
      import("ace-builds/src-noconflict/mode-javascript");
      return "javascript"
    case "json":
      import("ace-builds/src-noconflict/mode-json");
      return "json"
    case "python":
      import("ace-builds/src-noconflict/mode-python");
      return "python"
    case "yaml":
    case "yml":
      import("ace-builds/src-noconflict/mode-yaml");
      return "yaml"
    default:
      return "";
  }
}