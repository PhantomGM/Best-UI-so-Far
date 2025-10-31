
import React from 'react';
import { useProject } from '../contexts/ProjectContext';
import { saveJsonToFile } from '../services/fileService';
import { ContentType } from '../types';
import Button from './common/Button';
import FolderIcon from './icons/FolderIcon';
import FileIcon from './icons/FileIcon';
import { Accordion, AccordionItem } from './common/Accordion';
import DnaLogoIcon from './icons/DnaLogoIcon';
import BrainIcon from './icons/BrainIcon';
import ChatIcon from './icons/ChatIcon';
import ImageIcon from './icons/ImageIcon';

const Sidebar: React.FC = () => {
    const { project, viewItem, newProject, loadProject, startGeneration, openAiTool } = useProject();

    const triggerNewProject = () => {
        const name = prompt("Enter a name for your new project:");
        if (name && name.trim()) {
            newProject(name.trim());
        }
    };
    
    const triggerLoadProject = () => {
        loadProject();
    };

    const handleSaveProject = () => {
        if (project) {
            const filename = project.name.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '_project';
            saveJsonToFile(project, filename);
        }
    };

    if (!project) {
        // This sidebar doesn't render if there's no project, but this is a safe guard.
        return null; 
    }

    return (
        <aside className="w-80 bg-gray-900 border-r border-gray-700/50 p-4 flex flex-col h-full shadow-lg">
            <div className="flex items-center space-x-3 mb-6">
                 <DnaLogoIcon className="w-12 h-12 text-purple-400 flex-shrink-0" />
                 <div>
                    <h1 className="text-2xl font-bold text-indigo-100 font-serif tracking-wider">DNA</h1>
                    <p className="text-xs text-indigo-300 tracking-widest font-light">Digital Narrative Alchemist</p>
                </div>
            </div>

            <div className="flex space-x-2 mb-4">
                <Button onClick={triggerNewProject} fullWidth>New Project</Button>
                <Button onClick={triggerLoadProject} fullWidth variant="secondary">Load Project</Button>
            </div>

            <div className="flex-grow overflow-y-auto pr-2 -mr-2">
                <div>
                     <Accordion type="multiple" defaultValue={['ai-tools', 'worlds', 'regions', 'npcs']}>
                        <AccordionItem value="ai-tools" triggerText="AI Alchemist">
                            <div className="flex flex-col space-y-2">
                                <Button onClick={() => openAiTool('chat')} variant="secondary" className="justify-start">
                                    <ChatIcon className="w-5 h-5 mr-3" /> Chatbot
                                </Button>
                                <Button onClick={() => openAiTool('imageEditor')} variant="secondary" className="justify-start">
                                    <ImageIcon className="w-5 h-5 mr-3" /> Image Editor
                                </Button>
                                <Button onClick={() => openAiTool('deepThought')} variant="secondary" className="justify-start">
                                    <BrainIcon className="w-5 h-5 mr-3" /> Deep Thought
                                </Button>
                            </div>
                        </AccordionItem>
                    </Accordion>
                    <div className="flex items-center space-x-2 my-4 p-2 bg-gray-800 rounded-lg">
                        <FolderIcon className="w-6 h-6 text-purple-400" />
                        <span className="font-semibold text-lg truncate">{project.name}</span>
                    </div>
                    <Accordion type="multiple" defaultValue={['worlds', 'regions', 'npcs', 'factions', 'quests', 'settlements', 'magicItems', 'travels']}>
                        <AccordionItem value="worlds" triggerText="Worlds" createAction={() => startGeneration(ContentType.World)}>
                                {project.worlds.length > 0 ? (
                                    project.worlds.map((world, index) => (
                                        <button key={index} onClick={() => viewItem(ContentType.World, world)} className="w-full text-left flex items-center space-x-2 p-2 rounded-md hover:bg-purple-900/40 transition-colors duration-200">
                                            <FileIcon className="w-4 h-4 text-indigo-300 flex-shrink-0" />
                                            <span className="truncate">{world.name}</span>
                                        </button>
                                    ))
                                ) : <p className="text-sm text-gray-500 px-2 py-1">No Worlds created.</p>}
                        </AccordionItem>
                        <AccordionItem value="regions" triggerText="Regions" createAction={() => startGeneration(ContentType.Region)}>
                                {project.regions.length > 0 ? (
                                    project.regions.map((region, index) => (
                                        <button key={index} onClick={() => viewItem(ContentType.Region, region)} className="w-full text-left flex items-center space-x-2 p-2 rounded-md hover:bg-purple-900/40 transition-colors duration-200">
                                            <FileIcon className="w-4 h-4 text-indigo-300 flex-shrink-0" />
                                            <span className="truncate">{region.name}</span>
                                        </button>
                                    ))
                                ) : <p className="text-sm text-gray-500 px-2 py-1">No Regions created.</p>}
                        </AccordionItem>
                        <AccordionItem value="npcs" triggerText="NPCs" createAction={() => startGeneration(ContentType.NPC)}>
                            {project.npcs.length > 0 ? (
                                project.npcs.map((npc, index) => (
                                    <button key={index} onClick={() => viewItem(ContentType.NPC, npc)} className="w-full text-left flex items-center space-x-2 p-2 rounded-md hover:bg-purple-900/40 transition-colors duration-200">
                                        <FileIcon className="w-4 h-4 text-indigo-300 flex-shrink-0" />
                                        <span className="truncate">{npc.name}</span>
                                    </button>
                                ))
                            ) : <p className="text-sm text-gray-500 px-2 py-1">No NPCs created.</p>}
                        </AccordionItem>
                         <AccordionItem value="factions" triggerText="Factions" createAction={() => startGeneration(ContentType.Faction)}>
                            {project.factions.length > 0 ? (
                                project.factions.map((faction, index) => (
                                    <button key={index} onClick={() => viewItem(ContentType.Faction, faction)} className="w-full text-left flex items-center space-x-2 p-2 rounded-md hover:bg-purple-900/40 transition-colors duration-200">
                                        <FileIcon className="w-4 h-4 text-indigo-300 flex-shrink-0" />
                                        <span className="truncate">{faction.name}</span>
                                    </button>
                                ))
                            ) : <p className="text-sm text-gray-500 px-2 py-1">No Factions created.</p>}
                        </AccordionItem>
                         <AccordionItem value="quests" triggerText="Quests" createAction={() => startGeneration(ContentType.Quest)}>
                            {project.quests.length > 0 ? (
                                project.quests.map((quest, index) => (
                                    <button key={index} onClick={() => viewItem(ContentType.Quest, quest)} className="w-full text-left flex items-center space-x-2 p-2 rounded-md hover:bg-purple-900/40 transition-colors duration-200">
                                        <FileIcon className="w-4 h-4 text-indigo-300 flex-shrink-0" />
                                        <span className="truncate">{quest.name}</span>
                                    </button>
                                ))
                            ) : <p className="text-sm text-gray-500 px-2 py-1">No Quests created.</p>}
                        </AccordionItem>
                         <AccordionItem value="settlements" triggerText="Settlements" createAction={() => startGeneration(ContentType.Settlement)}>
                            {project.settlements.length > 0 ? (
                                project.settlements.map((settlement, index) => (
                                    <button key={index} onClick={() => viewItem(ContentType.Settlement, settlement)} className="w-full text-left flex items-center space-x-2 p-2 rounded-md hover:bg-purple-900/40 transition-colors duration-200">
                                        <FileIcon className="w-4 h-4 text-indigo-300 flex-shrink-0" />
                                        <span className="truncate">{settlement.name}</span>
                                    </button>
                                ))
                            ) : <p className="text-sm text-gray-500 px-2 py-1">No Settlements created.</p>}
                        </AccordionItem>
                         <AccordionItem value="magicItems" triggerText="Magic Items" createAction={() => startGeneration(ContentType.MagicItem)}>
                            {project.magicItems.length > 0 ? (
                                project.magicItems.map((item, index) => (
                                    <button key={index} onClick={() => viewItem(ContentType.MagicItem, item)} className="w-full text-left flex items-center space-x-2 p-2 rounded-md hover:bg-purple-900/40 transition-colors duration-200">
                                        <FileIcon className="w-4 h-4 text-indigo-300 flex-shrink-0" />
                                        <span className="truncate">{item.name}</span>
                                    </button>
                                ))
                            ) : <p className="text-sm text-gray-500 px-2 py-1">No Magic Items created.</p>}
                        </AccordionItem>
                         <AccordionItem value="travels" triggerText="Travel Scenarios" createAction={() => startGeneration(ContentType.Travel)}>
                            {project.travels.length > 0 ? (
                                project.travels.map((travel, index) => (
                                    <button key={index} onClick={() => viewItem(ContentType.Travel, travel)} className="w-full text-left flex items-center space-x-2 p-2 rounded-md hover:bg-purple-900/40 transition-colors duration-200">
                                        <FileIcon className="w-4 h-4 text-indigo-300 flex-shrink-0" />
                                        <span className="truncate">{travel.name}</span>
                                    </button>
                                ))
                            ) : <p className="text-sm text-gray-500 px-2 py-1">No Travel Scenarios created.</p>}
                        </AccordionItem>
                    </Accordion>
                </div>
            </div>

            <div className="mt-auto pt-4 border-t border-gray-700/50">
                 <Button onClick={handleSaveProject} fullWidth variant="secondary">Save Project File</Button>
            </div>
        </aside>
    );
};

export default Sidebar;