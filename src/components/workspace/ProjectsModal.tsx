import React, { FC, useEffect, useState } from 'react';
import Button from '../Button';
import { XIcon, FilePlusIcon, LogoIcon } from '../Icons';
import { Project } from '../../types';
import { SupabaseClient, User } from '@supabase/supabase-js';
import { getProjects, deleteProject } from '../../services/supabaseService';

type ProjectsModalProps = {
    isOpen: boolean;
    onClose: () => void;
    supabase: SupabaseClient;
    user: User;
    onLoadProject: (project: Project) => void;
};

const ProjectsModal: FC<ProjectsModalProps> = ({ isOpen, onClose, supabase, user, onLoadProject }) => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen && user) {
            setIsLoading(true);
            setError(null);
            getProjects(supabase, user.id)
                .then(setProjects)
                .catch(err => setError(`Failed to fetch projects: ${err.message}`))
                .finally(() => setIsLoading(false));
        }
    }, [isOpen, user, supabase]);
    
    const handleDelete = async (projectId: string) => {
        if (window.confirm("Are you sure you want to delete this project? This cannot be undone.")) {
            try {
                await deleteProject(supabase, projectId);
                setProjects(projects.filter(p => p.id !== projectId));
            } catch (err: any) {
                setError(`Failed to delete project: ${err.message}`);
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-[var(--gotidea-bg-alt)] rounded-xl shadow-[var(--gotidea-shadow-lg)] w-full max-w-2xl p-6 border border-[var(--gotidea-border)] flex flex-col" style={{ height: 'min(70vh, 600px)'}}>
                <div className="flex justify-between items-center mb-4 flex-shrink-0">
                    <h2 className="text-xl font-bold">My Projects</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-[var(--gotidea-bg)]">
                        <XIcon className="w-6 h-6 text-[var(--gotidea-text-muted)]"/>
                    </button>
                </div>

                {error && <p className="text-red-500 bg-red-500/10 p-2 rounded-md mb-4">{error}</p>}

                <div className="flex-grow overflow-y-auto -mx-2 px-2">
                    {isLoading ? (
                         <div className="flex items-center justify-center h-full">
                            <LogoIcon className="w-8 h-8 text-[var(--gotidea-primary)] animate-pulse" />
                        </div>
                    ) : projects.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center text-[var(--gotidea-text-muted)]">
                            <FilePlusIcon className="w-12 h-12 mb-4" />
                            <h3 className="font-semibold text-lg">No Projects Yet</h3>
                            <p className="text-sm">Save your work in the workspace to see it here.</p>
                        </div>
                    ) : (
                        <ul className="space-y-2">
                            {projects.map(project => (
                                <li key={project.id} className="flex items-center justify-between p-3 bg-[var(--gotidea-bg)] rounded-lg border border-transparent hover:border-[var(--gotidea-primary)]/30">
                                    <div>
                                        <p className="font-semibold">{project.name}</p>
                                        <p className="text-xs text-[var(--gotidea-text-muted)]">
                                            Last updated: {new Date(project.updated_at).toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button onClick={() => onLoadProject(project)}>Load</Button>
                                        <Button onClick={() => handleDelete(project.id)} className="!bg-red-500/10 !text-red-500 hover:!bg-red-500/20 !border-red-500/20">Delete</Button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProjectsModal;