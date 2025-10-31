
export interface World {
    id: string;
    name: string;
    dna: string;
    profile: string;
    groundingSources?: any[];
}

export interface Region {
    id: string;
    name: string;
    dna: string;
    profile: string;
    groundingSources?: any[];
}

export interface Faction {
    id: string;
    name: string;
    dna: string;
    profile: string;
    groundingSources?: any[];
}

export interface NPC {
    id: string;
    name: string;
    dna: string;
    profile: string;
    groundingSources?: any[];
}

export interface Quest {
    id:string;
    name: string;
    dna: string;
    profile: string;
    groundingSources?: any[];
}

export interface Settlement {
    id: string;
    name: string;
    dna: string;
    profile: string;
    groundingSources?: any[];
}

export interface MagicItem {
    id: string;
    name: string;
    dna: string;
    profile: string;
    groundingSources?: any[];
}

export interface Travel {
    id: string;
    name: string;
    dna: string;
    profile: string;
    groundingSources?: any[];
}

export type ContentItem = World | Region | Faction | NPC | Quest | Settlement | MagicItem | Travel;

export enum ContentType {
    World = "World",
    Region = "Region",
    NPC = "NPC",
    Faction = "Faction",
    Quest = "Quest",
    Settlement = "Settlement",
    MagicItem = "Magic Item",
    Travel = "Travel"
}

export interface Link {
    source: string; // id of the source item
    target: string; // id of the target item
    relationship?: string; // Optional description of the link
}

export interface Project {
    name: string;
    worlds: World[];
    regions: Region[];
    npcs: NPC[];
    factions: Faction[];
    quests: Quest[];
    settlements: Settlement[];
    magicItems: MagicItem[];
    travels: Travel[];
    links: Link[];
}

export enum GenerationMethod {
    Random = "Fully Random",
    Guided = "Narrative Guidance",
    Detailed = "Highly Detailed",
    FromFile = "Context from File"
}

// Form Data Types for Detailed Generation
export interface WorldFormData {
    genreOrMood?: string;
    coreTheme?: string;
    inspirationalMedia?: string;
    magicAndTechFlavor?: string;
    geographicalInspirations?: string;
    culturalInfluence?: string;
    numRegions?: string;
    factionConflict?: string;
    knownDetails?: string;
    additionalNotes?: string;
    useSearchGrounding?: boolean;
}

export interface RegionFormData {
    name?: string;
    dominantFeature?: string;
    climate?: string;
    culture?: string;
    majorConflict?: string;
    mainExports?: string;
    historicalTidbit?: string;
    primaryThreat?: string;
    keyLandmark?: string;
    magicLevel?: string;
    extraContext?: string;
    useSearchGrounding?: boolean;
}

export interface NpcFormData {
    name?: string;
    role?: string;
    archetype?: string;
    race?: string;
    age?: string;
    pronouns?: string;
    appearanceNotes?: string;
    quirk?: string;
    backstoryNotes?: string;
    bdi?: string; // Beliefs/Desires/Intentions
    secrets?: string;
    possessions?: string;
    alignment?: string;
    highTraits?: string;
    lowTraits?: string;
    extraContext?: string;
}

export interface FactionFormData {
    name?: string;
    goal?: string;
    methods?: string;
    style?: string;
    perception?: string;
    ideology?: string;
    strengths?: string;
    weaknesses?: string;
    baseOfOperations?: string;
    highTraits?: string;
    lowTraits?: string;
    extraContext?: string;
}

export interface QuestFormData {
    title?: string;
    objective?: string;
    obstacle?: string;
    giver?: string;
    location?: string;
    tone?: string;
    reward?: string;
    twist?: string;
    engagement?: string;
    difficulty?: string;
    extraContext?: string;
}

export interface MagicItemFormData {
    name?: string;
    type?: string;
    effect?: string;
    appearance?: string;
    origin?: string;
    quirk?: string;
    dnaFocus?: string;
    extraContext?: string;
}

export interface SettlementFormData {
    name?: string;
    type?: string;
    inhabitants?: string;
    landmark?: string;
    atmosphere?: string;
    conflict?: string;
    secret?: string;
    dnaFocus?: string;
    extraContext?: string;
}

export interface TravelFormData {
    regionName?: string;
    terrain?: string;
    startPoint?: string;
    endPoint?: string;
    purpose?: string;
    dangers?: string;
    preference?: string;
    extraContext?: string;
}