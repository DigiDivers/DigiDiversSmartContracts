import { NftWithToken, UploadMetadataInput } from '@metaplex-foundation/js';
import { METAPLEX } from '../utils';

/**
 * Add XP to an NFT
 * @param nft NFT to add XP to
 * @param xp XP to add
 * @returns NFT Metadata with the new XP
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
