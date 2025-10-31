import { randInt } from '../utils';

// --- Travel DNA Generation ---
export const generateTravelDNA = (): string => {
    const d = randInt(1, 5); // Danger Level
    const s = randInt(1, 6); // Discovery Frequency
    const sf = randInt(0, 5); // Special Factor
    return `TRAVEL{${d}-${s}-${sf}}`;
};
