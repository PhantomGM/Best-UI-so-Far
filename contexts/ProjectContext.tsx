
import React, { createContext, useContext } from 'react';
import { Project, ContentItem, ContentType } from '../types';

interface ProjectContextType {
    project: Project | null;
    setProject: React.Dispatch<React.SetStateAction<Project | null>>;
    viewItem: (type: ContentType, item: ContentItem) => void;
    startGeneration: (type: ContentType) => void;
    startGenerationFromContext: (type: ContentType, guidance: string, contextItem: ContentItem) => void;
    openAiTool: (tool: 'chat' | 'imageEditor' | 'deepThought') => void;
    newProject: (projectName: string) => Promise<void>;
    loadProject: () => void;
    newProjectWithContent: (type: ContentType, item: Omit<ContentItem, 'id'>) => Promise<void>;
    addContentToLoadedProject: (type: ContentType, item: Omit<ContentItem, 'id'>) => void;
    addLink: (sourceId: string, targetId: string) => void;
    removeLink: (sourceId: string, targetId: string) => void;
    itemForModal: ContentItem | null;
    setItemForModal: React.Dispatch<React.SetStateAction<ContentItem | null>>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: React.ReactNode; value: ProjectContextType }> = ({ children, value }) => {
    return (
        <ProjectContext.Provider value={value}>
            {children}
        </ProjectContext.Provider>
    );
};

export const useProject = (): ProjectContextType => {
    const context = useContext(ProjectContext);
    if (context === undefined) {
        throw new Error('useProject must be used within a ProjectProvider');
    }
    return context;
};