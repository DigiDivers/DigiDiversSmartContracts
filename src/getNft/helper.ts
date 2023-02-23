import { Metaplex, Nft } from '@metaplex-foundation/js';
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

export type DigiInfo = {
	name: string;
	level: number;
	imageUrl: string;
	symbol?: string;
};

export type GetNFTResponse = {
	totalDigis: number;
	maxDigi: DigiInfo;
};

export const checkNFTs = async (ownerAddress: string) => {
	const res: GetNFTResponse = {
		totalDigis: 0,
		maxDigi: {
			name: '',
			level: 0,
			imageUrl: '',
			symbol: '',
		},
	};

	const metaplex = new Metaplex(connection);
	const nfts = await metaplex.nfts().findAllByOwner({
		owner: getPublicKeyFromAddress(ownerAddress),
	});

	const fetchedNFTData = nfts.filter((nft) => nft.symbol === 'DIGI'); // possible to come out as metadata
	res.totalDigis = fetchedNFTData.length;

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const digisAsNFTs: Promise<any>[] = [];

	for (const digi of fetchedNFTData) {
		if (digi.model === 'metadata') {
			digisAsNFTs.push(metaDataToNFTs(digi));
		} else {
			digisAsNFTs.push(Promise.resolve(digi)); // if it's not metadata, it's already an NFT; j turned into a promise for consistency
		}
	}

	const digisNFTData: Nft[] = await Promise.all(digisAsNFTs);

	const maxDigi: Nft = digisNFTData.reduce(
		(acc, curr) =>
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			(Number(curr.json?.attributes?.[0].value) || 0) >
			(Number(acc.json?.attributes?.[0].value) || 0)
				? curr
				: acc,
		digisNFTData[0]
	);

	if (res.totalDigis > 0) {
		res.maxDigi = {
			name: maxDigi.json?.name || '',
			level: Number(maxDigi.json?.attributes?.[0].value) || 0,
			imageUrl: maxDigi.json?.image || '',
			symbol: maxDigi.symbol,
		};
	}
	console.log(res);

	return res;

	// console.log((await digis[0]).json?.attributes);
};
