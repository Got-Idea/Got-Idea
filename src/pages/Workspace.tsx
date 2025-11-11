import Navbar from "@/components/Navbar";
import CodeEditor from "@/components/CodeEditor";
import AIPromptPanel from "@/components/AIPromptPanel";
import LivePreview from "@/components/LivePreview";
import TemplateSelector from "@/components/TemplateSelector";
import FileExplorer from "@/components/FileExplorer";
import LoadingOverlay from "@/components/LoadingOverlay";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Download, FileCode, Save, FolderOpen, Code, Eye } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import JSZip from "jszip";

interface ProjectFile {
  name: string;
  content: string;
}

interface SavedProject {
  title: string;
  files: ProjectFile[];
  prompt: string;
  savedAt: string;
}

const Workspace = () => {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState("");
  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [activeFile, setActiveFile] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [projectTitle, setProjectTitle] = useState("Untitled Project");
  const [showTemplates, setShowTemplates] = useState(false);
  const [savedProjects, setSavedProjects] = useState<SavedProject[]>([]);
  const [showLoadDialog, setShowLoadDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("code");

  // Load saved projects from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('savedProjects');
    if (saved) {
      setSavedProjects(JSON.parse(saved));
    }
  }, []);

  const handleTemplateSelect = (code: string, title: string) => {
    setFiles([{ name: 'index.html', content: code }]);
    setActiveFile('index.html');
    setProjectTitle(title);
    setShowTemplates(false);
    toast.success(`${title} template loaded!`);
  };

  const generateCode = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a description");
      return;
    }

    setIsGenerating(true);
    setFiles([]);
    setActiveFile("");
    setActiveTab("preview");
    
    if (!projectTitle || projectTitle === "Untitled Project") {
      setProjectTitle(prompt.slice(0, 50) + (prompt.length > 50 ? '...' : ''));
    }

    try {
      const response = await fetch(
        `https://aqlxrasequxshncrlfer.supabase.co/functions/v1/generate-code`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt }),
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
      let fullHtmlContent = "";

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        textBuffer += chunk;

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
            const content = parsed.candidates?.[0]?.content?.parts?.[0]?.text as string | undefined;
            
            if (content) {
              fullHtmlContent += content;
              
              // Update single HTML file in real-time
              setFiles([{ name: 'index.html', content: fullHtmlContent }]);
              if (!activeFile) {
                setActiveFile('index.html');
              }
            }
          } catch (e) {
            console.error('Parse error:', e);
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      toast.success("Code generated successfully!");
    } catch (error) {
      console.error("Error generating code:", error);
      toast.error(error instanceof Error ? error.message : "Failed to generate code");
      setFiles([]);
    } finally {
      setIsGenerating(false);
    }
  };

  const saveProject = () => {
    if (files.length === 0) {
      toast.error("No code to save");
      return;
    }

    const newProject: SavedProject = {
      title: projectTitle,
      files: files,
      prompt: prompt,
      savedAt: new Date().toISOString()
    };

    const updated = [...savedProjects, newProject];
    setSavedProjects(updated);
    localStorage.setItem('savedProjects', JSON.stringify(updated));
    toast.success("Project saved successfully!");
  };

  const loadProject = (project: SavedProject) => {
    setProjectTitle(project.title);
    setFiles(project.files);
    setActiveFile(project.files[0]?.name || "");
    setPrompt(project.prompt);
    setShowLoadDialog(false);
    toast.success("Project loaded successfully!");
  };

  const deleteProject = (index: number) => {
    const updated = savedProjects.filter((_, i) => i !== index);
    setSavedProjects(updated);
    localStorage.setItem('savedProjects', JSON.stringify(updated));
    toast.success("Project deleted!");
  };

  const exportAsZip = async () => {
    if (files.length === 0) {
      toast.error("No code to export");
      return;
    }

    const zip = new JSZip();
    
    // Add all files to zip
    files.forEach(file => {
      zip.file(file.name, file.content);
    });

    zip.file("package.json", JSON.stringify({
      "name": "got-idea-project",
      "version": "1.0.0",
      "description": "Generated by Got Idea",
      "main": "index.html",
      "scripts": {
        "start": "vite",
        "build": "vite build"
      },
      "dependencies": {
        "react": "^18.3.1",
        "react-dom": "^18.3.1"
      },
      "devDependencies": {
        "vite": "^5.0.0",
        "@vitejs/plugin-react": "^4.2.0"
      }
    }, null, 2));

    zip.file("README.md", `# Got Idea Project\n\nGenerated with Got Idea AI\n\n## Setup\n\`\`\`bash\nnpm install\nnpm start\n\`\`\``);

    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${projectTitle.replace(/\s+/g, '-').toLowerCase()}.zip`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success("Project exported successfully!");
  };

  const currentFile = files.find(f => f.name === activeFile);
  const handleCodeChange = (newCode: string) => {
    setFiles(files.map(f => 
      f.name === activeFile ? { ...f, content: newCode } : f
    ));
  };

  return (
    <div className="min-h-screen bg-background relative">
      {isGenerating && <LoadingOverlay />}
      <Navbar />
      
      <div className="pt-20 h-screen flex flex-col">
        {/* Top Bar */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="border-b border-border bg-background/50 backdrop-blur-sm px-6 py-3 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-muted-foreground">{projectTitle}</span>
          </div>
          <div className="flex items-center gap-2">
            <Dialog open={showTemplates} onOpenChange={setShowTemplates}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <FileCode className="w-4 h-4 mr-2" />
                  Templates
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Choose a Template</DialogTitle>
                </DialogHeader>
                <TemplateSelector onSelectTemplate={handleTemplateSelect} />
              </DialogContent>
            </Dialog>
            <Button variant="outline" size="sm" onClick={saveProject} disabled={files.length === 0}>
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Dialog open={showLoadDialog} onOpenChange={setShowLoadDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <FolderOpen className="w-4 h-4 mr-2" />
                  Load
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Load Project</DialogTitle>
                </DialogHeader>
                <div className="max-h-96 overflow-y-auto space-y-2">
                  {savedProjects.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No saved projects yet</p>
                  ) : (
                    savedProjects.map((project, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent">
                        <div className="flex-1">
                          <h3 className="font-medium">{project.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            Saved {new Date(project.savedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => loadProject(project)}>Load</Button>
                          <Button size="sm" variant="destructive" onClick={() => deleteProject(index)}>Delete</Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </DialogContent>
            </Dialog>
            <Button variant="outline" size="sm" onClick={() => navigate("/settings")}>
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button variant="outline" size="sm" onClick={exportAsZip} disabled={files.length === 0}>
              <Download className="w-4 h-4 mr-2" />
              Export
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

          {/* Code & Preview with File Explorer */}
          <div className="flex-1 flex flex-col pointer-events-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
              <TabsList className="w-full justify-start rounded-none border-b bg-[#2d2d30] border-[#3e3e42] px-6 pointer-events-auto">
                <TabsTrigger value="code" className="gap-2 data-[state=active]:bg-[#1e1e1e] data-[state=active]:text-[#cccccc] text-[#858585] cursor-pointer pointer-events-auto">
                  <Code className="w-4 h-4" />
                  Code
                </TabsTrigger>
                <TabsTrigger value="preview" className="gap-2 data-[state=active]:bg-[#1e1e1e] data-[state=active]:text-[#cccccc] text-[#858585] cursor-pointer pointer-events-auto">
                  <Eye className="w-4 h-4" />
                  Preview
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="code" className="flex-1 m-0 overflow-auto flex">
                <FileExplorer 
                  files={files} 
                  activeFile={activeFile}
                  onFileSelect={setActiveFile}
                />
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex-1"
                >
                  <CodeEditor 
                    code={currentFile?.content || ""} 
                    onCodeChange={handleCodeChange} 
                  />
                </motion.div>
              </TabsContent>

              <TabsContent value="preview" className="flex-1 m-0 overflow-auto bg-[#1e1e1e]">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="h-full"
                >
                  <LivePreview files={files} />
                </motion.div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Workspace;
