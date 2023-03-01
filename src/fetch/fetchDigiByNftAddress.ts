import { FindNftByMintInput, NftWithToken, PublicKey } from '@metaplex-foundation/js';
import { METAPLEX } from '../utils';

/**
 * This function fetches an NFT by its mint address.
 *
 * @param digiMintAddress - The address of the NFT's mint. Found on the explorer under overview > address.
 * @returns A Promise of the NFT object.
 */
export const fetchDigiByNftAddress = async (digiMintAddress: string): Promise<NftWithToken> => {
    const findInput: FindNftByMintInput = {
        mintAddress: new PublicKey(digiMintAddress),
    };
    const nft = await METAPLEX.nfts().findByMint(findInput);

    // console.log(`nft: `, nft);
    return nft as NftWithToken;
};
