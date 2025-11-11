import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Loader2 } from "lucide-react";
import { useRef, useEffect } from "react";

interface AIPromptPanelProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  isGenerating: boolean;
  onGenerate: () => void;
}

const AIPromptPanel = ({ prompt, setPrompt, isGenerating, onGenerate }: AIPromptPanelProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
    }
  }, [prompt]);

  return (
    <div className="w-80 border-r border-[#3e3e42] bg-[#252526] flex flex-col h-full pointer-events-auto">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#3e3e42]">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#4ec9b0]" />
          <h3 className="font-semibold text-[#cccccc]">AI Assistant</h3>
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        <div className="space-y-3">
          <textarea
            ref={textareaRef}
            placeholder="Describe what you want to build...

Example: Create a portfolio website with a modern design, hero section, project showcase grid, and contact form"
            className="min-h-[180px] w-full resize-none bg-[#1e1e1e] border border-[#3e3e42] text-[#d4d4d4] placeholder:text-[#858585] focus-visible:ring-1 focus-visible:ring-[#0e639c] focus-visible:border-[#0e639c] focus:outline-none rounded-md px-3 py-2"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                onGenerate();
              }
            }}
          />
          
          <Button 
            className="w-full bg-[#0e639c] hover:bg-[#1177bb] text-white" 
            onClick={onGenerate}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Code
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-[#3e3e42] bg-[#1e1e1e]">
        <div className="flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-[#4ec9b0] mt-0.5" />
          <div className="flex-1">
            <h4 className="text-xs font-semibold text-[#cccccc]">AI Code Generator</h4>
            <p className="text-xs text-[#858585] mt-1">
              Powered by your API keys - configure in Settings
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIPromptPanel;
