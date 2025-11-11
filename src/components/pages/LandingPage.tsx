import React, { FC } from 'react';
import Button from '../Button';
import { LogoIcon, CodeIcon, RocketIcon, ArrowRightIcon } from '../Icons';
import { Page } from '../../types';

type LandingPageProps = {
    onNavigate: (page: Page) => void;
};

const LandingPage: FC<LandingPageProps> = ({ onNavigate }) => {
    return (
        <div className="flex-grow flex items-center justify-center p-4 lg:p-8 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden -z-10">
                <div className="absolute top-1/2 left-1/2 w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] bg-purple-500/10 rounded-full -translate-x-1/4 -translate-y-1/2 blur-3xl animate-[spin_20s_linear_infinite_reverse]"></div>
                <div className="absolute top-1/2 left-1/2 w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] bg-blue-500/10 rounded-full translate-x-1/4 -translate-y-1/2 blur-3xl animate-[spin_20s_linear_infinite]"></div>
                <pre className="absolute top-10 left-10 text-[var(--gotidea-text-muted)]/10 text-xs select-none">{'<div className="hero">\n  <h1>Got Idea</h1>\n</div>'}</pre>
                <pre className="absolute bottom-10 right-10 text-[var(--gotidea-text-muted)]/10 text-xs select-none">{'const App = () => (\n  <main>...</main>\n);'}</pre>
            </div>

            <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                {/* Left Content */}
                <div className="text-center lg:text-left">
                    <div className="inline-flex items-center gap-2 bg-[var(--gotidea-bg-alt)] border border-[var(--gotidea-border)] px-3 py-1 rounded-full text-sm font-medium mb-4">
                        <LogoIcon className="w-4 h-4 text-[var(--gotidea-primary)]" />
                        AI-Powered Development
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
                        Your Idea. <br />
                        <span className="text-[var(--gotidea-primary)]">Your API.</span> Your Creation.
                    </h1>
                    <p className="mt-6 text-lg text-[var(--gotidea-text-muted)] max-w-lg mx-auto lg:mx-0">
                        Build stunning websites instantly with AI. Connect your own API keys and experience the power of AI-driven development without limits.
                    </p>
                    <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                        <Button variant="primary" className="!px-6 !py-3" onClick={() => onNavigate('workspace')}>
                            <span className="flex items-center gap-2">Start Building <ArrowRightIcon className="w-5 h-5"/></span>
                        </Button>
                        <Button variant="secondary" className="!px-6 !py-3" onClick={() => onNavigate('docs')}>View Docs</Button>
                    </div>
                     <div className="mt-8 flex items-center justify-center lg:justify-start gap-6 text-sm text-[var(--gotidea-text-muted)]">
                        <span className="flex items-center gap-2"><CodeIcon className="w-4 h-4"/>Live Code Editor</span>
                        <span className="flex items-center gap-2"><RocketIcon className="w-4 h-4"/>Instant Deploy</span>
                    </div>
                </div>
                {/* Right Content - Image */}
                <div className="relative">
                    <div className="aspect-w-4 aspect-h-3 rounded-2xl bg-[var(--gotidea-bg-alt)] border border-[var(--gotidea-border)] shadow-[var(--gotidea-shadow-lg)] p-4">
                        <img src="https://placehold.co/1000x750/18181b/60a5fa?text=Your+Creation" alt="AI Generated Website Preview" className="w-full h-full object-cover rounded-lg" />
                    </div>
                    <button className="absolute -top-4 -right-4 bg-[var(--gotidea-bg-alt)] border border-[var(--gotidea-border)] p-3 rounded-full shadow-[var(--gotidea-shadow-lg)]">
                        <LogoIcon className="w-6 h-6 text-[var(--gotidea-primary)]" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
