import { FindNftsByOwnerOutput, Nft } from '@metaplex-foundation/js';
import { METAPLEX, getPublicKeyFromAddress, useMetaplex } from '../utils';

// base58 example: C8eSR6EXDSMH8ZE8TmtgC5XEUvM4pmTSad16Jq8KqmWi (what's clickable in phantom)
// base64 example: 4kzFkYPO//WjZ7JKI5pJU7hBrOGS59tOPatTimjl8gg=

export const fetchDigisByWallet = async (ownerAddress: string) => {
    const { metadataToNfts } = useMetaplex();

    const nfts: FindNftsByOwnerOutput = await METAPLEX.nfts().findAllByOwner({
        owner: getPublicKeyFromAddress(ownerAddress),
    });

    const fetchedNFTData = nfts.filter((nft) => nft.symbol === 'DIGI'); // possible to come out as metadata

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const digisAsNFTs: Promise<any>[] = [];

    for (const digi of fetchedNFTData) {
        if (digi.model === 'metadata') {
            digisAsNFTs.push(metadataToNfts(digi));
        } else {
            digisAsNFTs.push(Promise.resolve(digi)); // if it's not metadata, it's already an NFT; j turned into a promise for consistency
        }
    }

    const digisNFTData: Nft[] = await Promise.all(digisAsNFTs);

    return digisNFTData;

    // console.log((await digis[0]).json?.attributes);
};
