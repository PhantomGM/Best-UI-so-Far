import React from 'react';
import { marked, Token, Tokens } from 'marked';
import { useProject } from '../contexts/ProjectContext';
import { ContentItem, ContentType } from '../types';
import { Accordion, AccordionItem } from './common/Accordion';
import PlusIcon from './icons/PlusIcon';

interface InteractiveContentRendererProps {
    markdown: string;
    contextItem: ContentItem;
}

interface InteractiveSectionConfig {
    type: ContentType;
    keywords?: string[]; // Optional keywords to filter list items
}

const interactiveSectionMap: Record<string, InteractiveSectionConfig> = {
    // For Quests/Adventures from various content types
    'adventure hooks': { type: ContentType.Quest },
    'narrative threads': { type: ContentType.Quest },
    'story hooks': { type: ContentType.Quest },
    'hooks & opportunities': { type: ContentType.Quest },
    'key scenes & encounters': { type: ContentType.Quest },
    'possible futures': { type: ContentType.Quest },
    'the call to adventure': { type: ContentType.Quest },
    'threats & dangers': { type: ContentType.Quest },

    // For linking to people/groups
    'significant relationships': { type: ContentType.NPC },
    'prominent members': { type: ContentType.NPC },
    'key factions': { type: ContentType.Faction },
    'inhabitants & culture': { type: ContentType.Faction },
    
    // For linking to places
    'notable locations': { type: ContentType.Settlement },
    'settlements & landmarks': { type: ContentType.Settlement }, // From Region
    'a tour of the lands': { type: ContentType.Region }, // From World
    'key regions': { type: ContentType.Region },
    'notable regions': { type: ContentType.Region },
    'regional breakdown': { type: ContentType.Region },

    // For linking to things
    'notable possessions': { 
        type: ContentType.MagicItem, 
        keywords: ['magic', 'arcane', 'cursed', 'enchanted', 'glowing', 'scepter', 'wand', 'amulet', 'ring', 'blade', 'staff', 'orb', 'potion', 'scroll', 'relic', 'tome', 'phylactery', 'whispering']
    },
};

const findInteractiveConfig = (text: string): InteractiveSectionConfig | null => {
    // Normalize by making lowercase, removing markdown, removing leading numbers, and trimming.
    const normalizedText = text
        .toLowerCase()
        .replace(/[*_#`]/g, "") // remove markdown characters
        .replace(/^[0-9.]+\s*/, '')
        .trim();

    for (const key in interactiveSectionMap) {
        if (normalizedText.startsWith(key)) {
            return interactiveSectionMap[key];
        }
    }
    return null;
};


interface Section {
    title: string;
    contentTokens: Token[];
    interactiveConfig: InteractiveSectionConfig | null;
}

type TokensListWithLinks = ReturnType<typeof marked.lexer>;
type Links = TokensListWithLinks['links'];

const parseTokens = (tokenArray: Token[], allLinks: Links) => {
    const tokensWithLinks = tokenArray as TokensListWithLinks;
    tokensWithLinks.links = allLinks;
    return marked.parser(tokensWithLinks);
};


const InteractiveContentRenderer: React.FC<InteractiveContentRendererProps> = ({ markdown, contextItem }) => {
    const { startGenerationFromContext } = useProject();
    const isSourceItemReal = contextItem.id !== 'temp-id';

    const tokens = marked.lexer(markdown);

    const getButtonHtml = (itemTokens: Token[]) => {
        let html = parseTokens(itemTokens, tokens.links).trim();
        // If a list item contains multiple paragraphs, marked will generate multiple <p> tags.
        // A <p> element is not valid inside a <button>, so we need to transform them.
        html = html.replace(/<\/p>\s*<p>/g, '<br />');
        
        // Then we remove the outer <p> and </p> tags that wrap the whole content.
        if (html.startsWith('<p>')) html = html.substring(3);
        if (html.endsWith('</p>')) html = html.slice(0, -4);

        return html;
    };


    const isInteractiveItem = (text: string, config: InteractiveSectionConfig): boolean => {
        if (!config.keywords) return true; // If no keywords, all list items in this section are interactive
        const lowerText = text.toLowerCase();
        return config.keywords.some(kw => lowerText.includes(kw));
    };

    const renderSectionContent = (section: Section) => {
        if (section.interactiveConfig && isSourceItemReal) {
            const listTokens = section.contentTokens.filter(t => t.type === 'list') as Tokens.List[];
            const otherTokens = section.contentTokens.filter(t => t.type !== 'list');
            
            return (
                <div>
                     {listTokens.length > 0 && (
                        <ul className="space-y-2 my-4 !pl-0">
                            {listTokens.flatMap(list => list.items).map((item, itemIndex) => {
                                const guidance = item.text;
                                if (isInteractiveItem(guidance, section.interactiveConfig!)) {
                                    return (
                                        <li key={`${section.title}-item-${itemIndex}`} className="!pl-0 !my-2 list-none">
                                            <button
                                                onClick={() => startGenerationFromContext(section.interactiveConfig!.type, guidance, contextItem)}
                                                className="w-full text-left p-3 rounded-md bg-purple-900/20 hover:bg-purple-900/40 border border-purple-800/50 hover:border-purple-600 transition-all duration-200 flex items-start group"
                                                aria-label={`Generate new ${section.interactiveConfig!.type} based on: ${guidance}`}
                                            >
                                                <PlusIcon className="w-5 h-5 mr-3 mt-1 text-purple-400 flex-shrink-0 group-hover:scale-110 transition-transform" />
                                                <span className="flex-grow" dangerouslySetInnerHTML={{ __html: getButtonHtml(item.tokens) }} />
                                            </button>
                                        </li>
                                    );
                                } else {
                                    return (
                                        <li key={`${section.title}-item-${itemIndex}`} className="!my-2 prose-li:marker:text-purple-400"
                                           dangerouslySetInnerHTML={{ __html: parseTokens(item.tokens, tokens.links) }} />
                                    );
                                }
                            })}
                        </ul>
                     )}
                    {otherTokens.length > 0 && (
                        <div dangerouslySetInnerHTML={{ __html: parseTokens(otherTokens, tokens.links) }} />
                    )}
                </div>
            )
        }
        
        return <div dangerouslySetInnerHTML={{ __html: parseTokens(section.contentTokens, tokens.links) }} />;
    };
    
    // --- Parsing Logic ---
    let introSection: Section | null = null;
    let mainSections: Section[] = [];

    const headingCount = tokens.filter(t => t.type === 'heading').length;
    const firstList = tokens.find(t => t.type === 'list' && t.ordered) as Tokens.List | undefined;
    const listItemCount = firstList?.items.length || 0;
    
    const isListBased = listItemCount > headingCount && listItemCount > 2;

    if (isListBased && firstList) {
        // --- List-Based Parsing (for Quests, Factions, etc.) ---
        const listIndex = tokens.indexOf(firstList);
        const introTokens = tokens.slice(0, listIndex);
        if (introTokens.length > 0) {
            introSection = { title: '', contentTokens: introTokens, interactiveConfig: null };
        }

        for (const item of firstList.items) {
            const titleMatch = item.text.match(/^(.+?)(?:\n|$)/);
            const title = titleMatch ? titleMatch[1].trim().replace(/\*+/g, '') : 'Details';
            
            mainSections.push({
                title: title,
                contentTokens: item.tokens,
                interactiveConfig: findInteractiveConfig(title),
            });
        }
        // Add any content after the main list to the last section
        const remainingTokens = tokens.slice(listIndex + 1);
        if (mainSections.length > 0 && remainingTokens.length > 0) {
            mainSections[mainSections.length - 1].contentTokens.push(...remainingTokens);
        }

    } else if (headingCount > 0) {
        // --- Heading-Based Parsing (for NPCs, Worlds) ---
        let currentSection: Section | null = null;
        const introTokens: Token[] = [];
        
        for (const token of tokens) {
            if (token.type === 'heading') {
                if(currentSection === null && introTokens.length > 0) {
                    introSection = { title: '', contentTokens: [...introTokens], interactiveConfig: null };
                    introTokens.length = 0; // Clear it
                }
                if (currentSection) mainSections.push(currentSection);

                const title = token.text.replace(/^[0-9.]+\s*/, '').trim();
                currentSection = {
                    title: title,
                    contentTokens: [],
                    interactiveConfig: findInteractiveConfig(title),
                };
            } else {
                if (currentSection) {
                    currentSection.contentTokens.push(token);
                } else {
                    introTokens.push(token);
                }
            }
        }
        if (currentSection) mainSections.push(currentSection);

        // If there was only intro content and no headings were processed into sections
        if(mainSections.length === 0 && introTokens.length > 0) {
             introSection = { title: '', contentTokens: introTokens, interactiveConfig: null };
        }

    } else {
        // Fallback for unstructured content
        introSection = { title: '', contentTokens: tokens, interactiveConfig: null };
    }


    const defaultOpen = mainSections.map(s => s.title);

    return (
        <>
            {introSection && <div className="mb-6" dangerouslySetInnerHTML={{ __html: parseTokens(introSection.contentTokens, tokens.links) }} />}
            
            {mainSections.length > 0 && (
                 <Accordion type="multiple" defaultValue={defaultOpen}>
                    {mainSections.map(section => (
                         <AccordionItem key={section.title} value={section.title} triggerText={section.title}>
                            {renderSectionContent(section)}
                        </AccordionItem>
                    ))}
                </Accordion>
            )}
        </>
    );
};

export default InteractiveContentRenderer;