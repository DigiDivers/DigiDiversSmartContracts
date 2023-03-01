import { NftWithToken, UploadMetadataInput } from '@metaplex-foundation/js';
import { uploadImage } from '../create';
import { METAPLEX, addedAttributeArray } from '../utils';

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
    const newAttributes = addedAttributeArray(nft, {
        trait_type: 'Level',
        value: newLevel.toString(),
    });
    if (newImage !== undefined) {
        const imgUri = await uploadImage('assets/', newImage);
        newMetadata = {
            ...nft.json,
            image: imgUri,
            attributes: newAttributes as any,
        };
    } else {
        newMetadata = {
            ...nft.json,
            attributes: newAttributes as any,
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
