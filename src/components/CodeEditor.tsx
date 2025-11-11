import { Button } from "@/components/ui/button";
import { Copy, CheckCheck, FileCode, ChevronRight, ChevronDown, Folder, File } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
interface CodeEditorProps {
  code: string;
  onCodeChange?: (newCode: string) => void;
}

// Mock file tree structure
const fileTree = [{
  name: "src",
  type: "folder",
  expanded: true,
  children: [{
    name: "components",
    type: "folder",
    expanded: false
  }, {
    name: "pages",
    type: "folder",
    expanded: false
  }, {
    name: "App.tsx",
    type: "file"
  }, {
    name: "index.css",
    type: "file"
  }, {
    name: "main.tsx",
    type: "file"
  }]
}, {
  name: "public",
  type: "folder",
  expanded: false
}, {
  name: "package.json",
  type: "file"
}, {
  name: "vite.config.ts",
  type: "file"
}];
const CodeEditor = ({
  code
}: CodeEditorProps) => {
  const [copied, setCopied] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(["src"]));
  const copyToClipboard = async () => {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success("Code copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy code");
    }
  };
  const toggleFolder = (folderName: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderName)) {
      newExpanded.delete(folderName);
    } else {
      newExpanded.add(folderName);
    }
    setExpandedFolders(newExpanded);
  };
  const renderFileTree = (items: any[], level = 0) => {
    return items.map((item, index) => <div key={index}>
        <div className={`flex items-center gap-2 py-1 px-2 hover:bg-accent cursor-pointer text-sm`} style={{
        paddingLeft: `${level * 12 + 8}px`
      }} onClick={() => item.type === "folder" && toggleFolder(item.name)}>
          {item.type === "folder" ? <>
              {expandedFolders.has(item.name) ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              <Folder className="w-4 h-4 text-primary" />
            </> : <>
              <File className="w-4 h-4 ml-5 text-muted-foreground" />
            </>}
          <span>{item.name}</span>
        </div>
        {item.type === "folder" && item.children && expandedFolders.has(item.name) && <div>
            {renderFileTree(item.children, level + 1)}
          </div>}
      </div>);
  };
  const codeLines = code ? code.split('\n') : [];
  return <div className="flex-1 bg-[#1e1e1e] text-[#d4d4d4] overflow-hidden flex h-full">
      {/* File Explorer Sidebar */}
      

      {/* Code Editor Area */}
      <div className="flex-1 flex flex-col">
        {/* File Tab */}
        <div className="bg-[#2d2d30] border-b border-[#3e3e42] px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <FileCode className="w-4 h-4 text-[#89d185]" />
            <span className="text-[#cccccc]">generated-code.tsx</span>
          </div>
          <Button size="sm" variant="ghost" onClick={copyToClipboard} className="h-7 gap-2 text-[#cccccc] hover:bg-[#3e3e42]">
            {copied ? <>
                <CheckCheck className="w-4 h-4" />
                Copied!
              </> : <>
                <Copy className="w-4 h-4" />
                Copy
              </>}
          </Button>
        </div>

        {/* Code Content with Line Numbers */}
        <div className="flex-1 overflow-auto">
          {code ? <div className="flex font-mono text-sm">
              {/* Line Numbers */}
              <div className="bg-[#1e1e1e] text-[#858585] px-4 py-4 text-right select-none border-r border-[#3e3e42]">
                {codeLines.map((_, i) => <div key={i} className="leading-6">{i + 1}</div>)}
              </div>
              {/* Code Content */}
              <pre className="flex-1 px-4 py-4 overflow-x-auto">
                <code className="text-[#d4d4d4] leading-6 whitespace-pre">
                  {code}
                </code>
              </pre>
            </div> : <div className="p-8 text-center text-[#858585]">
              <FileCode className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>No code generated yet</p>
              <p className="text-sm mt-2">Use the AI Assistant to generate code</p>
            </div>}
        </div>
      </div>
    </div>;
};
export default CodeEditor;