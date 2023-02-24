import { NftWithToken, UploadMetadataInput } from '@metaplex-foundation/js';
import { uploadImage } from '../create';
import { METAPLEX } from '../utils';

/**
 * Update NFT Level
 * @param nft: NFT to update
 * @param newLevel: New level of the NFT
 * @param newImage: New image of the NFT
 * @returns NFT with the new level
 */
export async function updateNftLevel(
    nft: NftWithToken,
    newLevel: number,
    newImage?: string
): Promise<NftWithToken> {
    console.log(`old nft metadata: `, nft.json);

    let newMetadata: UploadMetadataInput;
    if (newImage !== undefined) {
        const imgUri = await uploadImage('assets/', newImage);
        newMetadata = {
            ...nft.json,
            image: imgUri,
            attributes: [{ trait_type: 'Level', value: newLevel.toString() }],
        };
    } else {
        newMetadata = {
            ...nft.json,
            attributes: [{ trait_type: 'Level', value: newLevel.toString() }],
        };
    }
    const { uri: newUri } = await METAPLEX.nfts().uploadMetadata(newMetadata);

    console.log(`new nft metadata: `, newMetadata);

    await METAPLEX.nfts().update({
        nftOrSft: nft,
        uri: newUri,
    });
    console.log(`Minted NFT: https://explorer.solana.com/address/${nft.address}?cluster=devnet`);
    return nft;
}
