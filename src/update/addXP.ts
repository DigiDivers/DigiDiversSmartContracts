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
export async function addXP(
    nft: NftWithToken,
    xp: number,
): Promise<NftWithToken> {
    if (xp < 0)
        throw new Error('XP cannot be negative');
    if (nft.json?.attributes === undefined)
        throw new Error('NFT does not have attributes');

    console.log(`old nft metadata: `, nft.json);

    let newMetadata: UploadMetadataInput;
    if (xp !== undefined) {
        newMetadata = {
            ...nft.json,
            attributes: [{ trait_type: 'Experience', value: xp.toString() }],
        };
    } else {
        newMetadata = {
            ...nft.json,
        };
    }

    const { uri: newUri } = await METAPLEX.nfts().uploadMetadata(newMetadata);

    console.log(`new nft metadata: `, newMetadata);

    await METAPLEX.nfts().update({
        nftOrSft: nft,
        uri: newUri,
    });

    return nft;
}
