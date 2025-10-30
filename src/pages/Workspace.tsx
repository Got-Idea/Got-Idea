import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Play, Settings, Download, Sparkles } from "lucide-react";
import { useState } from "react";

const Workspace = () => {
  const [prompt, setPrompt] = useState("");

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
            <Button variant="outline" size="sm">
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
            className="w-80 border-r border-border bg-muted/20 p-6 space-y-4 overflow-y-auto"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">AI Assistant</h3>
              </div>
              
              <Textarea
                placeholder="Describe what you want to build... 

Example: Create a portfolio website with a 3D papercraft theme and contact form"
                className="min-h-[200px] resize-none shadow-paper"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
              
              <Button className="w-full shadow-paper">
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Code
              </Button>
            </div>

            <div className="paper-card p-4 space-y-2">
              <h4 className="text-sm font-semibold">Quick Actions</h4>
              <div className="space-y-2">
                <button className="w-full text-left text-sm p-2 rounded-lg hover:bg-muted/50 transition-colors">
                  Add Navigation
                </button>
                <button className="w-full text-left text-sm p-2 rounded-lg hover:bg-muted/50 transition-colors">
                  Create Hero Section
                </button>
                <button className="w-full text-left text-sm p-2 rounded-lg hover:bg-muted/50 transition-colors">
                  Add Contact Form
                </button>
              </div>
            </div>

            <div className="paper-card p-4 space-y-2 bg-primary/5 border border-primary/20">
              <h4 className="text-sm font-semibold flex items-center gap-2">
                <Settings className="w-4 h-4" />
                API Configuration
              </h4>
              <p className="text-xs text-muted-foreground">
                Configure your API keys in Settings to enable AI features
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Go to Settings
              </Button>
            </div>
          </motion.div>

          {/* Editor & Preview Split */}
          <div className="flex-1 flex flex-col">
            {/* Code Editor */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex-1 border-b border-border bg-background p-6 overflow-auto"
            >
              <div className="paper-card p-6 h-full font-mono text-sm">
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
              </div>
            </motion.div>

            {/* Live Preview */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex-1 bg-muted/30 p-6 overflow-auto"
            >
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
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Workspace;
