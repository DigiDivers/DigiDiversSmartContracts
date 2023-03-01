import { NftWithToken } from '@metaplex-foundation/js';
import { fetchDigiByNftAddress } from '../fetch';
import { addXP } from './addXP';
import { getDigiExperience, getDigiLevel } from '../utils';

const TEST_NFT_ADDR = '2BmyvNd6UAXfp9BgQ9c7z43nfrypgGw7tHeDoXUjmi1E'; // MUST MINT A NEW NFT FOR EACH TEST

jest.setTimeout(30000);

describe('update tests', () => {
    test('check that XP is currently 0', async () => {
        const nft: NftWithToken = await fetchDigiByNftAddress(TEST_NFT_ADDR);
        expect(getDigiExperience(nft)).toBe(0);
    });

    test('addXP without level up', async () => {
        let nft: NftWithToken = await fetchDigiByNftAddress(TEST_NFT_ADDR);
        await addXP(nft, 5);
        nft = await fetchDigiByNftAddress(TEST_NFT_ADDR);

        expect(getDigiExperience(nft)).toBe(5);
        expect(getDigiLevel(nft)).toBe(1);
    });

    test('addXP with level up', async () => {
        let nft: NftWithToken = await fetchDigiByNftAddress(TEST_NFT_ADDR);
        await addXP(nft, 10);
        nft = await fetchDigiByNftAddress(TEST_NFT_ADDR);

        expect(getDigiExperience(nft)).toBe(5);
        expect(getDigiLevel(nft)).toBe(2);
    });
});
