import React, { useState, useEffect } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { AiProvider, Page } from './types';
import Header from './components/Header';
import LandingPage from './components/pages/LandingPage';
import Workspace from './components/pages/Workspace';
import DocsPage from './components/pages/DocsPage';
import SettingsPage from './components/pages/SettingsPage';
import AboutPage from './components/pages/AboutPage';
import { SupabaseClient, Session } from '@supabase/supabase-js';
import { getSupabaseClient, signInWithGithub, signInWithGoogle, signOut } from './services/supabaseService';
import SignInModal from './components/SignInModal';

export default function App() {
  // API Keys & Provider Config
  const [provider, setProvider] = useLocalStorage<AiProvider>('gotidea-provider', 'gemini');
  const [geminiApiKey, setGeminiApiKey] = useLocalStorage<string | null>('gotidea-gemini-apikey', null);
  const [anthropicApiKey, setAnthropicApiKey] = useLocalStorage<string | null>('gotidea-anthropic-apikey', null);
  const activeApiKey = provider === 'gemini' ? geminiApiKey : anthropicApiKey;
  
  // Supabase Config for "Got Idea" App (project saving, auth)
  const supabaseUrl = 'https://aqlxrasequxshncrlfer.supabase.co';
  const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxbHhyYXNlcXV4c2huY3JsZmVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE3NjA5MjMsImV4cCI6MjA3NzMzNjkyM30.wJZfTjfaFD-9H5CffEo5UQnur4cXDGNzQLUE8lK11f8';
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  // User's Supabase Config (for generated apps)
  const [userSupabaseUrl, setUserSupabaseUrl] = useLocalStorage<string | null>('gotidea-user-supabase-url', null);
  const [userSupabaseAnonKey, setUserSupabaseAnonKey] = useLocalStorage<string | null>('gotidea-user-supabase-key', null);

  // UI State
  const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('gotidea-theme', 'dark');
  const [activePage, setActivePage] = useState<Page>('landing');
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);

  // Initialize Supabase client and handle auth
  useEffect(() => {
    if (supabaseUrl && supabaseAnonKey) {
      const client = getSupabaseClient(supabaseUrl, supabaseAnonKey);
      setSupabase(client);

      client.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
      });

      const { data: { subscription } } = client.auth.onAuthStateChange((_event, session) => {
        setSession(session);
      });

      return () => subscription.unsubscribe();
    }
  }, [supabaseUrl, supabaseAnonKey]);


  useEffect(() => { document.documentElement.classList.toggle('dark', theme === 'dark'); }, [theme]);
  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  const handleSaveSettings = (config: { 
    provider: AiProvider; 
    geminiKey: string; 
    anthropicKey:string;
    userSupabaseUrl: string;
    userSupabaseAnonKey: string;
  }) => {
    setProvider(config.provider);
    setGeminiApiKey(config.geminiKey || null);
    setAnthropicApiKey(config.anthropicKey || null);
    setUserSupabaseUrl(config.userSupabaseUrl || null);
    setUserSupabaseAnonKey(config.userSupabaseAnonKey || null);
  };

  const handleNavigation = (page: Page) => {
      if (page === 'workspace' && !activeApiKey) {
          setActivePage('settings');
      } else {
          setActivePage(page);
      }
  }
  
  const openSignInModal = () => {
    if (!supabase) {
        alert("Supabase is not configured for this project.");
        return;
    }
    setIsSignInModalOpen(true);
  };

  const handleSignInWithGithub = () => {
    if (supabase) {
      signInWithGithub(supabase);
      setIsSignInModalOpen(false);
    }
  };

  const handleSignInWithGoogle = () => {
    if (supabase) {
      signInWithGoogle(supabase);
      setIsSignInModalOpen(false);
    }
  };

  const handleSignOut = () => {
    if (supabase) {
        signOut(supabase);
    }
  };


  const renderContent = () => {
    switch(activePage) {
        case 'landing':
            return <LandingPage onNavigate={handleNavigation} />;
        case 'workspace':
            return <Workspace 
                provider={provider} 
                activeApiKey={activeApiKey} 
                supabase={supabase} 
                user={session?.user ?? null}
                userSupabaseUrl={userSupabaseUrl}
                userSupabaseAnonKey={userSupabaseAnonKey}
            />;
        case 'docs':
            return <DocsPage />;
        case 'about':
            return <AboutPage />;
        case 'settings':
            return <SettingsPage 
                onSave={handleSaveSettings} 
                onClose={() => setActivePage(activeApiKey ? 'workspace' : 'landing')}
                currentProvider={provider}
                currentGeminiKey={geminiApiKey}
                currentAnthropicKey={anthropicApiKey}
                currentUserSupabaseUrl={userSupabaseUrl}
                currentUserSupabaseAnonKey={userSupabaseAnonKey}
            />;
        default:
            return <LandingPage onNavigate={handleNavigation} />;
    }
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-[var(--gotidea-bg)] text-[var(--gotidea-text)] overflow-hidden">
      <Header 
        activePage={activePage}
        handleNavigation={handleNavigation}
        theme={theme}
        toggleTheme={toggleTheme}
        user={session?.user ?? null}
        onSignIn={openSignInModal}
        onSignOut={handleSignOut}
      />
      <main className="flex-grow flex flex-col min-h-0 z-0">
        {renderContent()}
      </main>
      <SignInModal
        isOpen={isSignInModalOpen}
        onClose={() => setIsSignInModalOpen(false)}
        onSignInWithGitHub={handleSignInWithGithub}
        onSignInWithGoogle={handleSignInWithGoogle}
      />
    </div>
  );
}