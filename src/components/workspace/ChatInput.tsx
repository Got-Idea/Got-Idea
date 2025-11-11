import React, { useState, FC } from 'react';
import { ArrowRightIcon, SparklesIcon, MicIcon, PaperclipIcon } from '../Icons';

type ChatInputProps = {
    onSendMessage: (message: string) => void;
    isLoading: boolean;
};

const ChatInput: FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
    const [message, setMessage] = useState('');

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(e.target.value);
        // Auto-resize textarea
        e.target.style.height = 'auto';
        e.target.style.height = `${e.target.scrollHeight}px`;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim() && !isLoading) {
            onSendMessage(message);
            setMessage('');
            const textarea = e.currentTarget.querySelector('textarea');
            if(textarea) textarea.style.height = 'auto';
        }
    };

    return (
        <div className="flex-shrink-0 p-3 border-t border-[var(--gotidea-border)] bg-[var(--gotidea-bg-alt)]">
            <form onSubmit={handleSubmit}>
                <div className="flex items-end gap-2 p-2 border border-[var(--gotidea-border)] rounded-xl bg-[var(--gotidea-bg)] focus-within:ring-2 focus-within:ring-[var(--gotidea-primary)] transition-shadow duration-200">
                    <textarea
                        value={message}
                        onChange={handleTextChange}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSubmit(e as any);
                            }
                        }}
                        placeholder="Make changes, add new features, ask for anything"
                        className="w-full pl-1 text-sm bg-transparent resize-none focus:outline-none transition-all duration-200"
                        rows={1}
                        disabled={isLoading}
                        style={{ maxHeight: '10rem', overflowY: 'auto' }}
                    />
                    <div className="flex items-center gap-1 flex-shrink-0">
                        <button type="button" disabled className="p-2 rounded-lg hover:bg-[var(--gotidea-bg-alt)] disabled:opacity-40 disabled:cursor-not-allowed" title="Suggestions (Coming Soon)">
                            <SparklesIcon className="w-5 h-5 text-[var(--gotidea-text-muted)]"/>
                        </button>
                         <button type="button" disabled className="p-2 rounded-lg hover:bg-[var(--gotidea-bg-alt)] disabled:opacity-40 disabled:cursor-not-allowed" title="Voice Input (Coming Soon)">
                            <MicIcon className="w-5 h-5 text-[var(--gotidea-text-muted)]"/>
                        </button>
                         <button type="button" disabled className="p-2 rounded-lg hover:bg-[var(--gotidea-bg-alt)] disabled:opacity-40 disabled:cursor-not-allowed" title="Attach Files (Coming Soon)">
                            <PaperclipIcon className="w-5 h-5 text-[var(--gotidea-text-muted)]"/>
                        </button>
                        <button 
                            type="submit" 
                            disabled={isLoading || !message.trim()} 
                            className="p-2 rounded-lg transition-colors bg-[var(--gotidea-primary)] text-white disabled:bg-gray-400 disabled:dark:bg-gray-600 hover:bg-[var(--gotidea-primary-hover)] disabled:hover:bg-gray-400"
                            aria-label="Send message"
                        >
                            <ArrowRightIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ChatInput;