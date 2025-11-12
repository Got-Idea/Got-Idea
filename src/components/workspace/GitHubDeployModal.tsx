import React, { FC, useState, useEffect } from 'react';
import Button from '../Button';
import { XIcon, GitHubIcon, ExternalLinkIcon, LogoIcon } from '../Icons';
import { useLocalStorage } from '../../hooks/useLocalStorage';

type GitHubDeployModalProps = { 
    isOpen: boolean; 
    onClose: () => void; 
    code: string;
};

const GitHubDeployModal: FC<GitHubDeployModalProps> = ({ isOpen, onClose, code }) => {
    const [token, setToken] = useLocalStorage('github-pat', '');
    const [repoName, setRepoName] = useState('');
    const [isPrivate, setIsPrivate] = useState(false);
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successUrl, setSuccessUrl] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            setError(null);
            setSuccessUrl(null);
            setRepoName('');
            setIsLoading(false);
        }
    }, [isOpen]);

    const handleDeploy = async () => {
        if (!token || !repoName) {
            setError('Please provide a GitHub Token and a repository name.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setSuccessUrl(null);

        try {
            // 1. Get user info to find owner
            const userResponse = await fetch('https://api.github.com/user', {
                headers: { 'Authorization': `token ${token}` }
            });

            if (!userResponse.ok) {
                if (userResponse.status === 401) throw new Error('Invalid GitHub token. Please check your token and permissions.');
                throw new Error(`Failed to fetch user data: ${userResponse.statusText}`);
            }
            const userData = await userResponse.json();
            const owner = userData.login;

            // 2. Create repository
            const repoResponse = await fetch('https://api.github.com/user/repos', {
                method: 'POST',
                headers: { 'Authorization': `token ${token}` },
                body: JSON.stringify({
                    name: repoName,
                    private: isPrivate,
                    description: 'Website generated with Got Idea',
                    auto_init: false,
                }),
            });

            if (!repoResponse.ok) {
                const errorData = await repoResponse.json();
                throw new Error(`Failed to create repository: ${errorData.message || repoResponse.statusText}`);
            }
            const repoData = await repoResponse.json();

            // 3. Create and commit the file
            const fileContent = btoa(unescape(encodeURIComponent(code))); // Base64 encode for UTF-8 support
            const commitResponse = await fetch(`https://api.github.com/repos/${owner}/${repoName}/contents/index.html`, {
                method: 'PUT',
                headers: { 'Authorization': `token ${token}` },
                body: JSON.stringify({
                    message: 'Initial commit from Got Idea',
                    content: fileContent,
                }),
            });

            if (!commitResponse.ok) {
                const errorData = await commitResponse.json();
                throw new Error(`Failed to commit file: ${errorData.message || commitResponse.statusText}`);
            }
            
            setSuccessUrl(repoData.html_url);

        } catch (err: any) {
            setError(err.message || 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="text-center py-8">
                    <LogoIcon className="w-12 h-12 mx-auto text-[var(--gotidea-primary)] animate-pulse" />
                    <p className="mt-4 font-semibold">Deploying to GitHub...</p>
                    <p className="text-sm text-[var(--gotidea-text-muted)]">This may take a moment.</p>
                </div>
            );
        }
        if (error) {
            return (
                <div className="text-center py-4">
                    <h3 className="font-bold text-lg text-red-500">Deployment Failed</h3>
                    <p className="mt-2 text-sm bg-red-500/10 p-3 rounded-md border border-red-500/20">{error}</p>
                    <Button onClick={() => { setError(null); setIsLoading(false); }} className="mt-4">Try Again</Button>
                </div>
            );
        }
        if (successUrl) {
            return (
                <div className="text-center py-4">
                    <h3 className="font-bold text-lg text-green-500">Deployment Successful!</h3>
                    <p className="mt-2 text-sm text-[var(--gotidea-text-muted)]">Your project is now live on GitHub.</p>
                    <a href={successUrl} target="_blank" rel="noopener noreferrer">
                        <Button variant="primary" className="mt-4 flex items-center gap-2 mx-auto">
                            View Repository <ExternalLinkIcon className="w-4 h-4" />
                        </Button>
                    </a>
                </div>
            );
        }
        return (
            <>
                <p className="text-[var(--gotidea-text-muted)] mb-6">
                    Deploy your website by creating a new repository directly on GitHub.
                </p>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-[var(--gotidea-text-muted)] mb-2">GitHub Personal Access Token</label>
                        <input type="password" value={token} onChange={(e) => setToken(e.target.value)} placeholder="ghp_..." className="w-full px-3 py-2 bg-[var(--gotidea-bg)] border border-[var(--gotidea-border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--gotidea-primary)]"/>
                        <p className="text-xs text-[var(--gotidea-text-muted)] mt-2">
                            Create a token with <code className="text-xs bg-[var(--gotidea-bg)] px-1 py-0.5 rounded">'repo'</code> scope. Your token is stored locally.
                            <a href="https://github.com/settings/tokens/new?scopes=repo&description=Got%20Idea%20Deployment" target="_blank" rel="noopener noreferrer" className="text-[var(--gotidea-primary)] hover:underline ml-1">Create one</a>.
                        </p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[var(--gotidea-text-muted)] mb-2">Repository Name</label>
                        <input type="text" value={repoName} onChange={(e) => setRepoName(e.target.value)} placeholder="my-awesome-website" className="w-full px-3 py-2 bg-[var(--gotidea-bg)] border border-[var(--gotidea-border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--gotidea-primary)]"/>
                    </div>
                     <div className="flex items-center gap-2">
                        <input type="checkbox" id="isPrivate" checked={isPrivate} onChange={(e) => setIsPrivate(e.target.checked)} className="h-4 w-4 rounded border-[var(--gotidea-border)] bg-[var(--gotidea-bg)] text-[var(--gotidea-primary)] focus:ring-[var(--gotidea-primary)]" />
                        <label htmlFor="isPrivate" className="text-sm font-medium text-[var(--gotidea-text-muted)]">Create as a private repository</label>
                    </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                    <Button onClick={onClose}>Cancel</Button>
                    <Button variant="primary" onClick={handleDeploy} disabled={!token || !repoName}>Deploy</Button>
                </div>
            </>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-[var(--gotidea-bg-alt)] rounded-xl shadow-[var(--gotidea-shadow-lg)] w-full max-w-lg p-6 border border-[var(--gotidea-border)]">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                        <GitHubIcon className="w-6 h-6" />
                        <h2 className="text-xl font-bold">Deploy to GitHub</h2>
                    </div>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-[var(--gotidea-bg)]">
                        <XIcon className="w-6 h-6 text-[var(--gotidea-text-muted)]"/>
                    </button>
                </div>
                {renderContent()}
            </div>
        </div>
    );
};

export default GitHubDeployModal;
