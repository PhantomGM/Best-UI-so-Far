
import React from 'react';
import { Project, ContentType, ContentItem, GenerationMethod, World } from '../types';
import WelcomeScreen from './WelcomeScreen';
import Dashboard from './Dashboard';
import GenerationForm from './GenerationForm';
import OutputDisplay from './OutputDisplay';
import ChatBot from './ChatBot';
import ImageEditor from './ImageEditor';
import DeepThought from './DeepThought';

interface MainContentProps {
    activeView: 'welcome' | 'dashboard' | 'generate' | 'output' | 'chat' | 'imageEditor' | 'deepThought';
    setActiveView: (view: 'welcome' | 'dashboard' | 'generate' | 'output' | 'chat' | 'imageEditor' | 'deepThought') => void;
    generationType: ContentType | null;
    setGeneratedContent: (content: ContentItem | null) => void;
    generatedContent: ContentItem | null;
    handleSaveContent: (type: ContentType, item: Omit<ContentItem, 'id'>) => void;
    setIsLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    generationContext: { guidance: string; sourceItem: ContentItem } | null;
}

const MainContent: React.FC<MainContentProps> = (props) => {
    const { 
        activeView, 
        setActiveView, 
        generationType, 
        setGeneratedContent, 
        generatedContent, 
        handleSaveContent, 
        setIsLoading, 
        setError,
        generationContext
    } = props;

    const renderView = () => {
        switch (activeView) {
            case 'welcome':
                return <WelcomeScreen />;
            case 'dashboard':
                return <Dashboard />;
            case 'generate':
                if (!generationType) return <p>Error: Generation type not set.</p>;
                return (
                    <GenerationForm
                        type={generationType}
                        onGenerate={(content) => {
                            setGeneratedContent(content);
                            setActiveView('output');
                        }}
                        setIsLoading={setIsLoading}
                        setError={setError}
                        generationContext={generationContext}
                    />
                );
            case 'output':
                if (!generationType || !generatedContent) return <p>Error: No content to display.</p>;
                return (
                    <OutputDisplay
                        type={generationType}
                        content={generatedContent!}
                        isNew={true} // OutputDisplay is only for new, unsaved content
                        onSave={handleSaveContent}
                        onReturnHome={() => setActiveView('welcome')}
                        onReturnToDashboard={() => setActiveView('dashboard')}
                    />
                );
            case 'chat':
                return <ChatBot />;
            case 'imageEditor':
                return <ImageEditor setIsLoading={setIsLoading} setError={setError} />;
            case 'deepThought':
                return <DeepThought setIsLoading={setIsLoading} setError={setError} />;
            default:
                return <WelcomeScreen />;
        }
    };

    return (
        <div className="w-full h-full">
            {renderView()}
        </div>
    );
};

export default MainContent;