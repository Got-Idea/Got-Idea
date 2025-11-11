import { Loader2 } from "lucide-react";

const LoadingOverlay = () => {
  return (
    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="text-center space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Generating Code...</h3>
          <p className="text-sm text-muted-foreground">AI is creating your project files</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;
