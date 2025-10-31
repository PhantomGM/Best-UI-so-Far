import React, { useState } from 'react';
import { ContentType, GenerationMethod, ContentItem } from '../types';
import { useProject } from '../contexts/ProjectContext';
import { generateItem } from '../services/geminiService';
import Button from './common/Button';
import {
    WorldDetailedForm,
    RegionDetailedForm,
    NpcDetailedForm,
    FactionDetailedForm,
    QuestDetailedForm,
    SettlementDetailedForm,
    MagicItemDetailedForm,
    TravelDetailedForm
} from './generation-forms';

interface GenerationFormProps {
    type: ContentType;
    onGenerate: (content: ContentItem) => void;
    setIsLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    generationContext: { guidance: string; sourceItem: ContentItem } | null;
}

const GenerationForm: React.FC<GenerationFormProps> = ({ type, onGenerate, setIsLoading, setError, generationContext }) => {
    const { project } = useProject();
    const [method, setMethod] = useState<GenerationMethod>(generationContext ? GenerationMethod.Guided : GenerationMethod.Random);
    const [guidance, setGuidance] = useState(generationContext?.guidance || '');
    const [formData, setFormData] = useState<any>({});
    const [useSearchGrounding, setUseSearchGrounding] = useState(false);

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type, checked } = e.target as HTMLInputElement;
        if (type === 'checkbox') {
             setUseSearchGrounding(checked);
        } else {
            setFormData((prev: any) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (method === GenerationMethod.Guided && !guidance.trim()) {
            setError(`Guidance is required for the "${method}" method.`);
            return;
        }
        if (method === GenerationMethod.Detailed && Object.values(formData).every(v => !v)) {
            setError(`Please fill out at least one field for the "${method}" method.`);
            return;
        }

        setIsLoading(true);
        setError(null);
        
        const contextItemForGeneration = generationContext?.sourceItem || null;

        try {
            const detailsWithGrounding = { ...formData, useSearchGrounding };
            const newItem = await generateItem(type, method, guidance, detailsWithGrounding, project, contextItemForGeneration);
            onGenerate(newItem);
        } catch (e) {
            const err = e as Error;
            setError(err.message || 'An unknown error occurred during generation.');
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    const methodDescriptions = {
        [GenerationMethod.Random]: "Generates content with full creative freedom for the AI.",
        [GenerationMethod.Guided]: "Guide the AI with a short description or a few keywords.",
        [GenerationMethod.Detailed]: "Provide a detailed prompt for a more specific result.",
        [GenerationMethod.FromFile]: "Use an existing file as context (feature coming soon).",
    };

    const placeholders: Record<ContentType, string> = {
        [ContentType.World]: 'e.g., A shattered world of floating islands and ancient technology.',
        [ContentType.Region]: 'e.g., The Ashen Waste, a land of volcanic glass and fire elementals.',
        [ContentType.NPC]: 'e.g., A grizzled old guard captain with a secret past.',
        [ContentType.Faction]: 'e.g., A secretive order of assassins who use shadow magic.',
        [ContentType.Quest]: 'e.g., A quest to retrieve a stolen artifact from a dragon\'s lair.',
        [ContentType.Settlement]: 'e.g., A bustling port town built on ancient ruins.',
        [ContentType.MagicItem]: 'e.g., A cursed sword that whispers promises of power.',
        [ContentType.Travel]: 'e.g., A perilous journey across the Dragon-Tooth Mountains.',
    };

    const renderDetailedForm = () => {
        const formProps = { formData, onChange: handleFormChange };
        switch (type) {
            case ContentType.World: return <WorldDetailedForm {...formProps} />;
            case ContentType.Region: return <RegionDetailedForm {...formProps} />;
            case ContentType.NPC: return <NpcDetailedForm {...formProps} />;
            case ContentType.Faction: return <FactionDetailedForm {...formProps} />;
            case ContentType.Quest: return <QuestDetailedForm {...formProps} />;
            case ContentType.Settlement: return <SettlementDetailedForm {...formProps} />;
            case ContentType.MagicItem: return <MagicItemDetailedForm {...formProps} />;
            case ContentType.Travel: return <TravelDetailedForm {...formProps} />;
            default: return <p>No detailed form available for this type.</p>;
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-gray-800/50 rounded-lg border border-gray-700/50">
            <h2 className="text-3xl font-bold mb-6 text-indigo-100 font-serif">Generate a new {type}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-lg font-semibold mb-2 text-indigo-200">Generation Method</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.values(GenerationMethod).map((m) => (
                             m !== GenerationMethod.FromFile && // Disable this for now
                            <button
                                key={m}
                                type="button"
                                onClick={() => setMethod(m)}
                                className={`p-4 rounded-lg text-left border-2 transition-all duration-200 ${method === m ? 'bg-purple-900/50 border-purple-500' : 'bg-gray-800 border-gray-700 hover:border-purple-600'}`}
                            >
                                <p className="font-bold text-indigo-100">{m}</p>
                                <p className="text-sm text-indigo-300">{methodDescriptions[m]}</p>
                            </button>
                        ))}
                    </div>
                </div>

                {method === GenerationMethod.Guided && (
                    <div>
                        <label htmlFor="guidance" className="block text-lg font-semibold mb-2 text-indigo-200">
                             Narrative Guidance
                        </label>
                        <textarea
                            id="guidance"
                            value={guidance}
                            onChange={(e) => setGuidance(e.target.value)}
                            rows={generationContext ? 8 : 5}
                            placeholder={placeholders[type]}
                            className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-indigo-100"
                        />
                    </div>
                )}
                
                {method === GenerationMethod.Detailed && (
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-indigo-200">Detailed Input</h3>
                         {(type === ContentType.World || type === ContentType.Region) && (
                            <div className="flex items-center space-x-2 bg-gray-900/50 p-3 rounded-t-lg border-b border-gray-700">
                                <input
                                    type="checkbox"
                                    id="useSearchGrounding"
                                    name="useSearchGrounding"
                                    checked={useSearchGrounding}
                                    onChange={handleFormChange}
                                    className="h-4 w-4 rounded border-gray-600 bg-gray-800 text-purple-600 focus:ring-purple-500"
                                />
                                <label htmlFor="useSearchGrounding" className="text-indigo-200">
                                    Enable Google Search Grounding <span className="text-sm text-indigo-400">(for up-to-date info)</span>
                                </label>
                            </div>
                        )}
                        <div className="space-y-4 p-4 bg-gray-900/50 rounded-b-lg">
                           {renderDetailedForm()}
                        </div>
                    </div>
                )}
                
                <div className="pt-4">
                    <Button type="submit" size="large" fullWidth>
                        Transmute
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default GenerationForm;
