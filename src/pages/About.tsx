import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-32 pb-16">
        <div className="container mx-auto px-6 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12"
          >
            <div className="space-y-4">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-secondary shadow-paper-xl mx-auto flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-foreground" />
              </div>
              <h1 className="text-5xl font-bold text-center">About Got Idea</h1>
            </div>

            <div className="paper-card p-8 space-y-6">
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">Our Philosophy</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Got Idea was born from a simple belief: <strong>You should own your AI journey.</strong>
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  While platforms like Lovable, Cursor, and Bolt.new have revolutionized AI-powered
                  development, they lock you into their ecosystem. We believe you deserve better.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  With Got Idea, you bring your own API keys from OpenAI, Anthropic, Google Gemini,
                  or any AI provider you choose. This means you control your costs, your data, and
                  your destiny.
                </p>
              </div>

              <div className="border-t border-border pt-6 space-y-4">
                <h2 className="text-2xl font-semibold">What Makes Us Different</h2>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex gap-3">
                    <span className="text-primary mt-1">•</span>
                    <span><strong className="text-foreground">Your API Keys:</strong> Use any AI provider you want, pay only for what you use</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary mt-1">•</span>
                    <span><strong className="text-foreground">Complete Control:</strong> Export your code, deploy anywhere, no vendor lock-in</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary mt-1">•</span>
                    <span><strong className="text-foreground">Privacy First:</strong> Your API keys never leave your browser</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary mt-1">•</span>
                    <span><strong className="text-foreground">Transparent Pricing:</strong> No hidden costs, no subscription tiers</span>
                  </li>
                </ul>
              </div>

              <div className="border-t border-border pt-6 space-y-4">
                <h2 className="text-2xl font-semibold">Our Mission</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We're on a mission to democratize AI-powered development. Whether you're a solo
                  founder, a startup, or an enterprise, you should have access to the same powerful
                  tools without breaking the bank or sacrificing control.
                </p>
                <p className="text-lg font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Your Idea. Your API. Your Creation.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default About;
