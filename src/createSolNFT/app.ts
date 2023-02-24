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

/** Create Level X NFT
 * @param level Level of the NFT
 * @param image Image of the NFT
 * @returns NFT with the new level */
export async function createLevelXNft(
	level: number,
	image: string
): Promise<NftWithToken> {
	const CONFIG = {
		uploadPath: 'assets/',
		imgFileName: image,
		imgType: 'image/png',
		imgName: 'Level Image',
		tokenStandard: 4,
		description: 'Level Avatar Digi Divers',
		attributes: [{ trait_type: 'Level', value: level.toString() }],
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
	return await mintNft(
		metadataUri,
		CONFIG.imgName,
		CONFIG.sellerFeeBasisPoints,
		CONFIG.symbol,
		CONFIG.creators
	);
}

/**
 * Update NFT Level
 * @param nft NFT to update
 * @param newLevel New level of the NFT
 * @param newImage New image of the NFT
 * @returns NFT with the new level */
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
	console.log(
		`Minted NFT: https://explorer.solana.com/address/${nft.address}?cluster=devnet`
	);
	return nft
}

/**
 * Upload Image to Arweave 
 * @param filePath Path of the image
 * @param fileName Name of the image
 * @returns URI of the image */
async function uploadImage(
	filePath: string,
	fileName: string
): Promise<string> {
	console.log(`Step 1 - Uploading Image`);
	const imgBuffer = fs.readFileSync(filePath + fileName);
	const imgMetaplexFile = toMetaplexFile(imgBuffer, fileName);
	const imgUri = await METAPLEX.storage().upload(imgMetaplexFile);
	console.log(`   Image URI:`, imgUri);
	return imgUri;
}

/**
 * Upload Metadata
 * @param imgUri URI of the image
 * @param imgType Type of the image
 * @param nftName Name of the NFT
 * @param description Description of the NFT
 * @param attributes Array of attributes
 * @returns URI of the metadata */
async function uploadMetadata(
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
 * @returns NftWithToken */
async function mintNft(
	metadataUri: string,
	name: string,
	sellerFee: number,
	symbol: string,
	creators: { address: PublicKey; share: number }[]
): Promise<NftWithToken> {
	console.log(`Step 3 - Minting NFT`);
	// .create (input: CreateNftInput, options?: OperationOptions) 
	const { nft } = await METAPLEX.nfts().create(
		{
			uri: metadataUri,
			name: name,
			updateAuthority: WALLET,
			sellerFeeBasisPoints: sellerFee,
			tokenStandard: 4, // make it ProgrammableNonFungible 
			isMutable: true, // true metadata mutable
			symbol: symbol,
			creators: creators,
			maxSupply: toBigNumber(1),
		},
		{ commitment: 'finalized' }
	);
	console.log(`   Success!🎉`);
	console.log(
		`   Minted NFT: https://explorer.solana.com/address/${nft.address}?cluster=devnet`
	);
	return nft;
}