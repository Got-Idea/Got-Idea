import { Sparkles } from "lucide-react";
import { useEffect, useRef } from "react";
import ErrorBoundary from "./ErrorBoundary";

interface ProjectFile {
  name: string;
  content: string;
}

interface LivePreviewProps {
  files?: ProjectFile[];
}

const LivePreview = ({ files }: LivePreviewProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (files && files.length > 0 && iframeRef.current) {
      const iframe = iframeRef.current;
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      
      if (iframeDoc) {
        // Find HTML file
        const htmlFile = files.find(f => f.name.endsWith('.html'));
        const cssFile = files.find(f => f.name.endsWith('.css'));
        const jsFile = files.find(f => f.name.endsWith('.js'));

        let htmlContent = htmlFile?.content || '';

        // Inject CSS if exists
        if (cssFile && htmlContent) {
          htmlContent = htmlContent.replace(
            '</head>',
            `<style>${cssFile.content}</style></head>`
          );
        }

        // Inject JS if exists
        if (jsFile && htmlContent) {
          htmlContent = htmlContent.replace(
            '</body>',
            `<script>${jsFile.content}</script></body>`
          );
        }

        iframeDoc.open();
        iframeDoc.write(htmlContent);
        iframeDoc.close();
      }
    }
  }, [files]);

  return (
    <ErrorBoundary>
      <div className="flex-1 bg-[#1e1e1e] p-6 overflow-auto h-full">
        {files && files.length > 0 ? (
          <iframe
            ref={iframeRef}
            title="Live Preview"
            className="w-full h-full bg-white rounded border border-[#3e3e42]"
            sandbox="allow-scripts allow-same-origin"
          />
        ) : (
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
        )}
      </div>
    </ErrorBoundary>
  );
};

export default LivePreview;
