
import React from 'react';
import { ContentItem, ContentType } from '../types';
import { saveJsonToFile } from '../services/fileService';
import Button from './common/Button';
import SaveIcon from './icons/SaveIcon';
import PlusIcon from './icons/PlusIcon';
import HomeIcon from './icons/HomeIcon';
import { useProject } from '../contexts/ProjectContext';
import FolderPlusIcon from './icons/FolderPlusIcon';
import FolderIcon from './icons/FolderIcon';
import InteractiveContentRenderer from './InteractiveContentRenderer';
import DashboardIcon from './icons/DashboardIcon';
import ExternalLinkIcon from './icons/ExternalLinkIcon';

interface OutputDisplayProps {
    type: ContentType;
    content: Omit<ContentItem, 'id'>;
    isNew: boolean;
    onSave: (type: ContentType, item: Omit<ContentItem, 'id'>) => void;
    onReturnHome?: () => void;
    onReturnToDashboard?: () => void;
}

const OutputDisplay: React.FC<OutputDisplayProps> = ({ type, content, isNew, onSave, onReturnHome, onReturnToDashboard }) => {
    const { project, newProjectWithContent, addContentToLoadedProject } = useProject();
    
    const handleSaveFile = () => {
        const name = (content as any).name || 'untitled';
        const filename = name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        saveJsonToFile(content, filename);
    };

    const renderContent = () => {
        if (!content) return null;
        const profile = (content as any).profile;

        if (!profile || typeof profile !== 'string') {
            return <p>No profile data available to display.</p>;
        }
        
        // Output display doesn't have an ID yet, so we pass a placeholder.
        const placeholderItem = { ...content, id: 'temp-id', type };
        return <InteractiveContentRenderer markdown={profile} contextItem={placeholderItem} />;
    };

    const name = (content as any).name || `Untitled ${type}`;
    const { groundingSources } = content as any;

    return (
        <div className="p-2">
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg shadow-xl shadow-purple-900/10">
                <div className="p-6 border-b border-gray-700/50 flex justify-between items-center flex-wrap gap-4">
                    <div>
                        <p className="text-sm font-medium text-purple-400">{type}</p>
                        <h2 className="text-3xl font-bold text-indigo-100 font-serif">{name}</h2>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                         <Button onClick={handleSaveFile} variant="secondary">
                            <SaveIcon className="w-5 h-5 mr-2" />
                            Save Item File
                        </Button>
                        
                        {isNew && project && (
                            <Button onClick={() => onSave(type, content)}>
                                <PlusIcon className="w-5 h-5 mr-2" />
                                Add to Project
                            </Button>
                        )}
                        
                        {isNew && !project && (
                            <>
                                <Button onClick={() => newProjectWithContent(type, content)}>
                                    <FolderPlusIcon className="w-5 h-5 mr-2" />
                                    Save to New Project
                                </Button>
                                <Button onClick={() => addContentToLoadedProject(type, content)} variant="secondary">
                                    <FolderIcon className="w-5 h-5 mr-2" />
                                    Add to Existing...
                                </Button>
                                {onReturnHome && (
                                    <Button onClick={onReturnHome} variant="secondary">
                                        <HomeIcon className="w-5 h-5 mr-2" />
                                        Return to Start
                                    </Button>
                                )}
                            </>
                        )}
                         {!isNew && project && onReturnToDashboard && (
                            <Button onClick={onReturnToDashboard}>
                                <DashboardIcon className="w-5 h-5 mr-2" />
                                Back to Dashboard
                            </Button>
                        )}
                    </div>
                </div>
                <div className="p-6">
                    <div className="prose prose-invert max-w-none prose-p:text-indigo-300 prose-headings:text-indigo-100 prose-ul:text-indigo-300 prose-li:marker:text-purple-400 prose-table:border-gray-700 prose-th:text-indigo-100 prose-tr:border-gray-700 prose-td:text-indigo-300">
                        {renderContent()}
                    </div>
                     {groundingSources && groundingSources.length > 0 && (
                        <div className="mt-8 pt-4 border-t border-gray-700/50">
                            <h4 className="text-lg font-semibold text-indigo-200 mb-2">Sources</h4>
                            <ul className="space-y-1">
                                {groundingSources.map((chunk: any, index: number) => (
                                    chunk.web && (
                                        <li key={index} className="text-sm">
                                            <a 
                                                href={chunk.web.uri} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                className="flex items-center text-indigo-400 hover:text-purple-400 hover:underline transition-colors"
                                            >
                                                <ExternalLinkIcon className="w-4 h-4 mr-2 flex-shrink-0"/>
                                                <span className="truncate">{chunk.web.title || chunk.web.uri}</span>
                                            </a>
                                        </li>
                                    )
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OutputDisplay;