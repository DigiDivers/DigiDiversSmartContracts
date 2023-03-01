import { NftWithToken, UploadMetadataInput } from '@metaplex-foundation/js';
import {
    METAPLEX,
    REQUIRED_EXPERIENCE,
    getDigiExperience,
    getDigiLevel,
    getDigiRating,
} from '../utils';

/**
 * Add XP to an NFT
 * @param nft NFT to add XP to
 * @param xp XP to add
 * @returns NFT Metadata with the new XP
 */
export async function addXP(nft: NftWithToken, xp: number): Promise<NftWithToken> {
    if (xp < 0) throw new Error('XP cannot be negative');
    if (nft.json?.attributes === undefined) throw new Error('NFT does not have attributes');

    console.log(`old nft metadata: `, nft.json);

    let newMetadata: UploadMetadataInput;
    const newExperience = getDigiExperience(nft) + xp;
    const currLevel = getDigiLevel(nft);
    if (newExperience >= REQUIRED_EXPERIENCE) {
        newMetadata = {
            ...nft.json,
            attributes: [
                {
                    trait_type: 'Experience',
                    value: (newExperience % REQUIRED_EXPERIENCE).toString(),
                },
                { trait_type: 'Level', value: (currLevel + 1).toString() },
                { trait_type: 'Rating', value: getDigiRating(nft).toString() },
            ],
        };
    } else {
        newMetadata = {
            ...nft.json,
            attributes: [
                { trait_type: 'Experience', value: newExperience.toString() },
                { trait_type: 'Level', value: currLevel.toString() },
                { trait_type: 'Rating', value: getDigiRating(nft).toString() },
            ],
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
