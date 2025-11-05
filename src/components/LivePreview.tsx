import { Sparkles } from "lucide-react";

const LivePreview = () => {
  return (
    <div className="flex-1 bg-muted/30 p-6 overflow-auto">
      <div className="paper-card p-12 h-full flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto shadow-paper">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold">Live Preview</h2>
          <p className="text-muted-foreground max-w-md">
            Your generated website will appear here in real-time as you build with AI
          </p>
        </div>
      </div>
    </div>
  );
};

export default LivePreview;
