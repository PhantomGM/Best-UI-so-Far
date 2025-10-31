import { GoogleGenAI, GenerateContentResponse, Chat, Modality } from "@google/genai";
import { World, Faction, NPC, Quest, Settlement, MagicItem, ContentType, GenerationMethod, Travel, Region, ContentItem, Project } from '../types';
import { randInt } from './utils';

// DNA Generators
import { generateWorldDNA } from './dna/worldDna';
import { generateRegionDNA } from './dna/regionDna';
import { generateNpcDNA } from './dna/npcDna';
import { generateFactionDNAString } from './dna/factionDna';
import { generateQuestDNA } from './dna/questDna';
import { generateSettlementDNA } from './dna/settlementDna';
import { generateMagicItemDNA } from './dna/magicItemDna';
import { generateTravelDNA } from './dna/travelDna';

// Decoding Prompts
import { DNA_DECODING_PROMPT } from './prompts/worldPrompt';
import { REGION_DNA_DECODING_PROMPT } from './prompts/regionPrompt';
import { QUEST_DNA_DECODING_PROMPT } from './prompts/questPrompt';
import { FACTION_DNA_DECODING_PROMPT } from './prompts/factionPrompt';
import { NPC_DNA_DECODING_PROMPT } from './prompts/npcPrompt';
import { SETTLEMENT_DNA_DECODING_PROMPT } from './prompts/settlementPrompt';
import { MAGIC_ITEM_DNA_DECODING_PROMPT } from './prompts/magicItemPrompt';
import { TRAVEL_DNA_DECODING_PROMPT } from './prompts/travelPrompt';


const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    console.error("API_KEY environment variable not set.");
}

export const ai = new GoogleGenAI({ apiKey: API_KEY! });

const handleGeminiError = (error: any, context: string): never => {
    console.group(`--- GEMINI API ERROR (${context}) ---`);
    console.error(`Error during ${context}:`, error);
    console.groupEnd();
     if (error instanceof Error) {
        throw new Error(`Failed to communicate with the Gemini API during ${context}: ${error.message}`);
    }
    throw new Error(`Failed to communicate with the Gemini API during ${context} due to an unknown error.`);
};

const handleBlockedResponse = (response: GenerateContentResponse): never => {
    const safetyRatings = response.candidates?.[0]?.safetyRatings;
    console.error("Gemini response blocked due to safety settings:", safetyRatings);
    throw new Error("The response was blocked due to safety concerns. Please adjust your prompt or retry.");
};


const generateGeminiContent = async (prompt: string, useSearchGrounding: boolean = false): Promise<GenerateContentResponse> => {
    if (!API_KEY) {
        throw new Error("API_KEY is not configured. Please set the environment variable.");
    }
    try {
        console.groupCollapsed('--- GEMINI API CALL ---');
        console.log('SENDING PROMPT:', prompt);
        console.log('USING SEARCH GROUNDING:', useSearchGrounding);

        const config: any = {
            temperature: 0.8,
            topP: 0.95,
        };

        if (useSearchGrounding) {
            config.tools = [{googleSearch: {}}];
        }

        const response: GenerateContentResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: config,
        });
        
        console.log('RECEIVED RAW RESPONSE:', JSON.stringify(response, null, 2));
        
        if (!response.text) {
             handleBlockedResponse(response);
        }
        
        console.groupEnd();
        return response;

    } catch (error) {
        handleGeminiError(error, "content generation");
    }
};

const extractName = (text: string, patterns: RegExp[], defaultName: string): string => {
    console.groupCollapsed(`--- EXTRACT NAME (${defaultName}) ---`);
    console.log(`INPUT TYPE: ${typeof text}`);
    console.log('INPUT VALUE:', text);

    if (typeof text !== 'string' || !text.trim()) {
        console.warn(`extractName received empty or invalid input. Defaulting to "${defaultName}".`);
        console.groupEnd();
        return defaultName;
    }

    for (const pattern of patterns) {
        const match = text.match(pattern);
        if (match && typeof match[1] === 'string' && match[1].trim()) {
            const finalName = match[1].trim().replace(/[*_]/g, '').replace(/^"|"$/g, '');
            console.log(`SUCCESS: Found name "${finalName}" with pattern: ${pattern}`);
            console.groupEnd();
            return finalName;
        }
    }
    
    console.warn(`FAILURE: extractName did not find a name. Defaulting to "${defaultName}". Raw text:`, text);
    console.groupEnd();
    return defaultName;
};

const formatDetailsForPrompt = (details: any, type: ContentType): string => {
    const lines = Object.entries(details)
        .filter(([key, value]) => value && typeof value === 'string' && value.trim() !== '' && key !== 'useSearchGrounding')
        .map(([key, value]) => {
            const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
            return `  - ${label}: ${value}`;
        });

    if (lines.length === 0) {
        return '';
    }

    return `\n\n### User's Detailed Input for ${type}\n\n${lines.join('\n')}`;
};

const buildProjectContextPrompt = (project: Project | null, typeToGenerate: ContentType, directContextItem: ContentItem | null): string => {
    if (!project) return '';

    // If we're generating a World and it's the first one, there's no context.
    if (typeToGenerate === ContentType.World && project.worlds.length === 0) {
        return '';
    }

    const contextParts: string[] = [];
    contextParts.push("### Project Context");
    contextParts.push("You are generating a new item within an existing project. Ensure the new content is consistent with the established lore, tone, and details provided below. Weave in connections to existing entities where it feels natural.");

    // 1. Direct Context Item gets top priority.
    if (directContextItem) {
        contextParts.push("\n**Primary Context (Generate from this item):**");
        contextParts.push(`*   **Item Name:** ${directContextItem.name}`);
        contextParts.push(`*   **Profile:**\n${directContextItem.profile}`);
    }

    // 2. World Context is almost always relevant.
    if (project.worlds.length > 0) {
        contextParts.push("\n**Overarching World Setting:**");
        project.worlds.forEach(world => {
            // Don't repeat the world profile if it was the direct context item
            if (directContextItem?.id !== world.id) {
                contextParts.push(`**World Name:** ${world.name}\n${world.profile}`);
            }
        });
    }

    // 3. List other existing entities for reference.
    const referenceItems: { title: string; type: ContentType; items: ContentItem[] }[] = [
        { title: 'Worlds', type: ContentType.World, items: project.worlds },
        { title: 'Regions', type: ContentType.Region, items: project.regions },
        { title: 'Factions', type: ContentType.Faction, items: project.factions },
        { title: 'NPCs', type: ContentType.NPC, items: project.npcs },
        { title: 'Settlements', type: ContentType.Settlement, items: project.settlements },
        { title: 'Quests', type: ContentType.Quest, items: project.quests },
        { title: 'Magic Items', type: ContentType.MagicItem, items: project.magicItems },
        { title: 'Travel Scenarios', type: ContentType.Travel, items: project.travels },
    ];
    
    const referenceLists: string[] = [];
    referenceItems.forEach(({ title, type, items }) => {
        if (type === typeToGenerate) return; // Skip listing items of the type we're generating

        const filteredItems = items.filter(i => i.id !== directContextItem?.id);
        if (filteredItems.length > 0) {
            referenceLists.push(`*   **Existing ${title}:** ${filteredItems.map(i => i.name).join(', ')}`);
        }
    });

    if (referenceLists.length > 0) {
        contextParts.push("\n**Referenceable Entities:**");
        contextParts.push(...referenceLists);
    }
    
    contextParts.push("\n---");

    return contextParts.join('\n');
};


export const generateItem = async <T extends World | Region | NPC | Faction | Quest | Settlement | MagicItem | Travel>(
    type: ContentType,
    method: GenerationMethod,
    guidance: string,
    details: any,
    project: Project | null,
    contextItem: ContentItem | null
): Promise<T> => {
    
    let userProvidedContext = '';
    if (method === GenerationMethod.Guided && guidance) {
        userProvidedContext = `\n\n### User's Narrative Guidance\n${guidance.trim()}`;
    } else if (method === GenerationMethod.Detailed) {
        userProvidedContext = formatDetailsForPrompt(details, type);
    }
    
    const projectContext = buildProjectContextPrompt(project, type, contextItem);
    const combinedContext = projectContext + userProvidedContext;
    const useSearchGrounding = details.useSearchGrounding === true;

    const processResponse = (response: GenerateContentResponse, dna: string, name: string) => {
        return { 
            name, 
            dna, 
            profile: response.text,
            groundingSources: response.candidates?.[0]?.groundingMetadata?.groundingChunks 
        } as T;
    };

    if (type === ContentType.World) {
        const numRegions = (method === GenerationMethod.Detailed && details.numRegions) ? parseInt(details.numRegions, 10) : randInt(2, 5);
        const numFactions = randInt(2, 4);
        const dna = generateWorldDNA(numRegions, numFactions);
        const prompt = `${DNA_DECODING_PROMPT}\n\nWORLD DNA:\n${dna}${combinedContext}`;
        const response = await generateGeminiContent(prompt, useSearchGrounding);
        const worldName = (method === GenerationMethod.Detailed && details.name) || extractName(response.text, [/^\s*(?:1\.)?\s*\*?World Name\**?\s*:\s*(?:\"|\*\*?)?(.*?)(?:\"|\*\*?)?\s*$/im], 'Untitled World');
        return processResponse(response, dna, worldName);
    }

    if (type === ContentType.Region) {
        const dna = generateRegionDNA();
        const prompt = `${REGION_DNA_DECODING_PROMPT}${combinedContext}\n\nREGION DNA:\n${dna}`;
        const response = await generateGeminiContent(prompt, useSearchGrounding);
        const regionName = (method === GenerationMethod.Detailed && details.name) || extractName(response.text, [/^\s*(?:1\.)?\s*\*?Region Name\**?\s*:\s*(?:\"|\*\*?)?(.*?)(?:\"|\*\*?)?\s*$/im, /###\s*(.*)/], 'Untitled Region');
        return processResponse(response, dna, regionName);
    }

    // --- Other content types (no search grounding for now) ---
    const regularPromptAndGenerate = async (promptTemplate: string, dna: string) => {
        const fullPrompt = `${promptTemplate}${combinedContext}\n\n${type} DNA:\n${dna}`;
        const response = await generateGeminiContent(fullPrompt, false);
        return response;
    };
    
    if (type === ContentType.Travel) {
        const dna = generateTravelDNA();
        const response = await regularPromptAndGenerate(TRAVEL_DNA_DECODING_PROMPT, dna);
        const travelName = (method === GenerationMethod.Detailed && details.regionName) || extractName(response.text, [/^\s*(?:1\.)?\s*\*?Scenario Title\**?\s*:\s*(?:\"|\*\*?)?(.*?)(?:\"|\*\*?)?\s*$/im], 'Untitled Travel Scenario');
        return processResponse(response, dna, travelName);
    }
    
    if (type === ContentType.NPC) {
        const dna = generateNpcDNA();
        const response = await regularPromptAndGenerate(NPC_DNA_DECODING_PROMPT, dna);
        const npcName = (method === GenerationMethod.Detailed && details.name) || extractName(response.text, [/^###\s*(?:\*\*)?([^*#\n\r]+)(?:\*\*)?\s*$/im, /^###\s*\*+(.*?)\*+\s*\n\s*\*\*Role:/im, /^###\s*\*{0,2}(.*?)\*{0,2}/im ], 'Untitled NPC');
        return processResponse(response, dna, npcName);
    }

    if (type === ContentType.Quest) {
        const dna = generateQuestDNA();
        const response = await regularPromptAndGenerate(QUEST_DNA_DECODING_PROMPT, dna);
        const questName = (method === GenerationMethod.Detailed && details.title) || extractName(response.text, [/^\s*(?:1\.)?\s*\*?Quest Title\**?\s*:\s*(?:\"|\*\*?)?(.*?)(?:\"|\*\*?)?\s*$/im], 'Untitled Quest');
        return processResponse(response, dna, questName);
    }
    
    if (type === ContentType.Faction) {
        const dna = generateFactionDNAString();
        const response = await regularPromptAndGenerate(FACTION_DNA_DECODING_PROMPT, dna);
        const factionName = (method === GenerationMethod.Detailed && details.name) || extractName(response.text, [/^\s*1\.\s*Faction Name & Symbol\s*[\r\n]+\s*\*\*Name:\*\*\s*\*(.*?)\*/i, /^\s*\*\*Name:\*\*\s*\*(.*?)\*/i, /^\s*\*\*Name:\*\*\s*(.*)/i, /^\s*Name:\s*(.*)/im, /^\s*(?:1\.)?\s*\*?Faction Name\**?\s*:\s*(?:\"|\*\*?)?(.*?)(?:\"|\*\*?)?\s*$/im], 'Untitled Faction');
        return processResponse(response, dna, factionName);
    }

    if (type === ContentType.Settlement) {
        const dna = generateSettlementDNA();
        const response = await regularPromptAndGenerate(SETTLEMENT_DNA_DECODING_PROMPT, dna);
        const settlementName = (method === GenerationMethod.Detailed && details.name) || extractName(response.text, [/^\s*(?:1\.)?\s*\*?Settlement Name\**?\s*:\s*(?:\"|\*\*?)?(.*?)(?:\"|\*\*?)?\s*$/im], 'Untitled Settlement');
        return processResponse(response, dna, settlementName);
    }

    if (type === ContentType.MagicItem) {
        const dna = generateMagicItemDNA();
        const response = await regularPromptAndGenerate(MAGIC_ITEM_DNA_DECODING_PROMPT, dna);
        const itemName = (method === GenerationMethod.Detailed && details.name) || extractName(response.text, [/^\s*(?:1\.)?\s*\*?Item Name\**?\s*:\s*(?:\"|\*\*?)?(.*?)(?:\"|\*\*?)?\s*$/im], 'Untitled Magic Item');
        return processResponse(response, dna, itemName);
    }

    throw new Error(`Unsupported content type for generation: ${type}`);
};

// --- New AI Tool Functions ---

export const createChat = (): Chat => {
    return ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: "You are a helpful and creative assistant for a tabletop roleplaying game master. Your name is 'Alchemist'. Provide concise, imaginative, and useful answers to help them build their world.",
        },
    });
};

export const editImageWithGemini = async (base64Data: string, mimeType: string, prompt: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    { inlineData: { data: base64Data, mimeType: mimeType } },
                    { text: prompt },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                return part.inlineData.data;
            }
        }
        throw new Error("No image data found in the response.");
    } catch (error) {
        handleGeminiError(error, "image editing");
    }
};

export const askDeepThought = async (prompt: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: prompt,
            config: {
                systemInstruction: "You are a 'Deep Thought' AI. Your purpose is to analyze complex, multi-faceted problems and provide profound, insightful, and comprehensive answers. You should reason deeply, consider multiple perspectives, and structure your response for maximum clarity and impact.",
                thinkingConfig: { thinkingBudget: 32768 },
            },
        });

        if (!response.text) {
            handleBlockedResponse(response);
        }
        return response.text;
    } catch (error) {
        handleGeminiError(error, "deep thought query");
    }
};
