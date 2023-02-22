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

async function createLevelXNft(
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

// update NFT
async function updateNftLevel(nft: NftWithToken, newLevel: number) {
	console.log(`old nft metadata: `, nft.json);

	const newMetadata: UploadMetadataInput = {
		...nft.json,
		image: 'https://arweave.net/8b6yTDi8bX0bB1w9L9Rgjz-HUUbUJ9ijn_eJ30ThL8k', // TODO: update function to take in an image
		attributes: [{ trait_type: 'Level', value: newLevel.toString() }],
	};
	const { uri: newUri } = await METAPLEX.nfts().uploadMetadata(newMetadata);

	console.log(`new nft metadata: `, newMetadata);

	// console.log(`   New Metadata URI:`, newUri);
	await METAPLEX.nfts().update({
		nftOrSft: nft,
		uri: newUri,
	});
	console.log(
		`Minted NFT: https://explorer.solana.com/address/${nft.address}?cluster=devnet`
	);
}

// upload NFT metadata
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

async function mintNft(
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
	console.log(
		`   Minted NFT: https://explorer.solana.com/address/${nft.address}?cluster=devnet`
	);
	return nft;
}

async function main() {
	// test create function
	let nft: NftWithToken = await createLevelXNft(1, '1.png');
	// test update function
	await updateNftLevel(nft, 2);
}

main();
