import { Nft } from '@metaplex-foundation/js';
import { fetchDigisByWallet } from './fetchDigisByWallet';

/**
 * Checks the level of the highest leveled DIGI NFT owned by the specified wallet address
 * @param ownerAddress - base64 address of the wallet that owns the NFTs
 * @returns the highest level of the DIGI NFTs owned by the wallet as a number, or 0 if no DIGI NFTs are owned or none have a level
 */
export const checkLevelDigi = async (ownerAddress: string): Promise<number> => {
    const nfts: Nft[] = await fetchDigisByWallet(ownerAddress);

    let highestLevel = 0;
    for (const digi of nfts) {
        const level = digi.json?.attributes?.find((att) => att.trait_type === 'Level')?.value;
        if (Number(level) > highestLevel) {
            highestLevel = Number(level);
        }
    }
    return highestLevel || 0;
};
