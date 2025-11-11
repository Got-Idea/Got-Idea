import React, { FC } from 'react';
import { SparklesIcon, KeyIcon, CodeIcon, RocketIcon, ClipboardIcon } from '../Icons';

const DocsPage: FC = () => {
    const cardClass = "bg-[var(--gotidea-bg-alt)] p-6 rounded-xl border border-[var(--gotidea-border)] shadow-[var(--gotidea-shadow)] transition-all duration-300 hover:shadow-[var(--gotidea-shadow-lg)] hover:-translate-y-1";
    const iconClass = "w-8 h-8 text-[var(--gotidea-primary)] mb-4";
    const titleClass = "text-lg font-bold text-[var(--gotidea-text)] mb-2";
    const descriptionClass = "text-sm text-[var(--gotidea-text-muted)]";
    const stepClass = "flex items-start gap-4";
    const stepNumberClass = "flex-shrink-0 w-8 h-8 flex items-center justify-center bg-[var(--gotidea-primary)]/10 text-[var(--gotidea-primary)] font-bold rounded-full border-2 border-[var(--gotidea-primary)]/20";

    return (
        <div className="flex-grow p-6 md:p-10 lg:p-12 overflow-y-auto">
            <div className="max-w-4xl mx-auto">
                <header className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-[var(--gotidea-text)]">Documentation</h1>
                    <p className="mt-4 text-lg text-[var(--gotidea-text-muted)]">Learn how to build amazing websites with Got Idea</p>
                </header>

                <section className="grid md:grid-cols-2 gap-6 mb-16">
                    <div className={cardClass}>
                        <SparklesIcon className={iconClass} />
                        <h2 className={titleClass}>Getting Started</h2>
                        <p className={descriptionClass}>Quick introduction to Got Idea and how to create your first project.</p>
                    </div>
                    <div className={cardClass}>
                        <KeyIcon className={iconClass} />
                        <h2 className={titleClass}>API Keys Setup</h2>
                        <p className={descriptionClass}>Learn how to connect your AI provider API keys securely.</p>
                    </div>
                    <div className={cardClass}>
                        <CodeIcon className={iconClass} />
                        <h2 className={titleClass}>Using the Editor</h2>
                        <p className={descriptionClass}>Master the workspace and learn advanced editing techniques.</p>
                    </div>
                    <div className={cardClass}>
                        <RocketIcon className={iconClass} />
                        <h2 className={titleClass}>Deployment</h2>
                        <p className={descriptionClass}>Deploy your projects to production with one click.</p>
                    </div>
                </section>

                <section>
                    <div className="flex items-center gap-3 mb-8">
                        <ClipboardIcon className="w-7 h-7 text-[var(--gotidea-text-muted)]"/>
                        <h2 className="text-3xl font-bold">Quick Start Guide</h2>
                    </div>
                    <div className="space-y-8">
                        <div className={stepClass}>
                            <div className={stepNumberClass}>1</div>
                            <div>
                                <h3 className={titleClass}>Provide your API Key</h3>
                                <p className={descriptionClass}>Navigate to Settings and add your API keys from Google Gemini. Your keys are stored locally and securely in your browser's local storage.</p>
                            </div>
                        </div>
                         <div className={stepClass}>
                            <div className={stepNumberClass}>2</div>
                            <div>
                                <h3 className={titleClass}>Start Building</h3>
                                <p className={descriptionClass}>Go to the Workspace and describe what you want to build in the chat. Our AI will generate production-ready code that you can customize.</p>
                            </div>
                        </div>
                         <div className={stepClass}>
                            <div className={stepNumberClass}>3</div>
                            <div>
                                <h3 className={titleClass}>Iterate and Refine</h3>
                                <p className={descriptionClass}>Ask for changes conversationally. For example, "Change the theme to dark mode" or "Add a contact form." The AI will modify the existing code.</p>
                            </div>
                        </div>
                         <div className={stepClass}>
                            <div className={stepNumberClass}>4</div>
                            <div>
                                <h3 className={titleClass}>Deploy</h3>
                                <p className={descriptionClass}>When you're ready, export the HTML file and deploy it to Vercel, Netlify, or any static hosting platform.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default DocsPage;
