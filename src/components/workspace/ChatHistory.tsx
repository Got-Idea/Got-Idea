import React, { FC, useEffect, useRef } from 'react';
import { Message } from '../../types';
import { LogoIcon, HistoryIcon, UserIcon } from '../Icons';
import Button from '../Button';

type ChatHistoryProps = {
    messages: Message[];
    isLoading: boolean;
    onRevert: (index: number) => void;
};

const ChatHistory: FC<ChatHistoryProps> = ({ messages, isLoading, onRevert }) => {
    const endOfMessagesRef = useRef<null | HTMLDivElement>(null);

    useEffect(() => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    return (
        <div className="flex-grow p-4 space-y-6 overflow-y-auto">
            {messages.map((message, index) => (
                <div key={index} className={`flex items-start gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {message.role === 'assistant' && (
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--gotidea-bg-alt)] border border-[var(--gotidea-border)] flex items-center justify-center">
                            <LogoIcon className="w-5 h-5 text-[var(--gotidea-primary)]" />
                        </div>
                    )}
                    
                    <div className={`flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                        <div className={`max-w-md p-3 rounded-xl shadow-[var(--gotidea-shadow)] ${
                            message.role === 'user'
                                ? 'bg-[var(--gotidea-primary)] text-white rounded-br-none'
                                : 'bg-[var(--gotidea-bg-alt)] border border-[var(--gotidea-border)] rounded-bl-none'
                        }`}>
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                            {message.version && (
                                <div className="mt-2 pt-2 border-t border-black/10 dark:border-white/10">
                                    <Button onClick={() => onRevert(message.version! - 1)} className="!text-xs !py-1 !px-2 flex items-center gap-1.5">
                                        <HistoryIcon className="w-3.5 h-3.5" />
                                        Restore Version {message.version}
                                    </Button>
                                </div>
                            )}
                        </div>
                        <span className="text-xs text-[var(--gotidea-text-muted)] mt-1.5 px-1">{message.timestamp}</span>
                    </div>

                    {message.role === 'user' && (
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--gotidea-bg-alt)] border border-[var(--gotidea-border)] flex items-center justify-center">
                            <UserIcon className="w-5 h-5 text-[var(--gotidea-text-muted)]" />
                        </div>
                    )}
                </div>
            ))}
            {isLoading && (
                 <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--gotidea-bg-alt)] border border-[var(--gotidea-border)] flex items-center justify-center">
                        <LogoIcon className="w-5 h-5 text-[var(--gotidea-primary)]" />
                    </div>
                    <div className="flex flex-col items-start">
                        <div className="max-w-md p-3 rounded-xl bg-[var(--gotidea-bg-alt)] border border-[var(--gotidea-border)] rounded-bl-none">
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-[var(--gotidea-text-muted)] animate-pulse"></span>
                                <span className="w-2 h-2 rounded-full bg-[var(--gotidea-text-muted)] animate-pulse" style={{ animationDelay: '0.2s' }}></span>
                                <span className="w-2 h-2 rounded-full bg-[var(--gotidea-text-muted)] animate-pulse" style={{ animationDelay: '0.4s' }}></span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div ref={endOfMessagesRef} />
        </div>
    );
};

export default ChatHistory;