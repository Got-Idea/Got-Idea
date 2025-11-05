import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Loader2 } from "lucide-react";

interface AIPromptPanelProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  isGenerating: boolean;
  onGenerate: () => void;
}

const quickActions = [
  {
    title: "Add Navigation",
    prompt: "Create a modern navigation bar with logo, menu items (Home, About, Services, Contact), and a call-to-action button. Make it responsive with a mobile hamburger menu."
  },
  {
    title: "Create Hero Section",
    prompt: "Create a hero section with a large heading, subtitle, description text, and two CTA buttons (primary and secondary). Add a beautiful gradient background."
  },
  {
    title: "Add Contact Form",
    prompt: "Create a contact form with fields for name, email, subject, and message. Include validation and a submit button with loading state."
  },
  {
    title: "Add Features Grid",
    prompt: "Create a features section with 4 feature cards displaying icons, titles, and descriptions in a responsive grid layout."
  }
];

const AIPromptPanel = ({ prompt, setPrompt, isGenerating, onGenerate }: AIPromptPanelProps) => {
  return (
    <div className="w-80 border-r border-border bg-muted/20 p-6 space-y-4 overflow-y-auto">
      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">AI Assistant</h3>
        </div>
        
        <Textarea
          placeholder="Describe what you want to build... 

Example: Create a portfolio website with a modern design, hero section, project showcase grid, and contact form"
          className="min-h-[200px] resize-none shadow-paper"
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
          className="w-full shadow-paper" 
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

      <div className="paper-card p-4 space-y-2">
        <h4 className="text-sm font-semibold">Quick Actions</h4>
        <div className="space-y-2">
          {quickActions.map((action) => (
            <button 
              key={action.title}
              className="w-full text-left text-sm p-2 rounded-lg hover:bg-muted/50 transition-colors"
              onClick={() => setPrompt(action.prompt)}
            >
              {action.title}
            </button>
          ))}
        </div>
      </div>

      <div className="paper-card p-4 space-y-2 bg-primary/5 border border-primary/20">
        <h4 className="text-sm font-semibold flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          AI Powered by Lovable
        </h4>
        <p className="text-xs text-muted-foreground">
          Code generation uses Lovable AI - fast, intelligent, and no API keys required!
        </p>
      </div>
    </div>
  );
};

export default AIPromptPanel;
