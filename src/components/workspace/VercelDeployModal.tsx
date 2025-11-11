import React, { FC } from 'react';
import Button from '../Button';
import { XIcon, VercelIcon } from '../Icons';

type VercelDeployModalProps = { 
    isOpen: boolean; 
    onClose: () => void; 
};

const VercelDeployModal: FC<VercelDeployModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
    
    const codeBlockClass = "p-3 bg-[var(--gotidea-bg)] rounded-md font-mono text-sm text-[var(--gotidea-text-muted)] relative";
    const stepClass = "font-semibold text-[var(--gotidea-text)] mb-1";
    const copyToClipboard = (text: string) => { navigator.clipboard.writeText(text); };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-[var(--gotidea-bg-alt)] rounded-xl shadow-[var(--gotidea-shadow-lg)] w-full max-w-2xl p-6 border border-[var(--gotidea-border)]">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                        <VercelIcon className="w-6 h-6" />
                        <h2 className="text-xl font-bold">Deploy to Vercel</h2>
                    </div>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-[var(--gotidea-bg)]">
                        <XIcon className="w-6 h-6 text-[var(--gotidea-text-muted)]"/>
                    </button>
                </div>
                <p className="text-[var(--gotidea-text-muted)] mb-6">You can deploy your generated website to Vercel for free in a few simple steps. First, make sure you have downloaded the `index.html` file using the "Export" button.</p>
                <div className="space-y-4">
                    <div>
                        <h3 className={stepClass}>Step 1: Install Vercel CLI</h3>
                        <p className="text-sm text-[var(--gotidea-text-muted)] mb-2">If you don't have it, open your terminal and run this command:</p>
                        <div className={codeBlockClass}>
                            <code>npm i -g vercel</code>
                            <button onClick={() => copyToClipboard('npm i -g vercel')} className="absolute top-2 right-2 text-xs p-1 rounded hover:bg-[var(--gotidea-bg-alt)]">Copy</button>
                        </div>
                    </div>
                    <div>
                        <h3 className={stepClass}>Step 2: Deploy</h3>
                        <p className="text-sm text-[var(--gotidea-text-muted)] mb-2">Navigate to the folder containing your `index.html` file in your terminal and run:</p>
                        <div className={codeBlockClass}>
                            <code>vercel</code>
                            <button onClick={() => copyToClipboard('vercel')} className="absolute top-2 right-2 text-xs p-1 rounded hover:bg-[var(--gotidea-bg-alt)]">Copy</button>
                        </div>
                    </div>
                </div>
                <div className="mt-6 text-center"><Button variant="primary" onClick={onClose}>Got it!</Button></div>
            </div>
        </div>
    );
};

export default VercelDeployModal;
