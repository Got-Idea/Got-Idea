export type AiProvider = 'gemini' | 'anthropic';
export type Page = 'landing' | 'workspace' | 'docs' | 'settings' | 'about';
export type Message = {
    role: 'user' | 'assistant';
    content: string;
    version?: number;
    timestamp: string;
};

export type Project = {
    id: string;
    name: string;
    code: string;
    messages: Message[];
    updated_at: string;
};