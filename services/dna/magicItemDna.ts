import { randInt, randFloat, pickOne, shuffle } from '../utils';

// --- Magic Item DNA Generation ---
export const generateMagicItemDNA = (): string => {
    const power = randInt(1, 9);
    const complexity = randInt(1, 9);
    const rarity = randInt(1, 9);
    const coreScales = `MAGICITEM{v1.0[P:${power}/M:${complexity}/R:${rarity}]}`;
    
    const relationships = `<AP:${randFloat(0.5, 1.5)},MR:${randFloat(0.5, 1.5)},RE:${randFloat(0.5, 1.5)}>`;

    const itemTypes = ['#weapon', '#armor', '#wand', '#ring', '#amulet', '#potion', '#wondrous', '#artifact'];
    const itemType = pickOne(itemTypes);

    const generateBlock = (keys: string[]): string => `{${keys.map(k => `${k.toUpperCase()}${randInt(1,99)}`).join(',')}}`;

    const phy = `PHY${generateBlock(['A','M','D','Q'])}`;
    const mag = `MAG${generateBlock(['P','E','S','A','C'])}`;
    const his = `HIS${generateBlock(['A','O','C','U'])}`;
    const lor = `LOR${generateBlock(['S','R','T','F'])}`;
    const attune = `ATTUNE${generateBlock(['R','C','E','I'])}`;

    const generateChain = (prefix: string, keys: string[]) => `${prefix}:${shuffle(keys).slice(0,3).join('>')}`;
    const chain = `CHAIN{${generateChain('USE', ['P','E','C'])};${generateChain('MAG', ['S','A','C'])};${generateChain('ATT', ['R','C','I'])}}`;

    const generateEvoParam = (param: string) => {
        const patterns = ['STABLE', 'RISING', 'DECAYING', 'ACCELERATING', 'FLUCTUATING', 'UNSTABLE', 'DORMANT'];
        const pattern = pickOne(patterns);
        const values = Array.from({length: 4}, () => randInt(1, 99)).join(',');
        return `${param}:${pattern}[${values}]`;
    };
    const evo = `EVO{${generateEvoParam('P')};${generateEvoParam('M')}}`;

    return `${coreScales}${relationships}${itemType}\n${phy}\n${mag}\n${his}\n${lor}\n${attune}\n${chain}\n${evo}`;
};
