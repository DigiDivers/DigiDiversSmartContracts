import { Metaplex } from '@metaplex-foundation/js';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { toUint8Array } from 'js-base64';

const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

const getPublicKeyFromAddress = (address: string): PublicKey => {
	// address is base64 encoded
	const publicKeyByteArray = toUint8Array(address);
	return new PublicKey(publicKeyByteArray);
};

const base58Tobase64 = (address: string): string => {
	return 'implement me';
};

// base58 example: C8eSR6EXDSMH8ZE8TmtgC5XEUvM4pmTSad16Jq8KqmWi (what's clickable in phantom)
// base64 example: 4kzFkYPO//WjZ7JKI5pJU7hBrOGS59tOPatTimjl8gg=

async function metaDataToNFTs(metaData: any) {
	const metaplex = new Metaplex(connection);

	const nft = await metaplex.nfts().load({ metadata: metaData });
	return nft;
}

export const checkNFTs = async (ownerAddress: string) => {
	const metaplex = new Metaplex(connection);
	const nfts = await metaplex.nfts().findAllByOwner({
		owner: getPublicKeyFromAddress(ownerAddress),
	});

	const digis = nfts
		.filter((nft) => nft.symbol === 'DIGI')
		.map(async (digi) =>
			digi?.model === 'metadata' ? await metaDataToNFTs(digi) : digi
		); // add handler for our mint address

	console.log((await digis[0]).json?.attributes);


};
