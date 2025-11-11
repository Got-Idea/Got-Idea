import React, { FC } from 'react';
import Button from './Button';
import { XIcon, GitHubIcon, GoogleIcon } from './Icons';

type SignInModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSignInWithGitHub: () => void;
    onSignInWithGoogle: () => void;
};

const SignInModal: FC<SignInModalProps> = ({ isOpen, onClose, onSignInWithGitHub, onSignInWithGoogle }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-[var(--gotidea-bg-alt)] rounded-xl shadow-[var(--gotidea-shadow-lg)] w-full max-w-sm p-6 border border-[var(--gotidea-border)]">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Sign In / Sign Up</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-[var(--gotidea-bg)]">
                        <XIcon className="w-6 h-6 text-[var(--gotidea-text-muted)]"/>
                    </button>
                </div>
                <p className="text-[var(--gotidea-text-muted)] mb-6 text-center">
                    Sign in to save your projects and access them from anywhere.
                </p>
                <div className="flex flex-col gap-4">
                    <Button onClick={onSignInWithGitHub} className="!w-full !py-3 flex items-center justify-center gap-3">
                        <GitHubIcon className="w-5 h-5" />
                        Continue with GitHub
                    </Button>
                    <Button onClick={onSignInWithGoogle} className="!w-full !py-3 flex items-center justify-center gap-3">
                        <GoogleIcon className="w-5 h-5" />
                        Continue with Google
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default SignInModal;
