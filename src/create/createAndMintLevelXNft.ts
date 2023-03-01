import { NftWithToken } from '@metaplex-foundation/js';
import { mintNft, uploadImage, uploadMetadata } from './helper';
import { WALLET } from '../utils';
import { freezeUserAccount } from '../update';

/** Create Level X NFT
 * @param level Level of the NFT
 * @param image Image of the NFT
 * @returns NFT with the new level */
export async function createAndMintLevelXNft(level: number, image: string): Promise<NftWithToken> {
    const attributes = [
        { trait_type: 'Level', value: level.toString() },
        { trait_type: 'Experience', value: '0' },
        { trait_type: 'Rating', value: '900' },
    ];

    const CONFIG = {
        uploadPath: 'assets/',
        imgFileName: image,
        imgType: 'image/png',
        imgName: 'Level Image',
        tokenStandard: 4,
        description: 'Level Avatar Digi Divers',
        attributes: attributes,
        sellerFeeBasisPoints: 500, //500 bp = 5%
        symbol: 'DIGI',
        creators: [{ address: WALLET.publicKey, share: 100 }],
    };

    // Step 1 - Upload Image
    const imgUri = await uploadImage(CONFIG.uploadPath, CONFIG.imgFileName);

    // Step 2 - Upload Metadata
    const metadataUri = await uploadMetadata(
        imgUri,
        CONFIG.imgType,
        CONFIG.imgName,
        CONFIG.description,
        CONFIG.attributes
    );

    // Step 3 - Create NFT
    const mintedNFT = await mintNft(
        metadataUri,
        CONFIG.imgName,
        CONFIG.sellerFeeBasisPoints,
        CONFIG.symbol,
        CONFIG.creators
    );

    // Step 4 - Set Freeze Authority Address
    // await freezeUserAccount(mintedNFT.address);

    return mintedNFT;
}
