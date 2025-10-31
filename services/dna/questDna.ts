import { randInt, pickOne, shuffle } from '../utils';

// --- Quest DNA Generation ---
export const generateQuestDNA = (): string => {
    const difficulty = randInt(1, 9);
    const complexity = randInt(1, 9);
    const reward = randInt(1, 9);
    const coreScales = `QUEST{v1.0[${difficulty}/${complexity}/${reward}]}`;

    const questTypes = ['#infiltrate', '#investigate', '#heist', '#escort', '#retrieve', '#assassinate', '#explore', '#defend'];
    const questType = pickOne(questTypes);

    const generateBlock = (keys: string[]): string => `{${keys.map(k => `${k.toUpperCase()}:${randInt(1, 99)}`).join(',')}}`;
    
    const goal = `GOAL${generateBlock(['C','R','E','S','T','P','L','H'])}`;
    const obs = `OBS${generateBlock(['C','M','E','P','T','S','G','N'])}`;
    const rewardBlock = `REWARD${generateBlock(['M','I','K','R','S','P','L','A'])}`;
    const narr = `NARR${generateBlock(['T','C','P','M','H','R','I','A'])}`;
    const motiv = `MOTIV${generateBlock(['G','R','D','S','P','V','F','J'])}`;
    
    const engage = `ENGAGE{COMBAT:${randInt(1,99)},SOCIAL:${randInt(1,99)},EXPLORE:${randInt(1,99)},PUZZLE:${randInt(1,99)}}`;
    
    const generateChain = (prefix: string, keys: string[]) => `${prefix}:${shuffle(keys).slice(0,3).join('>')}`;
    const chain = `CHAIN{${generateChain('OBS', ['P','M','G','C','E','T','S','N'])};${generateChain('REWARD', ['K','I','A','M','R','S','P','L'])};${generateChain('MOTIV', ['D','J','P','G','R','S','V','F'])}}`;

    const generateEvo = (param: string) => {
        const patterns = ['RISING', 'DESCENDING', 'STABLE'];
        const pattern = pickOne(patterns);
        const values = Array.from({length: 4}, () => randInt(10, 95)).sort((a,b) => pattern === 'RISING' ? a - b : pattern === 'DESCENDING' ? b - a : 0).join(',');
        return `${param}:${pattern}[${values}]`;
    };
    const evo = `EVO{${generateEvo('D')};${generateEvo('C')};${generateEvo('R')}}`;

    return `${coreScales}${questType}\n${goal}\n${obs}\n${rewardBlock}\n${narr}\n${motiv}\n${engage}\n${chain}\n${evo}`;
};
