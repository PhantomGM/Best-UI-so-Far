import React, { useState, useCallback } from 'react';
import { editImageWithGemini } from '../services/geminiService';
import { blobToBase64 } from '../services/utils';
import Button from './common/Button';
import UploadIcon from './icons/UploadIcon';
import SparklesIcon from './icons/SparklesIcon';

const ImageEditor: React.FC<{ setIsLoading: (loading: boolean) => void; setError: (error: string | null) => void; }> = ({ setIsLoading, setError }) => {
    const [originalImage, setOriginalImage] = useState<{ file: File, url: string, base64: string } | null>(null);
    const [editedImage, setEditedImage] = useState<string | null>(null);
    const [prompt, setPrompt] = useState('');

    const handleFileChange = async (file: File | null) => {
        if (file && file.type.startsWith('image/')) {
            try {
                const base64 = await blobToBase64(file);
                setOriginalImage({ file, url: URL.createObjectURL(file), base64 });
                setEditedImage(null);
            } catch (error) {
                setError('Failed to read image file.');
            }
        } else {
            setError('Please select a valid image file.');
        }
    };

    const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        const file = event.dataTransfer.files?.[0];
        handleFileChange(file);
    }, []);

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!originalImage || !prompt.trim()) {
            setError('Please upload an image and provide a prompt.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setEditedImage(null);
        
        try {
            const newImageBase64 = await editImageWithGemini(originalImage.base64, originalImage.file.type, prompt);
            setEditedImage(`data:image/png;base64,${newImageBase64}`);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6 bg-gray-800/50 rounded-lg border border-gray-700/50">
            <h2 className="text-3xl font-bold mb-6 text-indigo-100 font-serif">AI Image Alchemist</h2>
            
            <div className="grid md:grid-cols-2 gap-8 items-start">
                {/* Input and Controls */}
                <div className="space-y-6">
                    <div>
                        <label className="block text-lg font-semibold mb-2 text-indigo-200">1. Upload Image</label>
                        <div 
                            className="w-full p-8 border-2 border-dashed border-gray-600 rounded-lg text-center cursor-pointer hover:border-purple-500 hover:bg-gray-800 transition-colors"
                            onClick={() => document.getElementById('file-upload')?.click()}
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                        >
                            <UploadIcon className="w-12 h-12 mx-auto text-gray-400" />
                            <p className="mt-2 text-indigo-300">Drag & drop an image or click to select</p>
                            <input id="file-upload" type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e.target.files?.[0] || null)} />
                        </div>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                         <div>
                            <label htmlFor="prompt" className="block text-lg font-semibold mb-2 text-indigo-200">2. Describe Your Edit</label>
                            <textarea
                                id="prompt"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                rows={3}
                                placeholder="e.g., Add a retro filter, remove the person in the background, make it look like a watercolor painting..."
                                className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-indigo-100"
                                disabled={!originalImage}
                            />
                        </div>
                        <Button type="submit" size="large" fullWidth disabled={!originalImage || !prompt.trim()}>
                            <SparklesIcon className="w-5 h-5 mr-2" />
                            Transmute Image
                        </Button>
                    </form>
                </div>
                {/* Image Display */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <h3 className="text-xl font-semibold mb-2 text-center text-indigo-200">Original</h3>
                        <div className="aspect-square bg-gray-900/50 rounded-lg flex items-center justify-center border border-gray-700">
                             {originalImage ? (
                                <img src={originalImage.url} alt="Original" className="w-full h-full object-contain rounded-lg"/>
                             ) : (
                                <p className="text-gray-500">Upload an image to start</p>
                             )}
                        </div>
                    </div>
                     <div>
                        <h3 className="text-xl font-semibold mb-2 text-center text-indigo-200">Edited</h3>
                        <div className="aspect-square bg-gray-900/50 rounded-lg flex items-center justify-center border border-gray-700">
                             {editedImage ? (
                                <img src={editedImage} alt="Edited" className="w-full h-full object-contain rounded-lg"/>
                             ) : (
                                <p className="text-gray-500">Your edited image will appear here</p>
                             )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageEditor;
