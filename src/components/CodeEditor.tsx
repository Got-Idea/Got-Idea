import { Button } from "@/components/ui/button";
import { Copy, CheckCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface CodeEditorProps {
  code: string;
}

const CodeEditor = ({ code }: CodeEditorProps) => {
  const [copied, setCopied] = useState(false);

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

  return (
    <div className="flex-1 border-b border-border bg-background overflow-hidden flex flex-col">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h3 className="text-sm font-semibold">Generated Code</h3>
        {code && (
          <Button
            size="sm"
            variant="outline"
            onClick={copyToClipboard}
            className="gap-2"
          >
            {copied ? (
              <>
                <CheckCheck className="w-4 h-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy Code
              </>
            )}
          </Button>
        )}
      </div>
      <div className="flex-1 p-6 overflow-auto">
        <div className="paper-card p-6 h-full font-mono text-sm overflow-auto">
          {code ? (
            <pre className="text-foreground whitespace-pre-wrap">
              {code}
            </pre>
          ) : (
            <div className="text-muted-foreground">
              <span className="text-primary">{"<div"}</span>
              {" className="}
              <span className="text-secondary">"container"</span>
              {">"}<br />
              {"  "}<span className="text-primary">{"<h1>"}</span>
              Welcome to Got Idea
              <span className="text-primary">{"</h1>"}</span><br />
              {"  "}<span className="text-primary">{"<p>"}</span>
              Start building with AI...
              <span className="text-primary">{"</p>"}</span><br />
              <span className="text-primary">{"</div>"}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
