import React, { useState, useCallback, FC, useEffect } from 'react';
import { generateWebsiteCode } from '../../services/aiService';
import { AiProvider, Message, Project } from '../../types';
import { getProjects, saveProject } from '../../services/supabaseService';
import Button from '../Button';
import TemplateSelector from '../workspace/TemplateSelector';
import LoadingOverlay from '../workspace/LoadingOverlay';
import ResponsiveToolbar, { Device } from '../workspace/ResponsiveToolbar';
import VercelDeployModal from '../workspace/VercelDeployModal';
import GitHubDeployModal from '../workspace/GitHubDeployModal';
import { XIcon, HistoryIcon, FilePlusIcon, SaveIcon, CaseIcon, GitHubIcon, UserIcon } from '../Icons';
import ChatHistory from '../workspace/ChatHistory';
import ChatInput from '../workspace/ChatInput';
import { SupabaseClient, User } from '@supabase/supabase-js';
import ProjectsModal from '../workspace/ProjectsModal';

type VersionHistoryPopoverProps = {
    history: string[];
    currentIndex: number;
    onRevert: (index: number) => void;
    onClose: () => void;
};
const VersionHistoryPopover: FC<VersionHistoryPopoverProps> = ({ history, currentIndex, onRevert, onClose }) => {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-10" onClick={onClose}>
        <div className="absolute top-14 right-4 z-20 w-64 bg-[var(--gotidea-bg-alt)] rounded-lg shadow-[var(--gotidea-shadow-lg)] border border-[var(--gotidea-border)]" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center p-2 border-b border-[var(--gotidea-border)]">
            <h3 className="font-semibold text-sm px-2">Version History</h3>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-[var(--gotidea-bg)]"><XIcon className="w-5 h-5 text-[var(--gotidea-text-muted)]"/></button>
        </div>
        <ul className="p-2 max-h-80 overflow-y-auto flex flex-col-reverse">
            {history.map((_, index) => (
            <li key={index}>
                <button
                onClick={() => onRevert(index)}
                className={`w-full text-left p-2 my-0.5 rounded-md text-sm transition-colors ${
                    index === currentIndex
                    ? 'bg-[var(--gotidea-primary)]/10 text-[var(--gotidea-primary)] font-bold'
                    : 'hover:bg-[var(--gotidea-bg)] text-[var(--gotidea-text)]'
                }`}
                >
                Version {index + 1} {index === currentIndex && '(Current)'}
                </button>
            </li>
            ))}
        </ul>
        </div>
    </div>
  );
};

type WorkspaceProps = {
    provider: AiProvider;
    activeApiKey: string | null;
    supabase: SupabaseClient | null;
    user: User | null;
    userSupabaseUrl: string | null;
    userSupabaseAnonKey: string | null;
};

const Workspace: FC<WorkspaceProps> = ({ provider, activeApiKey, supabase, user, userSupabaseUrl, userSupabaseAnonKey }) => {
    // Project State
    const [activeProject, setActiveProject] = useState<Project | null>(null);
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: "Welcome to Got Idea! Describe the website you want to build, or select a template to get started.", timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);
    const [generatedCode, setGeneratedCode] = useState('');
    const [codeHistory, setCodeHistory] = useState<string[]>([]);
    const [currentVersionIndex, setCurrentVersionIndex] = useState(-1);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    
    // UI State
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('preview');
    const [devicePreview, setDevicePreview] = useState<Device>('desktop');
    const [isVercelModalOpen, setIsVercelModalOpen] = useState(false);
    const [isGitHubModalOpen, setIsGitHubModalOpen] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [isNewProjectConfirmOpen, setIsNewProjectConfirmOpen] = useState(false);
    const [isProjectsModalOpen, setIsProjectsModalOpen] = useState(false);

    const parseErrorMessage = (error: Error): string => {
        const message = error.message.toLowerCase();

        if (message.includes('api key not valid') || message.includes('invalid api key')) {
            return "It seems your API key is invalid. Please double-check it in the Settings page. You can get a new key from your AI provider's dashboard.";
        }
        if (message.includes('rate limit')) {
            return "You've hit the API rate limit. Please wait a bit before sending another request. Check your usage plan with your AI provider if this continues.";
        }
        if (message.includes('billing') || message.includes('quota')) {
            return "There might be an issue with your API key's billing or quota. Please visit your AI provider's dashboard to ensure your account is in good standing.";
        }
        if (message.includes('blocked') || message.includes('safety')) {
            return "The request was blocked due to safety settings. Please try rephrasing your prompt to be more compliant with the AI's safety policy.";
        }
        if (message.includes('failed to fetch')) {
             return "Could not connect to the AI service. Please check your internet connection and try again.";
        }

        // Generic fallback
        return `An unexpected error occurred. This can sometimes happen with very complex requests. You could try simplifying your prompt.\n\nOriginal error: ${error.message}`;
    };

    const handleSendMessage = useCallback(async (newMessage: string) => {
        if (!activeApiKey) {
            setError('API key is not set. Please add it in Settings.');
            return;
        }
        if (!user) {
            setError('Please sign in to start creating. Signing in allows you to save your projects.');
            return;
        }
        
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const newUserMessage: Message = { role: 'user', content: newMessage, timestamp };
        setMessages(prev => [...prev, newUserMessage]);
        setIsLoading(true);
        setError(null);
        setIsHistoryOpen(false);

        try {
            const codeToModify = generatedCode || undefined;
            const code = await generateWebsiteCode(newMessage, provider, activeApiKey, codeToModify, userSupabaseUrl, userSupabaseAnonKey);
            
            const newHistory = [...codeHistory.slice(0, currentVersionIndex + 1), code];
            setCodeHistory(newHistory);
            const newVersionIndex = newHistory.length - 1;
            setCurrentVersionIndex(newVersionIndex);
            setGeneratedCode(code);
            setActiveTab('preview');
            setMessages(prev => [...prev, { role: 'assistant', content: `I've updated the website and created Version ${newVersionIndex + 1}. What's next?`, version: newVersionIndex + 1, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
            setHasUnsavedChanges(true);
        } catch (err: any) {
            const friendlyErrorMessage = parseErrorMessage(err);
            setError(friendlyErrorMessage);
            setMessages(prev => [...prev, { role: 'assistant', content: `I encountered a problem trying to generate the website. Here are the details:\n\n${friendlyErrorMessage}`, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
        } finally {
            setIsLoading(false);
        }
    }, [provider, activeApiKey, codeHistory, currentVersionIndex, userSupabaseUrl, userSupabaseAnonKey, user, generatedCode]);

    const handleRevert = (index: number) => {
        if (index >= 0 && index < codeHistory.length) {
            setCurrentVersionIndex(index);
            setGeneratedCode(codeHistory[index]);
            setIsHistoryOpen(false);
            setMessages(prev => [...prev, { role: 'assistant', content: `Reverted to Version ${index + 1}. You can now ask me to make changes to this version.`, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
            setHasUnsavedChanges(true);
        }
    };
    
    const handleStartNewProject = () => {
        setActiveProject(null);
        setMessages([
            { role: 'assistant', content: "Welcome back! Let's build something new. Describe the website you want, or pick a template.", timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
        ]);
        setGeneratedCode('');
        setCodeHistory([]);
        setCurrentVersionIndex(-1);
        setError(null);
        setActiveTab('preview');
        setIsNewProjectConfirmOpen(false);
        setHasUnsavedChanges(false);
    };

    const handleSaveProject = async () => {
        if (!supabase || !user || !generatedCode) {
            setError("You must be logged in and have generated content to save a project.");
            return;
        }
    
        let projectName = activeProject?.name;
        if (!projectName) {
            projectName = prompt("Enter a name for your project:", "My New Website");
            if (!projectName) return; // User cancelled
        }
    
        setIsLoading(true);
        try {
            const projectToSave = {
                id: activeProject?.id,
                user_id: user.id,
                name: projectName,
                code: generatedCode,
                messages: messages,
            };
            const saved = await saveProject(supabase, projectToSave);
            setActiveProject(saved);
            setHasUnsavedChanges(false);
            setMessages(prev => [...prev, { role: 'assistant', content: `Project "${saved.name}" has been saved successfully!`, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
        } catch (err: any) {
            setError(`Failed to save project: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLoadProject = (project: Project) => {
        setActiveProject(project);
        setGeneratedCode(project.code || '');
        setMessages(project.messages || []);
        // Reset history for the loaded project
        setCodeHistory(project.code ? [project.code] : []);
        setCurrentVersionIndex(project.code ? 0 : -1);
        setIsProjectsModalOpen(false);
        setActiveTab('preview');
        setHasUnsavedChanges(false);
    };

    const handleDownload = () => {
        if (!generatedCode) return;
        const blob = new Blob([generatedCode], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = 'index.html';
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const welcomeCode = `
<!DOCTYPE html>
<html lang="en" class="${document.documentElement.classList.contains('dark') ? 'dark' : ''}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome</title>
    <style>
        :root {
            --bg: #ffffff;
            --text: #18181b;
            --text-muted: #71717a;
            --border: #e4e4e7;
            --primary: #3b82f6;
        }
        html.dark {
            --bg: #18181b;
            --text: #e4e4e7;
            --text-muted: #a1a1aa;
            --border: #2727a;
            --primary: #60a5fa;
        }
        body {
            margin: 0;
            padding: 2rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            text-align: center;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
            background-color: var(--bg);
            color: var(--text);
            box-sizing: border-box;
        }
        .container {
            max-width: 42rem;
        }
        h1 {
            font-size: 2.25rem;
            font-weight: bold;
            margin-bottom: 0.5rem;
        }
        p {
            font-size: 1.125rem;
            color: var(--text-muted);
            line-height: 1.5;
        }
        .notice {
            margin-top: 2rem;
            padding: 1rem;
            border: 1px dashed var(--border);
            border-radius: 0.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.75rem;
        }
        .notice p {
            font-size: 0.875rem;
            color: var(--text-muted);
            margin: 0;
        }
        .notice svg {
            width: 1.25rem;
            height: 1.25rem;
            color: var(--primary);
            flex-shrink: 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Welcome to Got Idea!</h1>
        <p>Your personal AI website generator. Describe the website you envision in the panel on the left, and watch it come to life right here.</p>
        <div class="notice">
            ${!user ? `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
            <p>Please <b>Sign In</b> using the button in the header to save your projects.</p>
            ` : !activeApiKey ? `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
            <p>To get started, please add your API key in <b>Settings</b>.</p>
            ` : `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L9 9l-7 3 7 3 3 7 3-7 7-3-7-3-3-7z"/></svg>
            <p>You're all set! Ready to generate.</p>
            `}
        </div>
    </div>
</body>
</html>
`;
    
    return (
        <div className="flex-grow flex flex-col min-h-0">
            {error && (<div className="flex-shrink-0 flex items-start justify-between p-3 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 border-b border-red-200 dark:border-red-800 z-10">
                <p className="text-sm whitespace-pre-wrap pr-4">{error}</p>
                <button onClick={() => setError(null)} className="flex-shrink-0 pt-0.5"><XIcon className="w-5 h-5"/></button>
            </div>)}
            <div className="flex-grow flex min-h-0">
                <div className="w-full md:w-1/3 flex flex-col border-r border-[var(--gotidea-border)] bg-[var(--gotidea-bg-alt)]/80 relative">
                    <div className="flex-shrink-0 flex items-center justify-between p-2 border-b border-[var(--gotidea-border)] gap-2 flex-wrap">
                         <div className="flex items-center gap-2">
                            <Button onClick={() => hasUnsavedChanges ? setIsNewProjectConfirmOpen(true) : handleStartNewProject()} disabled={!user} className="flex items-center gap-2" title="Start a new project"><FilePlusIcon className="w-4 h-4" /> New</Button>
                            {user && <Button onClick={() => setIsProjectsModalOpen(true)} className="flex items-center gap-2" title="My Projects"><CaseIcon className="w-4 h-4" /> Projects</Button>}
                         </div>
                         <div className="flex-grow flex items-center justify-center font-semibold text-sm text-[var(--gotidea-text-muted)] truncate px-2" title={activeProject?.name || "Untitled Project"}>
                            <span>{activeProject?.name || "Untitled Project"}{hasUnsavedChanges ? '*' : ''}</span>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap justify-end">
                             {user && <Button onClick={handleSaveProject} disabled={!generatedCode || isLoading || !hasUnsavedChanges} className="flex items-center gap-2"><SaveIcon className="w-4 h-4" /> Save</Button>}
                            <Button onClick={() => setIsHistoryOpen(prev => !prev)} disabled={codeHistory.length === 0} className="flex items-center gap-2"><HistoryIcon className="w-4 h-4" /> ({codeHistory.length})</Button>
                            <Button onClick={handleDownload} disabled={!generatedCode}>Export</Button>
                            <Button onClick={() => setIsVercelModalOpen(true)} disabled={!generatedCode} title="Deploy to Vercel">Vercel</Button>
                            <Button onClick={() => setIsGitHubModalOpen(true)} disabled={!generatedCode} title="Deploy to GitHub" className="flex items-center gap-1.5"><GitHubIcon className="w-4 h-4" /> GitHub</Button>
                        </div>
                    </div>

                    {isHistoryOpen && <VersionHistoryPopover history={codeHistory} currentIndex={currentVersionIndex} onRevert={handleRevert} onClose={() => setIsHistoryOpen(false)} />}
                    
                    {!user && (
                        <div className="absolute inset-0 z-20 bg-black/30 backdrop-blur-sm flex flex-col items-center justify-center text-center p-4">
                            <div className="bg-[var(--gotidea-bg-alt)] p-8 rounded-lg shadow-lg border border-[var(--gotidea-border)]">
                                <UserIcon className="w-12 h-12 mx-auto text-[var(--gotidea-text-muted)] mb-4" />
                                <h3 className="font-bold text-lg">Sign In to Create</h3>
                                <p className="text-sm text-[var(--gotidea-text-muted)] mt-2">Please sign in to start building and saving your projects.</p>
                            </div>
                        </div>
                    )}


                    <div className="flex-grow flex flex-col min-h-0" >
                        <div className="p-4 flex-shrink-0 border-b border-[var(--gotidea-border)]">
                            <TemplateSelector 
                                onSelectTemplate={handleSendMessage} 
                                currentPrompt={messages.filter(m => m.role === 'user').slice(-1)[0]?.content || ''}
                            />
                        </div>
                        <ChatHistory messages={messages} isLoading={isLoading} onRevert={handleRevert} />
                        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
                    </div>
                </div>

                <div className="w-full md:w-2/3 flex flex-col relative bg-[var(--gotidea-bg)]/50">
                    {isLoading && !generatedCode && <LoadingOverlay />}
                    <div className="flex-shrink-0 flex p-2 border-b border-[var(--gotidea-border)] bg-[var(--gotidea-bg-alt)]/80 backdrop-blur-sm">
                        <Button onClick={() => { setActiveTab('preview'); }} className={`flex-1 !shadow-none rounded-md ${activeTab === 'preview' ? 'bg-[var(--gotidea-bg)]' : 'bg-transparent border-transparent'}`}>Preview</Button>
                        <Button onClick={() => { setActiveTab('editor'); setDevicePreview('desktop'); }} className={`flex-1 !shadow-none rounded-md ${activeTab === 'editor' ? 'bg-[var(--gotidea-bg)]' : 'bg-transparent border-transparent'}`}>Editor</Button>
                    </div>
                    
                    {activeTab === 'editor' ? (
                        <textarea 
                            value={generatedCode} 
                            onChange={(e) => { 
                                setGeneratedCode(e.target.value); 
                                setHasUnsavedChanges(true); 
                            }} 
                            placeholder="Generated code will appear here..." 
                            className="flex-grow w-full h-full p-4 bg-[#1e1e1e] text-gray-300 font-mono text-sm resize-none focus:outline-none" 
                            spellCheck="false" 
                        />
                    ) : (
                        <><ResponsiveToolbar activeDevice={devicePreview} onDeviceChange={setDevicePreview} /><div className="flex-grow w-full h-full p-4 flex items-center justify-center overflow-auto bg-[var(--gotidea-bg)]"><iframe key={currentVersionIndex} srcDoc={generatedCode || welcomeCode} title="Website Preview" className={`border-0 transition-all duration-300 ease-in-out shadow-[var(--gotidea-shadow-lg)] rounded-lg bg-white ${ devicePreview === 'desktop' ? 'w-full h-full' : devicePreview === 'tablet' ? 'w-[768px] h-[1024px] max-w-full max-h-full' : 'w-[375px] h-[667px] max-w-full max-h-full'}`} sandbox="allow-scripts allow-same-origin"/></div></>
                    )}
                </div>
            </div>
            <VercelDeployModal isOpen={isVercelModalOpen} onClose={() => setIsVercelModalOpen(false)} />
            <GitHubDeployModal isOpen={isGitHubModalOpen} onClose={() => setIsGitHubModalOpen(false)} code={generatedCode} />
            {isProjectsModalOpen && supabase && user &&
                <ProjectsModal 
                    isOpen={isProjectsModalOpen}
                    onClose={() => setIsProjectsModalOpen(false)}
                    supabase={supabase}
                    user={user}
                    onLoadProject={handleLoadProject}
                />
            }
            {isNewProjectConfirmOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-[var(--gotidea-bg-alt)] rounded-xl shadow-[var(--gotidea-shadow-lg)] w-full max-w-md p-6 border border-[var(--gotidea-border)]">
                        <h2 className="text-xl font-bold">Start a New Project?</h2>
                        <p className="text-[var(--gotidea-text-muted)] mt-2 mb-6">This will clear your current website code and chat history. Make sure you've saved your progress.</p>
                        <div className="flex justify-end gap-3">
                            <Button onClick={() => setIsNewProjectConfirmOpen(false)}>Cancel</Button>
                            <Button variant="primary" onClick={handleStartNewProject}>Yes, Start New</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Workspace;