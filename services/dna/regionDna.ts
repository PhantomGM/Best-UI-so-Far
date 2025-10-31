import { randInt } from '../utils';

/**
 * Generates a DNA string for a Region.
 * Based on the spec: RT, TF, CU, PO, WA, EN, HI, TH, IC, LM, each with a value from 1-10.
 * Example: RT5,TF2,CU10,PO1,WA8,EN3,HI7,TH9,IC4,LM6
 */
export const generateRegionDNA = (): string => {
    const regionGenes = ["RT", "TF", "CU", "PO", "WA", "EN", "HI", "TH", "IC", "LM"];
    const dnaString = regionGenes.map(gene => {
        const value = randInt(1, 10);
        return `${gene}${value}`;
    }).join(',');

    return dnaString;
};
