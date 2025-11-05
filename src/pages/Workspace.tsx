import Navbar from "@/components/Navbar";
import CodeEditor from "@/components/CodeEditor";
import AIPromptPanel from "@/components/AIPromptPanel";
import LivePreview from "@/components/LivePreview";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Play, Settings, Download, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const Workspace = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      toast.error("Please sign in to access the workspace");
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  const generateCode = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a description");
      return;
    }

    // Get API keys from localStorage
    const apiKeys = JSON.parse(localStorage.getItem('apiKeys') || '{}');
    const openaiKey = apiKeys.openai;
    const anthropicKey = apiKeys.anthropic;
    const geminiKey = apiKeys.gemini;

    // Determine which provider to use (priority: OpenAI > Anthropic > Gemini)
    let apiKey = '';
    let provider = '';
    
    if (openaiKey) {
      apiKey = openaiKey;
      provider = 'openai';
    } else if (anthropicKey) {
      apiKey = anthropicKey;
      provider = 'anthropic';
    } else if (geminiKey) {
      apiKey = geminiKey;
      provider = 'gemini';
    }

    if (!apiKey) {
      toast.error("Please add your API key in Settings first");
      navigate("/settings");
      return;
    }

    setIsGenerating(true);
    setGeneratedCode("");

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error("Please sign in to generate code");
        navigate("/auth");
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-code`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ prompt, apiKey, provider }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Failed to generate code" }));
        throw new Error(errorData.error || "Failed to generate code");
      }

      if (!response.body) {
        throw new Error("No response body received");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let streamDone = false;

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") {
            streamDone = true;
            break;
          }

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              setGeneratedCode((prev) => prev + content);
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      toast.success("Code generated successfully!");
    } catch (error) {
      console.error("Error generating code:", error);
      toast.error(error instanceof Error ? error.message : "Failed to generate code");
      setGeneratedCode("");
    } finally {
      setIsGenerating(false);
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-20 h-screen flex flex-col">
        {/* Top Bar */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="border-b border-border bg-background/50 backdrop-blur-sm px-6 py-3 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-muted-foreground">Untitled Project</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate("/settings")}>
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button size="sm" className="shadow-paper">
              <Play className="w-4 h-4 mr-2" />
              Deploy
            </Button>
          </div>
        </motion.div>

        {/* Main Workspace */}
        <div className="flex-1 flex overflow-hidden">
          {/* AI Prompt Panel */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <AIPromptPanel
              prompt={prompt}
              setPrompt={setPrompt}
              isGenerating={isGenerating}
              onGenerate={generateCode}
            />
          </motion.div>

          {/* Editor & Preview Split */}
          <div className="flex-1 flex flex-col">
            {/* Code Editor */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <CodeEditor code={generatedCode} />
            </motion.div>

            {/* Live Preview */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <LivePreview />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Workspace;
