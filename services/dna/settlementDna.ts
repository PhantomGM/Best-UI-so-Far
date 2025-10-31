import { randInt, pickOne, shuffle } from '../utils';

// --- Settlement DNA Generation ---
export const generateSettlementDNA = (): string => {
    const size = randInt(1, 9);
    const population = randInt(1, 9);
    const importance = randInt(1, 9);
    const coreScales = `SETTLEMENT{v1.0[S:${size}/P:${population}/I:${importance}]}`;

    const settlementTypes = ['#fortress', '#village', '#town', '#city', '#trading_post', '#mining_camp', '#port', '#capital', '#ruin'];
    const settlementType = pickOne(settlementTypes);

    const generateBlock = (keys: string[]): string => `{${keys.map(k => `${k.toUpperCase()}${randInt(1,99)}`).join(',')}}`;

    const struct = `STRUCT${generateBlock(['S','A','W','F'])}`;
    const pop = `POP${generateBlock(['S','H','C','M','L'])}`;
    const econ = `ECON${generateBlock(['M','S','I','R','G'])}`;
    const pol = `POL${generateBlock(['G','C','F','S'])}`;
    const poi = `POI${generateBlock(['T','S','L','H'])}`;
    const proxi = `PROXI${generateBlock(['W','T','C','R'])}`;

    const generateChain = (prefix: string, keys: string[]) => `${prefix}:${shuffle(keys).slice(0,3).join('>')}`;
    const allPolKeys = ['G','C','F','S'];
    const allEconKeys = ['M','S','I','R','G'];
    const allPopKeys = ['S','H','C','M','L'];
    const chain = `CHAIN{${generateChain('POL', allPolKeys)};${generateChain('ECON', allEconKeys)};${generateChain('POP', allPopKeys)}}`;
    
    const generateEvoParam = (param: string) => {
        const patterns = ['STABLE', 'RISING', 'DECLINING', 'FLUCTUATING', 'TRANSFORMING', 'STAGNANT'];
        const pattern = pickOne(patterns);
        const values = Array.from({length: 4}, () => randInt(10, 95)).sort((a,b) => pattern === 'RISING' ? a - b : pattern === 'DESCENDING' ? b - a : 0).join(',');
        return `${param}:${pattern}[${values}]`;
    };
    const evo = `EVO{${generateEvoParam('S')};${generateEvoParam('P')};${generateEvoParam('I')}}`;

    return `${coreScales}${settlementType}\n${struct}\n${pop}\n${econ}\n${pol}\n${poi}\n${proxi}\n${chain}\n${evo}`;
};
