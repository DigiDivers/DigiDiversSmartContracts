import { MOBILE_ADDR_BASE64 } from '../utils';
import { checkLevelDigi } from './checkLevelDigi';
import { fetchDigisByWallet } from './fetchDigisByWallet';
import { fetchMaxDigiByWallet } from './fetchMaxDigiByWallet';

describe('fetch tests', () => {
    test('fetchMaxDigiByWallet', async () => {
        const maxDigi = await fetchMaxDigiByWallet(MOBILE_ADDR_BASE64);
        expect(maxDigi.totalDigis).toBe(2);
        console.log(maxDigi);
    });

    test('fetchDigisByWallet', async () => {
        const digis = await fetchDigisByWallet(MOBILE_ADDR_BASE64);
        console.log(digis[0].json?.attributes);
        console.log(digis.length);
    });

    test('checkLevelDigi', async () => {
        const levelDigi = await checkLevelDigi(MOBILE_ADDR_BASE64);
        expect(levelDigi).toBe(2);
    });
});
