import React, { useState } from 'react';
import { marked } from 'marked';
import { askDeepThought } from '../services/geminiService';
import Button from './common/Button';
import BrainIcon from './icons/BrainIcon';

const DeepThought: React.FC<{ setIsLoading: (loading: boolean) => void; setError: (error: string | null) => void; }> = ({ setIsLoading, setError }) => {
    const [prompt, setPrompt] = useState('');
    const [response, setResponse] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim()) {
            setError('Please enter a query.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setResponse('');
        
        try {
            const result = await askDeepThought(prompt);
            setResponse(result);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-gray-800/50 rounded-lg border border-gray-700/50">
            <h2 className="text-3xl font-bold mb-2 text-indigo-100 font-serif">Deep Thought</h2>
            <p className="text-indigo-300 mb-6">For your most complex queries. This tool uses a more powerful model with a maximum "thinking budget" to provide deep, insightful analysis.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="deep-prompt" className="block text-lg font-semibold mb-2 text-indigo-200">
                        Your Complex Query
                    </label>
                    <textarea
                        id="deep-prompt"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        rows={8}
                        placeholder="e.g., Design a comprehensive political system for a post-magical society that balances three warring factions, each with a valid claim to the throne. Consider economic, religious, and historical factors..."
                        className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-indigo-100 font-mono"
                    />
                </div>
                <Button type="submit" size="large" fullWidth disabled={!prompt.trim()}>
                    <BrainIcon className="w-5 h-5 mr-2" />
                    Engage
                </Button>
            </form>

            {response && (
                <div className="mt-8 pt-6 border-t border-gray-700/50">
                    <h3 className="text-2xl font-bold mb-4 text-indigo-100 font-serif">Response</h3>
                    <div 
                        className="prose prose-invert max-w-none prose-p:text-indigo-300 prose-headings:text-indigo-100 prose-ul:text-indigo-300 prose-li:marker:text-purple-400 prose-table:border-gray-700 prose-th:text-indigo-100 prose-tr:border-gray-700 prose-td:text-indigo-300"
                        dangerouslySetInnerHTML={{ __html: marked.parse(response) }} 
                    />
                </div>
            )}
        </div>
    );
};

export default DeepThought;
