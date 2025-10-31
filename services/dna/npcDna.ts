import { randInt, pickOne } from '../utils';

// --- NPC DNA Generation ---
export const generateNpcDNA = (): string => {
    const lnc = randInt(1, 9);
    const gne = randInt(1, 9);

    const pairedTraitPairs = [
        ['B','C'], ['R','O'], ['L','T'], ['F','I'], ['S','X'], ['P','M'], ['D','U'], 
        ['G','H'], ['Y','W'], ['E','A'], ['N','V'], ['K','Q'], ['Z','B'], ['O','P'], 
        ['C','H'], ['R','L'], ['A','S'], ['D','A'], ['A','H'], ['I','C']
    ];
    
    const pairedTraits = pairedTraitPairs.map(pair => {
        const trait = pickOne(pair);
        const score = randInt(1, 9);
        const intensity = randInt(1, 5);
        return `${score}${trait}${intensity}`;
    }).join(',');

    const unpairedTraitKeys = ['H', 'C', 'K', 'G', 'L', 'J', 'M', 'F', 'E', 'B', 'U', 'S', 'I', 'R', 'T', 'A', 'D', 'V', 'Y', 'X'];
    
    const unpairedTraits = unpairedTraitKeys.map(trait => {
        const score = randInt(1, 9);
        return `${trait}${score}`;
    }).join(',');

    return `(${lnc}/${gne}) ${pairedTraits} - ${unpairedTraits}`;
}
