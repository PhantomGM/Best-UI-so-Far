
import React, { useMemo, useCallback } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { useProject } from '../contexts/ProjectContext';
import { ContentType, ContentItem } from '../types';
import GraphNodeModal from './GraphNodeModal';
import Button from './common/Button';
import SparklesIcon from './icons/SparklesIcon';

const Dashboard: React.FC = () => {
    const { project, viewItem, itemForModal, setItemForModal, startGeneration } = useProject();

    const allItems = useMemo(() => {
        if (!project) return [];
        return [
            ...project.worlds.map(item => ({ ...item, type: ContentType.World })),
            ...project.regions.map(item => ({ ...item, type: ContentType.Region })),
            ...project.npcs.map(item => ({ ...item, type: ContentType.NPC })),
            ...project.factions.map(item => ({ ...item, type: ContentType.Faction })),
            ...project.quests.map(item => ({ ...item, type: ContentType.Quest })),
            ...project.settlements.map(item => ({ ...item, type: ContentType.Settlement })),
            ...project.magicItems.map(item => ({ ...item, type: ContentType.MagicItem })),
            ...project.travels.map(item => ({ ...item, type: ContentType.Travel })),
        ];
    }, [project]);

    const graphData = useMemo(() => {
        if (!project || allItems.length === 0) {
            return { nodes: [], links: [] };
        }
        const nodes = allItems.map(item => ({
            id: item.id,
            name: item.name,
            item: item,
            type: item.type
        }));
        
        return { nodes, links: project.links };
    }, [project, allItems]);
    
    const getNodeColor = (nodeType: ContentType) => {
        switch (nodeType) {
            case ContentType.World: return 'rgba(167, 139, 250, 1)'; // purple-400
            case ContentType.Region: return 'rgba(236, 72, 153, 1)'; // pink-500
            case ContentType.NPC: return 'rgba(52, 211, 153, 1)'; // green-400
            case ContentType.Faction: return 'rgba(248, 113, 113, 1)'; // red-400
            case ContentType.Quest: return 'rgba(96, 165, 250, 1)'; // blue-400
            case ContentType.Settlement: return 'rgba(250, 204, 21, 1)'; // yellow-400
            case ContentType.MagicItem: return 'rgba(34, 211, 238, 1)'; // cyan-400
            case ContentType.Travel: return 'rgba(251, 146, 60, 1)'; // orange-400
            default: return 'rgba(156, 163, 175, 1)'; // gray-400
        }
    };
    
    const handleNodeClick = useCallback((node: any) => {
        setItemForModal(node.item as ContentItem);
    }, [setItemForModal]);

    const handleBackgroundClick = useCallback(() => {
        setItemForModal(null);
    }, [setItemForModal]);

    const drawNode = useCallback((node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
        const label = node.name;
        const fontSize = 14 / globalScale;
        ctx.font = `${fontSize}px Inter`;
        
        const isWorld = node.type === ContentType.World;
        const radius = isWorld ? 10 : 5;

        // Draw circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = getNodeColor(node.type);
        ctx.fill();

        // Draw label
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = 'rgba(229, 231, 235, 0.8)'; // gray-200
        ctx.fillText(label, node.x, node.y + radius + 8);
    }, []);

    if (!project || allItems.length === 0) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 bg-gray-800/50 border border-dashed border-gray-700/50 rounded-lg">
                <SparklesIcon className="w-16 h-16 text-purple-400 mb-4" />
                <h1 className="text-3xl font-bold text-indigo-100 mb-2">
                    {project ? `Welcome to ${project.name}` : "No Project Loaded"}
                </h1>
                <p className="text-lg text-indigo-300 max-w-lg">
                    Your project is a blank canvas. Use the sidebar or the options below to start generating content for your Living World.
                </p>
                <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Button onClick={() => startGeneration(ContentType.World)} size="large">Create World</Button>
                    <Button onClick={() => startGeneration(ContentType.Region)} size="large" variant="secondary">Create Region</Button>
                    <Button onClick={() => startGeneration(ContentType.NPC)} size="large" variant="secondary">Create NPC</Button>
                    <Button onClick={() => startGeneration(ContentType.Faction)} size="large" variant="secondary">Create Faction</Button>
                    <Button onClick={() => startGeneration(ContentType.Quest)} size="large" variant="secondary">Create Quest</Button>
                    <Button onClick={() => startGeneration(ContentType.Settlement)} size="large" variant="secondary">Create Settlement</Button>
                    <Button onClick={() => startGeneration(ContentType.MagicItem)} size="large" variant="secondary">Create Magic Item</Button>
                    <Button onClick={() => startGeneration(ContentType.Travel)} size="large" variant="secondary">Create Travel</Button>
                </div>
            </div>
        );
    }
    
    return (
        <div className="w-full h-full rounded-lg overflow-hidden relative bg-gray-900 border border-gray-700/50">
            <ForceGraph2D
                graphData={graphData}
                nodeId="id"
                nodeVal={10}
                nodeLabel="name"
                nodeCanvasObject={drawNode}
                nodePointerAreaPaint={(node, color, ctx) => {
                    ctx.fillStyle = color;
                    const isWorld = node.type === ContentType.World;
                    const radius = isWorld ? 10 : 5;
                    ctx.fillRect(node.x - radius, node.y - radius, 2 * radius, 2 * radius);
                }}
                linkColor={() => 'rgba(107, 114, 128, 0.3)'}
                linkWidth={1}
                linkDirectionalParticles={1}
                linkDirectionalParticleWidth={1.5}
                linkDirectionalParticleColor={() => 'rgba(167, 139, 250, 0.7)'}
                onNodeClick={handleNodeClick}
                onBackgroundClick={handleBackgroundClick}
                backgroundColor="rgba(17, 24, 39, 1)" // bg-gray-900
            />
             {itemForModal && (
                <GraphNodeModal 
                    item={itemForModal}
                    onClose={() => setItemForModal(null)}
                />
            )}
        </div>
    );
};

export default Dashboard;