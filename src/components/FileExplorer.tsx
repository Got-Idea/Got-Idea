import { FileCode, FileText, Braces } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileExplorerProps {
  files: { name: string; content: string }[];
  activeFile: string;
  onFileSelect: (fileName: string) => void;
}

const FileExplorer = ({ files, activeFile, onFileSelect }: FileExplorerProps) => {
  const getFileIcon = (fileName: string) => {
    if (fileName.endsWith('.html')) return <FileCode className="w-4 h-4 text-orange-500" />;
    if (fileName.endsWith('.css')) return <FileText className="w-4 h-4 text-blue-500" />;
    if (fileName.endsWith('.js')) return <Braces className="w-4 h-4 text-yellow-500" />;
    return <FileCode className="w-4 h-4" />;
  };

  if (files.length === 0) {
    return (
      <div className="w-48 bg-[#252526] border-r border-[#3e3e42] p-4">
        <p className="text-xs text-[#858585]">No files yet</p>
      </div>
    );
  }

  return (
    <div className="w-48 bg-[#252526] border-r border-[#3e3e42] overflow-y-auto">
      <div className="p-2">
        <p className="text-xs font-semibold text-[#cccccc] uppercase mb-2 px-2">Files</p>
        <div className="space-y-1">
          {files.map((file) => (
            <button
              key={file.name}
              onClick={() => onFileSelect(file.name)}
              className={cn(
                "w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm transition-colors",
                activeFile === file.name
                  ? "bg-[#37373d] text-[#ffffff]"
                  : "text-[#cccccc] hover:bg-[#2a2d2e]"
              )}
            >
              {getFileIcon(file.name)}
              <span className="truncate">{file.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FileExplorer;
