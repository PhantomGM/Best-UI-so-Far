
import React, { useState, useMemo } from 'react';
import { ContentItem, ContentType } from '../types';
import { useProject } from '../contexts/ProjectContext';
import Button from './common/Button';
import InteractiveContentRenderer from './InteractiveContentRenderer';
import LinkIcon from './icons/LinkIcon';
import PlusIcon from './icons/PlusIcon';

const XMarkIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);


interface GraphNodeModalProps {
    item: ContentItem;
    onClose: () => void;
}

const GraphNodeModal: React.FC<GraphNodeModalProps> = ({ item, onClose }) => {
    const { project, addLink, removeLink, viewItem } = useProject();
    const [isLinking, setIsLinking] = useState(false);
    const [selectedLinkTarget, setSelectedLinkTarget] = useState('');

    const allItems = useMemo(() => {
        if (!project) return [];
        return [
            ...project.worlds.map(i => ({ ...i, type: ContentType.World })),
            ...project.regions.map(i => ({ ...i, type: ContentType.Region })),
            ...project.npcs.map(i => ({ ...i, type: ContentType.NPC })),
            ...project.factions.map(i => ({ ...i, type: ContentType.Faction })),
            ...project.quests.map(i => ({ ...i, type: ContentType.Quest })),
            ...project.settlements.map(i => ({ ...i, type: ContentType.Settlement })),
            ...project.magicItems.map(i => ({ ...i, type: ContentType.MagicItem })),
            ...project.travels.map(i => ({ ...i, type: ContentType.Travel })),
        ].filter(i => i.id !== item.id); // Exclude self from linkable items
    }, [project, item.id]);

    const currentLinks = useMemo(() => {
        if (!project) return [];
        return project.links
            .filter(link => link.source === item.id || link.target === item.id)
            .map(link => {
                const otherId = link.source === item.id ? link.target : link.source;
                const otherItem = allItems.find(i => i.id === otherId) || project.worlds.find(i => i.id === otherId) || project.regions.find(i => i.id === otherId);
                 if (!otherItem) return null;
                 return {
                    id: otherItem.id,
                    name: otherItem.name,
                    type: (otherItem as any).type || ContentType.World
                 }
            }).filter(Boolean);
    }, [project, item.id, allItems]);
    
    const unlinkedItems = useMemo(() => {
        const linkedIds = new Set(currentLinks.map(l => l!.id));
        return allItems.filter(i => !linkedIds.has(i.id));
    }, [allItems, currentLinks]);

    const handleAddLink = () => {
        if (selectedLinkTarget) {
            addLink(item.id, selectedLinkTarget);
            setSelectedLinkTarget('');
            setIsLinking(false);
        }
    };
    
    const handleViewLinkedItem = (type: ContentType, id: string) => {
        const targetItem = allItems.find(i => i.id === id) || project?.worlds.find(w => w.id === id) || project?.regions.find(r => r.id === id);
        if (targetItem) {
            viewItem(type, targetItem);
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-40 flex justify-center items-center"
            onClick={onClose}
        >
            <div 
                className="bg-gray-800 border border-gray-700/50 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-4 border-b border-gray-700/50 flex justify-between items-center flex-shrink-0">
                    <div>
                        <p className="text-sm font-medium text-purple-400">{(item as any).type || ContentType.World}</p>
                        <h2 className="text-2xl font-bold text-indigo-100 font-serif">{item.name}</h2>
                    </div>
                    <Button onClick={onClose} variant="secondary" className="!p-2">
                        <XMarkIcon className="w-6 h-6"/>
                    </Button>
                </div>

                {/* Content */}
                <div className="flex-grow overflow-y-auto p-6 prose prose-invert max-w-none prose-p:text-indigo-300 prose-headings:text-indigo-100 prose-ul:text-indigo-300 prose-li:marker:text-purple-400 prose-table:border-gray-700 prose-th:text-indigo-100 prose-tr:border-gray-700 prose-td:text-indigo-300">
                    <InteractiveContentRenderer markdown={item.profile} contextItem={item} />
                </div>

                {/* Footer / Links */}
                <div className="p-4 border-t border-gray-700/50 flex-shrink-0">
                    <h3 className="text-lg font-semibold text-indigo-200 mb-3 flex items-center"><LinkIcon className="w-5 h-5 mr-2" /> Links</h3>
                    <div className="space-y-2">
                        {currentLinks.map(link => link && (
                            <div key={link.id} className="bg-gray-900/50 p-2 rounded-md flex justify-between items-center">
                                <button onClick={() => handleViewLinkedItem(link.type, link.id)} className="text-left hover:text-purple-300">
                                    <span className="font-bold">{link.name}</span>
                                    <span className="text-xs text-gray-400 ml-2">({link.type})</span>
                                </button>
                                <Button variant="secondary" size="normal" className="!p-1.5" onClick={() => removeLink(item.id, link.id)}>
                                    <XMarkIcon className="w-4 h-4 text-red-400"/>
                                </Button>
                            </div>
                        ))}

                        {isLinking ? (
                            <div className="flex gap-2 items-center p-2 bg-gray-900/50 rounded-md">
                                <select 
                                    value={selectedLinkTarget}
                                    onChange={e => setSelectedLinkTarget(e.target.value)}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                >
                                    <option value="">Select item to link...</option>
                                    {unlinkedItems.map(i => (
                                        <option key={i.id} value={i.id}>{i.name} ({i.type})</option>
                                    ))}
                                </select>
                                <Button onClick={handleAddLink} disabled={!selectedLinkTarget}>Link</Button>
                                <Button onClick={() => setIsLinking(false)} variant="secondary">Cancel</Button>
                            </div>
                        ) : (
                            <Button onClick={() => setIsLinking(true)} variant="secondary" fullWidth className="mt-2">
                                <PlusIcon className="w-5 h-5 mr-2" /> Add Link
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GraphNodeModal;