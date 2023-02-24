import { NftWithToken, toBigNumber, toMetaplexFile } from '@metaplex-foundation/js';
import { PublicKey } from '@solana/web3.js';
import * as fs from 'fs';
import { METAPLEX } from '../utils';

/**
 * Upload Image to Arweave
 * @param filePath: Path of the image
 * @param fileName: Name of the image
 * @returns URI of the image
 */
export async function uploadImage(filePath: string, fileName: string): Promise<string> {
    console.log(`Step 1 - Uploading Image`);
    const imgBuffer = fs.readFileSync(filePath + fileName);
    const imgMetaplexFile = toMetaplexFile(imgBuffer, fileName);
    const imgUri = await METAPLEX.storage().upload(imgMetaplexFile);
    console.log(`   Image URI:`, imgUri);
    return imgUri;
}

/**
 * Upload Metadata
 * @param imgUri: URI of the image
 * @param imgType: Type of the image
 * @param nftName: Name of the NFT
 * @param description: Description of the NFT
 * @param attributes: Array of attributes
 * @returns URI of the metadata
 */
export async function uploadMetadata(
    imgUri: string,
    imgType: string,
    nftName: string,
    description: string,
    attributes: { trait_type: string; value: string }[]
) {
    console.log(`Step 2 - Uploading Metadata`);
    const { uri } = await METAPLEX.nfts().uploadMetadata({
        name: nftName,
        description: description,
        image: imgUri,
        attributes: attributes,
        properties: {
            files: [
                {
                    type: imgType,
                    uri: imgUri,
                },
            ],
        },
    });
    console.log('   Metadata URI:', uri);
    return uri;
}

/**
 * Mint NFT
 * @param metadataUri: URI of the metadata
 * @param name: Name of the NFT
 * @param sellerFee: Seller fee in basis points
 * @param symbol: Symbol of the NFT
 * @param creators: Array of creators
 * @returns NftWithToken
 */
export async function mintNft(
    metadataUri: string,
    name: string,
    sellerFee: number,
    symbol: string,
    creators: { address: PublicKey; share: number }[]
): Promise<NftWithToken> {
    console.log(`Step 3 - Minting NFT`);
    const { nft } = await METAPLEX.nfts().create(
        {
            uri: metadataUri,
            name: name,
            sellerFeeBasisPoints: sellerFee,
            symbol: symbol,
            creators: creators,
            maxSupply: toBigNumber(1),
        },
        { commitment: 'finalized' }
    );
    console.log(`   Success!🎉`);
    console.log(`   Minted NFT: https://explorer.solana.com/address/${nft.address}?cluster=devnet`);
    return nft;
}
