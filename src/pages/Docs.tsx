import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import { Book, Sparkles, Key, Code, Rocket } from "lucide-react";

const Docs = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-32 pb-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12"
          >
            <div className="space-y-4">
              <h1 className="text-5xl font-bold">Documentation</h1>
              <p className="text-xl text-muted-foreground">
                Learn how to build amazing websites with Got Idea
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="paper-card p-6 space-y-3 group hover:shadow-paper-lg transition-all">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shadow-paper-sm">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Getting Started</h3>
                <p className="text-muted-foreground">
                  Quick introduction to Got Idea and how to create your first project
                </p>
              </div>

              <div className="paper-card p-6 space-y-3 group hover:shadow-paper-lg transition-all">
                <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center shadow-paper-sm">
                  <Key className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold">API Keys Setup</h3>
                <p className="text-muted-foreground">
                  Learn how to connect your AI provider API keys securely
                </p>
              </div>

              <div className="paper-card p-6 space-y-3 group hover:shadow-paper-lg transition-all">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shadow-paper-sm">
                  <Code className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Using the Editor</h3>
                <p className="text-muted-foreground">
                  Master the workspace and learn advanced editing techniques
                </p>
              </div>

              <div className="paper-card p-6 space-y-3 group hover:shadow-paper-lg transition-all">
                <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center shadow-paper-sm">
                  <Rocket className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold">Deployment</h3>
                <p className="text-muted-foreground">
                  Deploy your projects to production with one click
                </p>
              </div>
            </div>

            <div className="paper-card p-8 space-y-6">
              <div className="flex items-center gap-2">
                <Book className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-semibold">Quick Start Guide</h2>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">1. Create an Account</h3>
                  <p className="text-muted-foreground">
                    Sign up using your email, GitHub, or Google account to get started.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">2. Add Your API Keys</h3>
                  <p className="text-muted-foreground">
                    Navigate to Settings and add your API keys from OpenAI, Anthropic, or Google Gemini.
                    Your keys are encrypted and stored securely.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">3. Start Building</h3>
                  <p className="text-muted-foreground">
                    Go to the Workspace and describe what you want to build. Our AI will generate
                    production-ready code that you can customize and deploy.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">4. Deploy</h3>
                  <p className="text-muted-foreground">
                    When you're ready, deploy your project to Vercel, Netlify, or any platform
                    with a single click.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Docs;
