import React, { useState, useEffect, useRef } from 'react';
import { marked } from 'marked';
import { Chat } from '@google/genai';
import { createChat } from '../services/geminiService';
import Button from './common/Button';
import PaperAirplaneIcon from './icons/PaperAirplaneIcon';
import DnaLogoIcon from './icons/DnaLogoIcon';

interface Message {
    role: 'user' | 'model';
    text: string;
}

const ChatBot: React.FC = () => {
    const [chat, setChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setChat(createChat());
        setMessages([{ role: 'model', text: "Hello! I am Alchemist, your AI assistant. How can I help you build your world today?" }]);
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading || !chat) return;

        const userMessage: Message = { role: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const stream = await chat.sendMessageStream({ message: input });
            let text = '';
            setMessages(prev => [...prev, { role: 'model', text: '...' }]);

            for await (const chunk of stream) {
                text += chunk.text;
                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1] = { role: 'model', text: text + '...' };
                    return newMessages;
                });
            }
             setMessages(prev => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1] = { role: 'model', text };
                return newMessages;
            });

        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { role: 'model', text: 'Sorry, I encountered an error. Please try again.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto h-full flex flex-col bg-gray-800/50 rounded-lg border border-gray-700/50">
            <h2 className="text-3xl font-bold p-4 text-indigo-100 font-serif border-b border-gray-700/50 flex-shrink-0">AI Alchemist Chat</h2>
            <div className="flex-grow p-4 overflow-y-auto">
                <div className="space-y-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`flex items-start gap-2.5 max-w-lg ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                {msg.role === 'model' && (
                                    <div className="w-8 h-8 flex-shrink-0 rounded-full bg-gray-700 flex items-center justify-center">
                                        <DnaLogoIcon className="w-6 h-6 text-purple-400"/>
                                    </div>
                                )}
                                <div className={`p-3 rounded-lg ${msg.role === 'user' ? 'bg-purple-600' : 'bg-gray-700'}`}>
                                    <div 
                                        className="prose prose-invert prose-sm max-w-none prose-p:my-0 text-white" 
                                        dangerouslySetInnerHTML={{ __html: marked.parse(msg.text) }} 
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
            </div>
            <div className="p-4 border-t border-gray-700/50 flex-shrink-0">
                <form onSubmit={handleSendMessage} className="flex space-x-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask me anything about your world..."
                        disabled={isLoading}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-shadow"
                    />
                    <Button type="submit" disabled={isLoading || !input.trim()}>
                        <PaperAirplaneIcon className="w-5 h-5" />
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default ChatBot;
