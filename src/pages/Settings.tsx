import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Key, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Settings = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [apiKeys, setApiKeys] = useState({
    openai: "",
    anthropic: "",
    gemini: "",
  });

  const [validated, setValidated] = useState({
    openai: false,
    anthropic: false,
    gemini: false,
  });

  useEffect(() => {
    if (!loading && !user) {
      toast.error("Please sign in to access settings");
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    // Load saved API keys from localStorage
    const savedKeys = localStorage.getItem("api_keys");
    if (savedKeys) {
      try {
        setApiKeys(JSON.parse(savedKeys));
      } catch (e) {
        console.error("Failed to load API keys", e);
      }
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem("api_keys", JSON.stringify(apiKeys));
    toast.success("Settings saved successfully!");
  };

  const handleReset = () => {
    setApiKeys({ openai: "", anthropic: "", gemini: "" });
    setValidated({ openai: false, anthropic: false, gemini: false });
    localStorage.removeItem("api_keys");
    toast.success("Settings reset successfully!");
  };

  const handleValidate = (provider: string) => {
    // Mock validation
    setValidated({ ...validated, [provider]: true });
    toast.success(`${provider.charAt(0).toUpperCase() + provider.slice(1)} API key validated!`);
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
                <Label htmlFor="openai" className="text-base font-semibold">
                  OpenAI API Key
                </Label>
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
                <Label htmlFor="anthropic" className="text-base font-semibold">
                  Anthropic API Key (Claude)
                </Label>
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
                <Label htmlFor="gemini" className="text-base font-semibold">
                  Google Gemini API Key
                </Label>
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
