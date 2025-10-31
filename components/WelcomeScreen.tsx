import React, { useState } from 'react';
import Button from './common/Button';
import { useProject } from '../contexts/ProjectContext';
import { ContentType } from '../types';
import DnaLogoIcon from './icons/DnaLogoIcon';

const WelcomeScreen: React.FC = () => {
    const { newProject, loadProject, startGeneration } = useProject();
    const [projectName, setProjectName] = useState('');

    const handleCreateClick = () => {
        if (projectName.trim()) {
            newProject(projectName.trim());
        } else {
            alert("Please enter a name for your project.");
        }
    };

    const generationOptions = [
        { type: ContentType.World, label: 'World' },
        { type: ContentType.Region, label: 'Region' },
        { type: ContentType.NPC, label: 'NPC' },
        { type: ContentType.Faction, label: 'Faction' },
        { type: ContentType.Quest, label: 'Quest' },
        { type: ContentType.Settlement, label: 'Settlement' },
        { type: ContentType.MagicItem, label: 'Magic Item' },
        { type: ContentType.Travel, label: 'Travel' },
    ];

    return (
        <div className="flex flex-col items-center justify-center h-full text-center bg-gray-900 rounded-lg p-8">
            <DnaLogoIcon className="w-32 h-32 text-purple-400 mb-4" />
            <h1 className="text-7xl font-bold text-indigo-100 font-serif tracking-wider mb-1">DNA</h1>
            <p className="text-xl text-indigo-300 mb-2 font-light tracking-[0.2em]">DIGITAL NARRATIVE ALCHEMIST</p>
            <p className="text-lg text-indigo-300 mt-6 mb-10 max-w-2xl">
                Breathe life into your TTRPG worlds. Generate rich, interconnected content from simple ideas. Start a project or use Quick Generation for immediate inspiration.
            </p>

            <div className="w-full max-w-4xl grid md:grid-cols-2 gap-12 items-start">
                {/* Project Section */}
                <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700/50">
                    <h2 className="text-2xl font-bold text-purple-300 mb-4">Start a Project</h2>
                    <div className="flex flex-col space-y-2">
                        <input
                            type="text"
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleCreateClick()}
                            placeholder="Enter a new project name..."
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-shadow"
                        />
                        <Button onClick={handleCreateClick} size="large" fullWidth>
                            Create New Project
                        </Button>
                    </div>
                    
                    <div className="flex items-center space-x-4 my-4">
                        <hr className="flex-grow border-gray-700" />
                        <span className="text-gray-500">OR</span>
                        <hr className="flex-grow border-gray-700" />
                    </div>
                    
                    <Button onClick={loadProject} variant="secondary" size="large" fullWidth>
                        Load Project from File
                    </Button>
                </div>

                {/* Quick Generation Section */}
                <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700/50">
                     <h2 className="text-2xl font-bold text-purple-300 mb-4">Quick Generation</h2>
                     <p className="text-indigo-400 mb-4">Need something fast? Generate any content without creating a project.</p>
                     <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {generationOptions.map(option => (
                             <Button key={option.type} onClick={() => startGeneration(option.type)} variant="secondary">
                                {option.label}
                            </Button>
                        ))}
                     </div>
                </div>
            </div>
        </div>
    );
};

export default WelcomeScreen;