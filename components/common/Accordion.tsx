
import React, { createContext, useContext, useState, useCallback } from 'react';
import ChevronDownIcon from '../icons/ChevronDownIcon';
import PlusIcon from '../icons/PlusIcon';

type AccordionContextType = {
    openItems: string[];
    toggleItem: (value: string) => void;
};

const AccordionContext = createContext<AccordionContextType | null>(null);

const useAccordionContext = () => {
    const context = useContext(AccordionContext);
    if (!context) {
        throw new Error('AccordionItem must be used within an Accordion component');
    }
    return context;
};

type AccordionProps = {
    children: React.ReactNode;
    type: 'single' | 'multiple';
    defaultValue?: string | string[];
};

export const Accordion: React.FC<AccordionProps> = ({ children, type, defaultValue }) => {
    const [openItems, setOpenItems] = useState<string[]>(() => {
        if (defaultValue) {
            return Array.isArray(defaultValue) ? defaultValue : [defaultValue];
        }
        return [];
    });

    const toggleItem = useCallback((value: string) => {
        if (type === 'single') {
            setOpenItems(prev => prev.includes(value) ? [] : [value]);
        } else {
            setOpenItems(prev => prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]);
        }
    }, [type]);

    return (
        <AccordionContext.Provider value={{ openItems, toggleItem }}>
            <div className="space-y-2">{children}</div>
        </AccordionContext.Provider>
    );
};


type AccordionItemProps = {
    children: React.ReactNode;
    value: string;
    triggerText: string;
    createAction?: () => void;
};

export const AccordionItem: React.FC<AccordionItemProps> = ({ children, value, triggerText, createAction }) => {
    const { openItems, toggleItem } = useAccordionContext();
    const isOpen = openItems.includes(value);

    return (
        <div className="border-b border-gray-700/50">
            <div className="w-full flex justify-between items-center text-left font-semibold text-lg text-indigo-200 hover:bg-gray-800/60 rounded-t-lg transition-colors duration-200">
                <button
                    onClick={() => toggleItem(value)}
                    className="flex-grow flex justify-between items-center p-4"
                    aria-expanded={isOpen}
                    aria-controls={`accordion-content-${value}`}
                >
                    <span>{triggerText}</span>
                    <ChevronDownIcon className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}`} />
                </button>
                {createAction && (
                     <button
                        onClick={createAction}
                        className="p-2 mr-2 rounded-full hover:bg-purple-800/50 transition-colors"
                        aria-label={`Create new ${triggerText}`}
                     >
                        <PlusIcon className="w-5 h-5 text-purple-400" />
                     </button>
                )}
            </div>
            {isOpen && (
                <div id={`accordion-content-${value}`} role="region" className="p-4 bg-gray-900/50 rounded-b-lg">
                    {children}
                </div>
            )}
        </div>
    );
};
