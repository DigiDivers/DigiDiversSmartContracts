import { MOBILE_ADDR_BASE64, getDigiRating } from '../utils';
import { checkLevelDigi } from './checkLevelDigi';
import { fetchDigiByNftAddress } from './fetchDigiByNftAddress';
import { fetchDigisByWallet } from './fetchDigisByWallet';
import { fetchMaxDigiByWallet } from './fetchMaxDigiByWallet';


describe('fetch tests', () => {
    test('fetchMaxDigiByWallet', async () => {
        const maxDigi = await fetchMaxDigiByWallet(MOBILE_ADDR_BASE64);
        expect(maxDigi.totalDigis).toBe(2);
        // console.log(maxDigi);
    });

    test('fetchDigisByWallet', async () => {
        const digis = await fetchDigisByWallet(MOBILE_ADDR_BASE64);
        // console.log(digis[0].json?.attributes);
        // console.log(digis.length);
    });

    test('checkLevelDigi', async () => {
        const levelDigi = await checkLevelDigi(MOBILE_ADDR_BASE64);
        expect(levelDigi).toBe(2);
    });

    test('fetchDigiByNftAddress', async () => {
        const digi = await fetchDigiByNftAddress('6bnmaF3zyJ1k6jfykezrj7odZRbyBhwa1kidYYiB1Uxj');
        const rating = getDigiRating(digi);
        // console.log(`rating: ${rating}`);
    });
});
