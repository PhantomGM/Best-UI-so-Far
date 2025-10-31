import { randInt, pickOne, shuffle } from '../utils';

// --- World DNA Generation ---
const generateWorldFactionDNA = (): string => {
    const ty = randInt(1, 6);
    const sc = randInt(1, 5);
    const gl = randInt(1, 5);
    
    const valuePairs = shuffle([[1, 2], [3, 4], [5, 6]]);
    const vl = valuePairs.map(pair => pickOne(pair));
    
    const flawMap: { [key: number]: number } = { 1: 1, 2: 6, 3: 2, 4: 4, 5: 3, 6: 5 };
    const highestValue = vl.reduce((max, v) => v > max ? v : max, 0);
    const fl = flawMap[highestValue] || 1;

    const allLimits = [1, 2, 3, 4, 5];
    const numLimits = randInt(0, 2);
    const lm = shuffle(allLimits).slice(0, numLimits);

    return `{TY:${ty},SC:${sc},GL:${gl},VL:[${vl.join(',')}],FL:${fl},LM:[${lm.join(',')}]}`;
};

export const generateWorldDNA = (numRegions: number, numFactions: number): string => {
    const t = randInt(1, 10);
    const m = randInt(1, 10);
    const a = randInt(1, 10);
    const r = numRegions;

    const cosmo = `COSMO{CM:${randInt(1,5)},MD:${randInt(1,5)},AL:${randInt(1,5)},FF:${randInt(1,5)}}`;
    const econ = `ECON{PS:${randInt(1,5)},WD:${randInt(1,4)},TN:${randInt(1,4)},TM:${randInt(1,5)}}`;
    const mag = `MAG{SRC:${randInt(1,5)},PRN:${randInt(1,4)},CST:${randInt(1,5)},LMT:${randInt(1,5)},ACQ:${randInt(1,5)},LAW:${randInt(1,5)}}`;
    
    const factions = Array.from({ length: numFactions }, generateWorldFactionDNA).join(',');
    const fact = `FACT[${factions}]`;

    const env = `ENV{GEO:${randInt(1,7)},CLM:${randInt(1,5)},RES:${randInt(1,4)},ANO:${randInt(1,5)}}`;
    const soc = `SOC{GOV:${randInt(1,6)},CLS:${randInt(1,5)},VAL:${randInt(1,6)},LIF:${randInt(1,5)},TEC:${randInt(1,5)},MAG:${randInt(1,5)},ART:${randInt(1,5)},REL:${randInt(1,5)},FAM:${randInt(1,5)},GEN:${randInt(1,5)},MOR:${randInt(1,5)},LAW:${randInt(1,5)}}`;
    const con = `CON{TYP:${randInt(1,5)},SCL:${randInt(1,4)},AGE:${randInt(1,3)}}`;
    const his = `HIS{EVT:${randInt(1,6)},KNG:${randInt(1,4)},LGC:${randInt(1,5)}}`;

    const regions = Array.from({ length: numRegions }, () => `{TER:${randInt(1,7)},SOC:${randInt(1,6)},ECO:${randInt(1,5)},LMK:${randInt(1,5)}}`).join(',');
    const reg = `REG[${regions}]`;

    const critNat = randInt(1, 6);
    const crit = `CRIT{DOM:${randInt(1,5)},NAT:${critNat},IMM:${randInt(1,4)}}`;
    const chain = `CHAIN{TRG:${critNat},ACT:${randInt(1,5)},CNS:${randInt(1,5)}}`;
    
    const traitMap = [ 'SOC.GOV', 'ECON.PS', 'MAG.LAW', 'CON.TYP', 'SOC.VAL', 'TEC.ETHOS' ];
    const evo = `EVO{TRT:${randInt(1,traitMap.length)},PTN:${randInt(1,4)}}`;
    const trend = `TREND{TRT:${randInt(1,traitMap.length)},DIR:${randInt(1,3)}}`;

    return `T:${t},M:${m},A:${a},R:${r},${cosmo},${econ},${mag},${fact},${env},${soc},${con},${his},${reg},${crit},${chain},${evo},${trend}`;
};
