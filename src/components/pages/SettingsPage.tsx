import React, { FC, useState } from 'react';
import Button from '../Button';
import { GeminiIcon, CubeIcon, DatabaseIcon } from '../Icons';
import { AiProvider } from '../../types';

type ProviderTab = AiProvider;

const TABS: { id: ProviderTab; name: string; Icon: FC<{ className?: string }> }[] = [
    { id: 'gemini', name: 'Gemini', Icon: GeminiIcon },
    { id: 'anthropic', name: 'Anthropic', Icon: CubeIcon },
];

type SettingsPageProps = { 
    onSave: (config: { 
        provider: AiProvider; 
        geminiKey: string; 
        anthropicKey: string;
        userSupabaseUrl: string;
        userSupabaseAnonKey: string;
    }) => void; 
    onClose: () => void;
    currentProvider: AiProvider;
    currentGeminiKey: string | null;
    currentAnthropicKey: string | null;
    currentUserSupabaseUrl: string | null;
    currentUserSupabaseAnonKey: string | null;
};

const SettingsPage: FC<SettingsPageProps> = ({ 
    onSave, onClose, currentProvider, currentGeminiKey, currentAnthropicKey,
    currentUserSupabaseUrl, currentUserSupabaseAnonKey
}) => {
    const [activeTab, setActiveTab] = useState<ProviderTab>(currentProvider);
    const [geminiKey, setGeminiKey] = useState(currentGeminiKey || '');
    const [anthropicKey, setAnthropicKey] = useState(currentAnthropicKey || '');
    const [userSupabaseUrl, setUserSupabaseUrl] = useState(currentUserSupabaseUrl || '');
    const [userSupabaseAnonKey, setUserSupabaseAnonKey] = useState(currentUserSupabaseAnonKey || '');


    const handleSave = () => { 
        onSave({ 
            provider: currentProvider, // Don't change provider based on tab
            geminiKey, 
            anthropicKey,
            userSupabaseUrl,
            userSupabaseAnonKey
        }); 
        onClose(); 
    };

    return (
        <div className="flex-grow flex items-center justify-center p-4">
            <div className="bg-[var(--gotidea-bg-alt)] rounded-xl shadow-[var(--gotidea-shadow-lg)] w-full max-w-lg p-6 border border-[var(--gotidea-border)]">
                <h2 className="text-xl font-bold mb-4">Settings</h2>
                
                <h3 className="text-base font-semibold mb-2">AI Provider Keys</h3>
                <div className="border-b border-[var(--gotidea-border)] mb-4">
                    <nav className="-mb-px flex space-x-4" aria-label="Tabs">
                        {TABS.map((tab) => (
                            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                                className={`whitespace-nowrap flex items-center gap-2 py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                                    activeTab === tab.id
                                    ? 'border-[var(--gotidea-primary)] text-[var(--gotidea-primary)]'
                                    : 'border-transparent text-[var(--gotidea-text-muted)] hover:text-[var(--gotidea-text)] hover:border-gray-300'
                                }`}>
                                <tab.Icon className="w-5 h-5" />{tab.name}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="mt-4 min-h-[100px]">
                    {activeTab === 'gemini' && (
                        <div>
                            <label className="block text-sm font-medium text-[var(--gotidea-text-muted)] mb-2">Gemini API Key</label>
                            <input type="password" value={geminiKey} onChange={(e) => setGeminiKey(e.target.value)} placeholder="Enter your Google AI Studio API key" className="w-full px-3 py-2 bg-[var(--gotidea-bg)] border border-[var(--gotidea-border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--gotidea-primary)]"/>
                            <p className="text-xs text-[var(--gotidea-text-muted)] mt-2">Get your key from <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-[var(--gotidea-primary)] hover:underline">Google AI Studio</a>.</p>
                        </div>
                    )}
                    {activeTab === 'anthropic' && (
                        <div>
                            <label className="block text-sm font-medium text-[var(--gotidea-text-muted)] mb-2">Anthropic API Key</label>
                            <input type="password" value={anthropicKey} onChange={(e) => setAnthropicKey(e.target.value)} placeholder="Enter your Anthropic API key" className="w-full px-3 py-2 bg-[var(--gotidea-bg)] border border-[var(--gotidea-border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--gotidea-primary)]"/>
                             <div className="mt-2 p-3 text-sm bg-yellow-500/10 text-yellow-200 border border-yellow-500/20 rounded-md">Anthropic Claude support is coming soon!</div>
                        </div>
                    )}
                </div>

                <div className="mt-6 pt-4 border-t border-[var(--gotidea-border)]">
                    <h3 className="text-base font-semibold mb-2 flex items-center gap-2 text-[var(--gotidea-text)]">
                        <DatabaseIcon className="w-5 h-5" />
                        Generated App Backend (Optional)
                    </h3>
                    <p className="text-sm text-[var(--gotidea-text-muted)] mb-4">
                        If your app idea needs a database, provide your Supabase credentials here. They will be injected into the generated code.
                    </p>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-[var(--gotidea-text-muted)] mb-2">Supabase URL</label>
                            <input type="text" value={userSupabaseUrl} onChange={(e) => setUserSupabaseUrl(e.target.value)} placeholder="https://<project-ref>.supabase.co" className="w-full px-3 py-2 bg-[var(--gotidea-bg)] border border-[var(--gotidea-border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--gotidea-primary)]"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[var(--gotidea-text-muted)] mb-2">Supabase Anon Key</label>
                            <input type="password" value={userSupabaseAnonKey} onChange={(e) => setUserSupabaseAnonKey(e.target.value)} placeholder="Enter your Supabase anonymous key" className="w-full px-3 py-2 bg-[var(--gotidea-bg)] border border-[var(--gotidea-border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--gotidea-primary)]"/>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-8"><Button onClick={onClose}>Cancel</Button><Button variant="primary" onClick={handleSave}>Save & Close</Button></div>
            </div>
        </div>
    );
};

export default SettingsPage;