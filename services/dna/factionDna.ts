import { randInt, pickOne } from '../utils';

// --- Faction DNA v2 Generation ---
export const generateFactionDNAString = (): string => {
    const dna: { [key: string]: number | string } = {};
    dna['T'] = randInt(1, 7);
    dna['G'] = `0${randInt(1, 12)}`.slice(-2);
    dna['M'] = randInt(1, 8);
    dna['P'] = randInt(1, 8);
    dna['S'] = randInt(1, 6);
    dna['O'] = randInt(1, 7);
    dna['N'] = pickOne([74, 78, 84, 90, 92, 99]);
    dna['L'] = `0${randInt(1, 10)}`.slice(-2);
    dna['F'] = randInt(1, 6);
    dna['D'] = randInt(1, 6);
    dna['A'] = randInt(1, 9);
    dna['SC'] = randInt(1, 5);
    dna['MZ'] = randInt(1, 6);
    dna['X'] = randInt(1, 6);
    
    return Object.entries(dna).map(([key, value]) => `${key}${value}`).join('-');
};
