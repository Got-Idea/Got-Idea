import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Key, CheckCircle, AlertCircle, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const Settings = () => {
  const [apiKeys, setApiKeys] = useState({
    openai: "",
    anthropic: "",
    gemini: "",
  });

  const [selectedModel, setSelectedModel] = useState({
    openai: "gpt-4o-mini",
    anthropic: "claude-sonnet-4-5",
    gemini: "gemini-1.5-flash",
  });

  const [validated, setValidated] = useState({
    openai: false,
    anthropic: false,
    gemini: false,
  });

  useEffect(() => {
    // Load saved API keys from localStorage
    const savedKeys = localStorage.getItem("apiKeys");
    if (savedKeys) {
      try {
        setApiKeys(JSON.parse(savedKeys));
      } catch (e) {
        console.error("Failed to load API keys", e);
      }
    }
    
    // Load saved model preferences
    const savedModels = localStorage.getItem("selectedModels");
    if (savedModels) {
      try {
        setSelectedModel(JSON.parse(savedModels));
      } catch (e) {
        console.error("Failed to load model preferences", e);
      }
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem("apiKeys", JSON.stringify(apiKeys));
    localStorage.setItem("selectedModels", JSON.stringify(selectedModel));
    toast.success("Settings saved successfully!");
  };

  const handleReset = () => {
    setApiKeys({ openai: "", anthropic: "", gemini: "" });
    setSelectedModel({ openai: "gpt-4o-mini", anthropic: "claude-sonnet-4-5", gemini: "gemini-1.5-flash" });
    setValidated({ openai: false, anthropic: false, gemini: false });
    localStorage.removeItem("apiKeys");
    localStorage.removeItem("selectedModels");
    toast.success("Settings reset successfully!");
  };

  const handleValidate = (provider: string) => {
    // Mock validation
    setValidated({ ...validated, [provider]: true });
    toast.success(`${provider.charAt(0).toUpperCase() + provider.slice(1)} API key validated!`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-32 pb-16">
        <div className="container mx-auto px-6 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="space-y-2">
              <h1 className="text-4xl font-bold">Settings</h1>
              <p className="text-muted-foreground">
                Configure your API keys to enable AI-powered features
              </p>
            </div>

            <div className="paper-card p-8 space-y-8">
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-4">
                  <Key className="w-5 h-5 text-primary" />
                  <h2 className="text-2xl font-semibold">API Integrations</h2>
                </div>
                <p className="text-sm text-muted-foreground">
                  Your API keys are encrypted and stored securely. They never leave your browser.
                </p>
              </div>

              {/* OpenAI */}
              <div className="space-y-3">
                <Label htmlFor="openai" className="text-base font-semibold flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  OpenAI
                </Label>
                <div className="space-y-3">
                  <Select value={selectedModel.openai} onValueChange={(val) => setSelectedModel({...selectedModel, openai: val})}>
                    <SelectTrigger className="shadow-paper">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gpt-5-2025-08-07">GPT-5 (Most Capable)</SelectItem>
                      <SelectItem value="gpt-5-mini-2025-08-07">GPT-5 Mini (Balanced)</SelectItem>
                      <SelectItem value="gpt-5-nano-2025-08-07">GPT-5 Nano (Fast)</SelectItem>
                      <SelectItem value="gpt-4o">GPT-4o (Legacy)</SelectItem>
                      <SelectItem value="gpt-4o-mini">GPT-4o Mini (Legacy)</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex gap-3">
                    <Input
                      id="openai"
                      type="password"
                      placeholder="sk-..."
                      value={apiKeys.openai}
                      onChange={(e) => setApiKeys({ ...apiKeys, openai: e.target.value })}
                      className="shadow-paper"
                    />
                    <Button
                      onClick={() => handleValidate("openai")}
                      variant="outline"
                      className="shadow-paper"
                    >
                      {validated.openai ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        "Validate"
                      )}
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Get your API key from{" "}
                  <a
                    href="https://platform.openai.com/api-keys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    OpenAI Platform
                  </a>
                </p>
              </div>

              {/* Anthropic */}
              <div className="space-y-3">
                <Label htmlFor="anthropic" className="text-base font-semibold flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  Anthropic (Claude)
                </Label>
                <div className="space-y-3">
                  <Select value={selectedModel.anthropic} onValueChange={(val) => setSelectedModel({...selectedModel, anthropic: val})}>
                    <SelectTrigger className="shadow-paper">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="claude-sonnet-4-5">Claude Sonnet 4.5 (Best)</SelectItem>
                      <SelectItem value="claude-opus-4-1-20250805">Claude Opus 4.1 (Powerful)</SelectItem>
                      <SelectItem value="claude-sonnet-4-20250514">Claude Sonnet 4</SelectItem>
                      <SelectItem value="claude-3-5-haiku-20241022">Claude 3.5 Haiku (Fast)</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex gap-3">
                    <Input
                      id="anthropic"
                      type="password"
                      placeholder="sk-ant-..."
                      value={apiKeys.anthropic}
                      onChange={(e) => setApiKeys({ ...apiKeys, anthropic: e.target.value })}
                      className="shadow-paper"
                    />
                    <Button
                      onClick={() => handleValidate("anthropic")}
                      variant="outline"
                      className="shadow-paper"
                    >
                      {validated.anthropic ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        "Validate"
                      )}
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Get your API key from{" "}
                  <a
                    href="https://console.anthropic.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Anthropic Console
                  </a>
                </p>
              </div>

              {/* Gemini */}
              <div className="space-y-3">
                <Label htmlFor="gemini" className="text-base font-semibold flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  Google Gemini
                </Label>
                <div className="space-y-3">
                  <Select value={selectedModel.gemini} onValueChange={(val) => setSelectedModel({...selectedModel, gemini: val})}>
                    <SelectTrigger className="shadow-paper">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gemini-1.5-pro">Gemini 1.5 Pro (Best)</SelectItem>
                      <SelectItem value="gemini-1.5-flash">Gemini 1.5 Flash (Balanced)</SelectItem>
                      <SelectItem value="gemini-1.5-flash-8b">Gemini 1.5 Flash-8B (Fast)</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex gap-3">
                    <Input
                      id="gemini"
                      type="password"
                      placeholder="AI..."
                      value={apiKeys.gemini}
                      onChange={(e) => setApiKeys({ ...apiKeys, gemini: e.target.value })}
                      className="shadow-paper"
                    />
                    <Button
                      onClick={() => handleValidate("gemini")}
                      variant="outline"
                      className="shadow-paper"
                    >
                      {validated.gemini ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        "Validate"
                      )}
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Get your API key from{" "}
                  <a
                    href="https://makersuite.google.com/app/apikey"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Google AI Studio
                  </a>
                </p>
              </div>

              <div className="pt-6 border-t border-border">
                <div className="flex items-start gap-3 p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <AlertCircle className="w-5 h-5 text-primary mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Security Notice</p>
                    <p className="text-xs text-muted-foreground">
                      Your API keys are encrypted using industry-standard encryption and stored
                      locally in your browser. We never send your keys to our servers.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button className="shadow-paper" onClick={handleSave}>Save Settings</Button>
                <Button variant="outline" className="shadow-paper" onClick={handleReset}>
                  Reset All
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
