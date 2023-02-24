import { Connection, Keypair, PublicKey, clusterApiUrl } from '@solana/web3.js';
import {
	Metaplex,
	keypairIdentity,
	bundlrStorage,
	toMetaplexFile,
	toBigNumber,
	UploadMetadataInput,
	NftWithToken,
} from '@metaplex-foundation/js';
import * as fs from 'fs';
import { secret } from '../assets';
import { freezeAccount } from '@solana/spl-token';
import { mintNft, uploadImage, uploadMetadata } from '../create/helper';



const DEVNET_ENDPOINT = clusterApiUrl('devnet');
const connection = new Connection(DEVNET_ENDPOINT);
const WALLET = Keypair.fromSecretKey(new Uint8Array(secret));

const METAPLEX = Metaplex.make(connection)
	.use(keypairIdentity(WALLET))
	.use(
		bundlrStorage({
			address: 'https://devnet.bundlr.network',
			providerUrl: DEVNET_ENDPOINT,
			timeout: 60000,
		})
	);


/**
 * 
 * @param userAccount User account to freeze
 * @returns NFT with the new level
 */
export async function freezeUserAccount(
	userAccount: PublicKey
): Promise<void> {
	await freezeAccount(connection, WALLET, userAccount, userAccount, WALLET.publicKey);
}

/** Create Level X NFT
 * @param level Level of the NFT
 * @param image Image of the NFT
 * @returns NFT with the new level */
export async function createLevelXNft(
	level: number,
	image: string
): Promise<NftWithToken> {
	const attributes = [
		{ trait_type: 'Level', value: level.toString()}, 
		{ trait_type: 'Experience', value: '0'}
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
	await freezeUserAccount(mintedNFT.address);

	return mintedNFT
	
}

/**
 * 
 * @param nft NFT to transfer
 * @param recipient Recipient of the NFT
 * @returns NFT new information
 */
export async function transferNft(
	nft: NftWithToken,
	recipient: PublicKey
): Promise<NftWithToken> {
	await METAPLEX.nfts().transfer({
		nftOrSft: nft,
		fromOwner: WALLET.publicKey,
		toOwner: recipient,
	});
	console.log(
		`Transfered NFT: https://explorer.solana.com/address/${nft.address}?cluster=devnet`
	);
	return nft;
}

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
	newExperience?: number
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
			attributes: [{ trait_type: 'Level', value: newLevel.toString() }],
		};
	}
	// update experience if new experience is provided
	if (newExperience !== undefined) {
		newMetadata = {
			...nft.json,
			attributes: [{ trait_type: 'Experience', value: newExperience.toString() }]
		};
	}

	if (newMetadata !== undefined) {
		const { uri: newUri } = await METAPLEX.nfts().uploadMetadata(newMetadata);
		await METAPLEX.nfts().update({
			nftOrSft: nft,
			uri: newUri,
		});
		console.log(`Minted NFT: https://explorer.solana.com/address/${nft.address}?cluster=devnet`);
	} else {
		throw new Error('No new metadata provided');
	}

	console.log(`new nft metadata: `, newMetadata);

	return nft
}