import { NftWithToken, UploadMetadataInput } from '@metaplex-foundation/js';
import { uploadImage } from '../create';
import { METAPLEX, addedAttributeArray } from '../utils';

/**
 * Update NFT Level
 * @param nft NFT to update
 * @param newLevel New level of the NFT
 * @param newImage New image of the NFT
 * @returns NFT with the new level */
export async function updateNft(
    nft: NftWithToken,
    newLevel?: number,
    newImage?: string,
    newExperience?: number,
    newRating?: number
): Promise<NftWithToken> {
    console.log(`old nft metadata: `, nft.json);

    // update image if new image is provided
    let newMetadata: UploadMetadataInput | undefined = undefined;
    if (newImage !== undefined) {
        const imgUri = await uploadImage('assets/', newImage);
        newMetadata = {
            ...nft.json,
            image: imgUri,
        };
    }
    // update level if new level is provided
    if (newLevel !== undefined) {
        newMetadata = {
            ...nft.json,
            attributes: addedAttributeArray(nft, {
                trait_type: 'Level',
                value: newLevel.toString(),
            }) as any,
        };
    }
    // update experience if new experience is provided
    if (newExperience !== undefined) {
        newMetadata = {
            ...nft.json,
            attributes: addedAttributeArray(nft, {
                trait_type: 'Experience',
                value: newExperience.toString(),
            }) as any,
        };
    }

    // update rating if new rating is provided
    if (newRating !== undefined) {
        newMetadata = {
            ...nft.json,
            attributes: addedAttributeArray(nft, {
                trait_type: 'Rating',
                value: newRating.toString(),
            }) as any,
        };
    }

    if (newMetadata !== undefined) {
        const { uri: newUri } = await METAPLEX.nfts().uploadMetadata(newMetadata);
        await METAPLEX.nfts().update({
            nftOrSft: nft,
            uri: newUri,
        });
        console.log(
            `Minted NFT: https://explorer.solana.com/address/${nft.address}?cluster=devnet`
        );
    } else {
        throw new Error('No new metadata provided');
    }

    console.log(`new nft metadata: `, newMetadata);

    return nft;
}
