
import React, { useState, useCallback, useRef } from 'react';
import { Project, ContentType, ContentItem, World, Settlement, MagicItem, Travel, NPC, Faction, Quest, Link, Region } from './types';
import { ProjectProvider } from './contexts/ProjectContext';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import { Loader } from './components/common/Loader';
import { loadJsonFromFile } from './services/fileService';

const App: React.FC = () => {
    const [project, setProject] = useState<Project | null>(null);
    const [activeView, setActiveView] = useState<'welcome' | 'dashboard' | 'generate' | 'output' | 'chat' | 'imageEditor' | 'deepThought'>('welcome');
    const [generationType, setGenerationType] = useState<ContentType | null>(null);
    const [generatedContent, setGeneratedContent] = useState<ContentItem | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [pendingAddItem, setPendingAddItem] = useState<{ type: ContentType, item: ContentItem } | null>(null);


    // State for contextual generation, now includes source for linking
    const [generationContext, setGenerationContext] = useState<{ guidance: string; sourceItem: ContentItem } | null>(null);
    
    // State for graph view modal
    const [itemForModal, setItemForModal] = useState<ContentItem | null>(null);

    const clearGenerationContext = () => {
        setGenerationContext(null);
    }

    const handleNewProject = useCallback(async (projectName: string) => {
        setIsLoading(true);
        setError(null);
        clearGenerationContext();
        try {
            const newProject: Project = {
                name: projectName,
                worlds: [],
                regions: [],
                npcs: [],
                factions: [],
                quests: [],
                settlements: [],
                magicItems: [],
                travels: [],
                links: [],
            };

            setProject(newProject);
            setActiveView('dashboard');
        } catch (e) {
            setError('Failed to create project.');
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleNewProjectWithContent = useCallback(async (type: ContentType, item: Omit<ContentItem, 'id'>) => {
        setIsLoading(true);
        setError(null);
        clearGenerationContext();

        try {
            const projectName = item.name || `Untitled Project`;
            const newProject: Project = {
                name: projectName,
                worlds: [],
                regions: [],
                npcs: [],
                factions: [],
                quests: [],
                settlements: [],
                magicItems: [],
                travels: [],
                links: [],
            };

            const itemWithId = { ...item, id: crypto.randomUUID() };

            switch (type) {
                case ContentType.World: newProject.worlds.push(itemWithId as World); break;
                case ContentType.Region: newProject.regions.push(itemWithId as Region); break;
                case ContentType.NPC: newProject.npcs.push(itemWithId as NPC); break;
                case ContentType.Faction: newProject.factions.push(itemWithId as Faction); break;
                case ContentType.Quest: newProject.quests.push(itemWithId as Quest); break;
                case ContentType.Settlement: newProject.settlements.push(itemWithId as Settlement); break;
                case ContentType.MagicItem: newProject.magicItems.push(itemWithId as MagicItem); break;
                case ContentType.Travel: newProject.travels.push(itemWithId as Travel); break;
            }

            setProject(newProject);
            setGeneratedContent(null); // Clear the output display content
            setActiveView('dashboard'); // Go directly to the dashboard
        } catch (e) {
            setError('Failed to create project with content.');
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleTriggerLoad = useCallback(() => {
        fileInputRef.current?.click();
    }, []);
    
    const handleAddContentToLoadedProject = useCallback((type: ContentType, item: Omit<ContentItem, 'id'>) => {
        const itemWithId = { ...item, id: crypto.randomUUID() };
        setPendingAddItem({ type, item: itemWithId });
        fileInputRef.current?.click();
    }, []);


    const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setIsLoading(true);
            setError(null);
            clearGenerationContext();
            try {
                const projectData = await loadJsonFromFile<Project>(file);
                // Validate and migrate the loaded project structure
                if (projectData && projectData.name && (Array.isArray(projectData.worlds) || Array.isArray(projectData.npcs))) {
                    
                    // Migration: ensure all items have IDs and project has links array
                    projectData.links = projectData.links || [];
                    const contentArrays: (keyof Project)[] = ['worlds', 'regions', 'npcs', 'factions', 'quests', 'settlements', 'magicItems', 'travels'];
                    
                    contentArrays.forEach(key => {
                        const arr = projectData[key] as ContentItem[] | undefined;
                        if (Array.isArray(arr)) {
                            arr.forEach(item => {
                                if (!item.id) {
                                    item.id = crypto.randomUUID();
                                }
                            });
                        } else {
                            (projectData as any)[key] = [];
                        }
                    });


                    if (pendingAddItem) {
                        const { type, item } = pendingAddItem;
                        switch (type) {
                            case ContentType.World: projectData.worlds.push(item as World); break;
                            case ContentType.Region: projectData.regions.push(item as Region); break;
                            case ContentType.NPC: projectData.npcs.push(item as NPC); break;
                            case ContentType.Faction: projectData.factions.push(item as Faction); break;
                            case ContentType.Quest: projectData.quests.push(item as Quest); break;
                            case ContentType.Settlement: projectData.settlements.push(item as Settlement); break;
                            case ContentType.MagicItem: projectData.magicItems.push(item as MagicItem); break;
                            case ContentType.Travel: projectData.travels.push(item as Travel); break;
                        }
                        setPendingAddItem(null);
                    }

                    setProject(projectData);
setActiveView('dashboard');
                    setGeneratedContent(null);
                } else {
                     setError("Invalid project file. It must be a valid JSON file exported from this application.");
                }
            } catch (e) {
                setError("Error loading file. Please ensure it's a valid project JSON file.");
                setPendingAddItem(null);
                console.error(e);
            } finally {
                setIsLoading(false);
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
            }
        }
    }, [pendingAddItem]);

    const handleStartGeneration = useCallback((type: ContentType) => {
        setGenerationType(type);
        setActiveView('generate');
        setGeneratedContent(null);
        clearGenerationContext();
    }, []);

    const handleOpenAiTool = useCallback((tool: 'chat' | 'imageEditor' | 'deepThought') => {
        setActiveView(tool);
    }, []);

    const handleStartGenerationFromContext = useCallback((type: ContentType, guidance: string, sourceItem: ContentItem) => {
        setGenerationType(type);
        setGenerationContext({ guidance, sourceItem });
        setActiveView('generate');
        setGeneratedContent(null);
    }, []);

    const handleViewItem = useCallback((type: ContentType, item: ContentItem) => {
        setItemForModal(item);
        setActiveView('dashboard');
    }, []);

    const handleSaveContent = useCallback((type: ContentType, item: Omit<ContentItem, 'id'>) => {
        if (!project) return;
        
        const itemWithId = { ...item, id: crypto.randomUUID() };
        
        const updatedProject = { ...project, links: [...project.links] };

        switch (type) {
            case ContentType.World:
                updatedProject.worlds = [...updatedProject.worlds, itemWithId as World];
                break;
            case ContentType.Region:
                updatedProject.regions = [...updatedProject.regions, itemWithId as Region];
                break;
            case ContentType.NPC:
                updatedProject.npcs = [...updatedProject.npcs, itemWithId as NPC];
                break;
            case ContentType.Faction:
                updatedProject.factions = [...updatedProject.factions, itemWithId as Faction];
                break;
            case ContentType.Quest:
                updatedProject.quests = [...updatedProject.quests, itemWithId as Quest];
                break;
            case ContentType.Settlement:
                updatedProject.settlements = [...updatedProject.settlements, itemWithId as Settlement];
                break;
            case ContentType.MagicItem:
                updatedProject.magicItems = [...updatedProject.magicItems, itemWithId as MagicItem];
                break;
            case ContentType.Travel:
                updatedProject.travels = [...updatedProject.travels, itemWithId as Travel];
                break;
        }

        // Add link if generated from context
        if (generationContext?.sourceItem) {
            const newLink: Link = { source: generationContext.sourceItem.id, target: itemWithId.id };
            const linkExists = updatedProject.links.some(l => 
                (l.source === newLink.source && l.target === newLink.target) ||
                (l.source === newLink.target && l.target === newLink.source)
            );
            if (!linkExists) {
                updatedProject.links.push(newLink);
            }
        }

        setProject(updatedProject);
        setGeneratedContent(null);
        clearGenerationContext();
        setActiveView('dashboard');
    }, [project, generationContext]);

    const addLink = useCallback((sourceId: string, targetId: string) => {
        if (!project) return;
        const newLink: Link = { source: sourceId, target: targetId };
        // Avoid creating duplicate links
        const linkExists = project.links.some(l => 
            (l.source === sourceId && l.target === targetId) ||
            (l.source === targetId && l.target === sourceId)
        );
        if (!linkExists) {
            setProject(p => p ? ({ ...p, links: [...p.links, newLink] }) : null);
        }
    }, [project]);

    const removeLink = useCallback((sourceId: string, targetId: string) => {
        if (!project) return;
        setProject(p => p ? ({
            ...p,
            links: p.links.filter(l => 
                !(l.source === sourceId && l.target === targetId) &&
                !(l.source === targetId && l.target === sourceId)
            )
        }) : null);
    }, [project]);


    return (
        <ProjectProvider value={{ 
            project, 
            setProject, 
            viewItem: handleViewItem, 
            startGeneration: handleStartGeneration,
            startGenerationFromContext: handleStartGenerationFromContext,
            openAiTool: handleOpenAiTool,
            newProject: handleNewProject,
            loadProject: handleTriggerLoad,
            newProjectWithContent: handleNewProjectWithContent,
            addContentToLoadedProject: handleAddContentToLoadedProject,
            addLink,
            removeLink,
            itemForModal,
            setItemForModal,
        }}>
            <div className="flex h-screen bg-gray-900 text-indigo-100 font-sans">
                {isLoading && <Loader message="Transmuting narrative essence..." />}
                {project && <Sidebar />}
                <main className="flex-1 p-6 overflow-y-auto relative">
                    {error && (
                        <div className="bg-red-800 border border-red-600 text-white p-4 rounded-lg mb-4 absolute top-4 right-4 z-20">
                            <strong>Error:</strong> {error} <button onClick={() => setError(null)} className="float-right font-bold ml-4">X</button>
                        </div>
                    )}
                    <MainContent
                        activeView={activeView}
                        setActiveView={setActiveView}
                        generationType={generationType}
                        setGeneratedContent={setGeneratedContent}
                        generatedContent={generatedContent}
                        handleSaveContent={handleSaveContent}
                        setIsLoading={setIsLoading}
                        setError={setError}
                        generationContext={generationContext}
                    />
                </main>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".json" />
            </div>
        </ProjectProvider>
    );
};

export default App;