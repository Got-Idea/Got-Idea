import { createClient, SupabaseClient, Session, User } from '@supabase/supabase-js';
import { Project, Message } from '../types';

let supabaseClient: SupabaseClient | null = null;

export function getSupabaseClient(url: string, key: string): SupabaseClient {
    if (supabaseClient) {
        return supabaseClient;
    }
    supabaseClient = createClient(url, key);
    return supabaseClient;
}

/*
IMPORTANT: Set up Row Level Security (RLS) policies in your Supabase project.
Go to SQL Editor and run the following commands:

-- 1. Create 'projects' table
CREATE TABLE projects (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  user_id uuid NOT NULL,
  name character varying DEFAULT 'Untitled Project'::character varying NOT NULL,
  code text,
  messages jsonb,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT projects_pkey PRIMARY KEY (id),
  CONSTRAINT projects_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE
);

-- 2. Enable RLS on the 'projects' table
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Allow users to see their own projects
CREATE POLICY "Allow users to see their own projects"
ON public.projects FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- 4. Policy: Allow users to insert their own projects
CREATE POLICY "Allow users to insert their own projects"
ON public.projects FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- 5. Policy: Allow users to update their own projects
CREATE POLICY "Allow users to update their own projects"
ON public.projects FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- 6. Policy: Allow users to delete their own projects
CREATE POLICY "Allow users to delete their own projects"
ON public.projects FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

*/

export const signInWithGithub = async (supabase: SupabaseClient) => {
    const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
    });
    if (error) {
        console.error('Error signing in with GitHub:', error);
        throw error;
    }
};

export const signInWithGoogle = async (supabase: SupabaseClient) => {
    const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
    });
    if (error) {
        console.error('Error signing in with Google:', error);
        throw error;
    }
};

export const signOut = async (supabase: SupabaseClient) => {
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error('Error signing out:', error);
        throw error;
    }
};

export const getProjects = async (supabase: SupabaseClient, userId: string): Promise<Project[]> => {
    const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

    if (error) {
        console.error('Error fetching projects:', error);
        throw error;
    }
    return data as Project[];
};

export const saveProject = async (
    supabase: SupabaseClient,
    project: {
        id?: string;
        user_id: string;
        name: string;
        code: string;
        messages: Message[];
    }
): Promise<Project> => {
    const projectData = {
        user_id: project.user_id,
        name: project.name,
        code: project.code,
        messages: project.messages,
        updated_at: new Date().toISOString(),
    };

    if (project.id) {
        // Update existing project
        const { data, error } = await supabase
            .from('projects')
            .update(projectData)
            .eq('id', project.id)
            .select()
            .single();

        if (error) throw error;
        return data as Project;
    } else {
        // Create new project
        const { data, error } = await supabase
            .from('projects')
            .insert(projectData)
            .select()
            .single();
        
        if (error) throw error;
        return data as Project;
    }
};

export const deleteProject = async (supabase: SupabaseClient, projectId: string): Promise<void> => {
    const { error } = await supabase.from('projects').delete().eq('id', projectId);
    if (error) {
        console.error('Error deleting project:', error);
        throw error;
    }
}
