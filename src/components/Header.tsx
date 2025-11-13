import React, { FC, useState } from 'react';
import { LogoIcon, MoonIcon, SettingsIcon, SunIcon, LogInIcon, LogOutIcon, ChevronDownIcon } from './Icons';
import { Page } from '../../types';
import Button from './Button';
import { User } from '@supabase/supabase-js';

type HeaderProps = {
    activePage: Page;
    handleNavigation: (page: Page) => void;
    toggleTheme: () => void;
    theme: 'light' | 'dark';
    user: User | null;
    onSignIn: () => void;
    onSignOut: () => void;
};

const UserMenu: FC<{ user: User; onSignOut: () => void }> = ({ user, onSignOut }) => {
    const [isOpen, setIsOpen] = useState(false);
    const userEmail = user.email || 'No email';
    const avatarUrl = user.user_metadata?.avatar_url;

    return (
        <div className="relative">
            <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2 p-1 rounded-full hover:bg-[var(--gotidea-bg)]">
                <img src={avatarUrl} alt="User avatar" className="w-7 h-7 rounded-full border-2 border-[var(--gotidea-border)]" />
                <ChevronDownIcon className={`w-4 h-4 text-[var(--gotidea-text-muted)] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div 
                    className="absolute right-0 mt-2 w-48 bg-[var(--gotidea-bg-alt)] rounded-md shadow-lg border border-[var(--gotidea-border)] z-20"
                    onMouseLeave={() => setIsOpen(false)}
                >
                    <div className="p-2 border-b border-[var(--gotidea-border)]">
                        <p className="text-sm font-semibold truncate">{user.user_metadata?.full_name || user.user_metadata?.user_name}</p>
                        <p className="text-xs text-[var(--gotidea-text-muted)] truncate">{userEmail}</p>
                    </div>
                    <div className="p-1">
                        <button onClick={onSignOut} className="w-full text-left flex items-center gap-2 px-2 py-1.5 text-sm rounded hover:bg-[var(--gotidea-bg)]">
                            <LogOutIcon className="w-4 h-4"/>
                            Sign Out
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};


const Header: FC<HeaderProps> = ({ activePage, handleNavigation, toggleTheme, theme, user, onSignIn, onSignOut }) => {
    
    const NavButton: FC<{page: Page; children: React.ReactNode; isPageActive: boolean;}> = ({ page, children, isPageActive }) => (
      <button 
        onClick={() => handleNavigation(page)}
        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isPageActive ? 'bg-[var(--gotidea-bg)] text-[var(--gotidea-primary)]' : 'text-[var(--gotidea-text-muted)] hover:bg-[var(--gotidea-bg)] hover:text-[var(--gotidea-text)]'}`}
        >{children}
    </button>
  );

    return (
        <header className="flex-shrink-0 flex items-center justify-between p-3 border-b border-[var(--gotidea-border)] bg-[var(--gotidea-bg-alt)]/80 backdrop-blur-sm shadow-[var(--gotidea-shadow)] z-10">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNavigation('landing')}>
                <LogoIcon className="w-7 h-7 text-[var(--gotidea-primary)]" />
                <h1 className="text-xl font-bold">Got Idea</h1>
            </div>
            <nav className="hidden md:flex items-center gap-2">
                <NavButton page="workspace" isPageActive={activePage === 'workspace'}>Workspace</NavButton>
                <NavButton page="docs" isPageActive={activePage === 'docs'}>Docs</NavButton>
                <NavButton page="about" isPageActive={activePage === 'about'}>About</NavButton>
            </nav>
            <div className="flex items-center gap-2">
                {user ? (
                    <UserMenu user={user} onSignOut={onSignOut} />
                ) : (
                    <Button onClick={onSignIn} className="flex items-center gap-2">
                        <LogInIcon className="w-4 h-4"/>
                        Sign In
                    </Button>
                )}
                
                <button onClick={() => handleNavigation('settings')} className="p-2 rounded-full hover:bg-[var(--gotidea-bg)]" title="Settings">
                    <SettingsIcon className="w-5 h-5 text-[var(--gotidea-text-muted)] hover:text-[var(--gotidea-text)]"/>
                </button>
                <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-[var(--gotidea-bg)]" title="Toggle Theme">
                    {theme === 'light' ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
                </button>
            </div>
        </header>
    );
};

export default Header;
