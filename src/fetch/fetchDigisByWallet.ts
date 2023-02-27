import { FindNftsByOwnerOutput, Metadata, Nft, Sft } from '@metaplex-foundation/js';
import { METAPLEX, getPublicKeyFromAddress, useMetaplex } from '../utils';

/**
 * Fetches all DIGI NFTs owned by the specified wallet address
 * @param ownerAddress - base64 address of the wallet that owns the NFTs
 * @returns an array of NFTs owned by the specified wallet address
 */
export const fetchDigisByWallet = async (ownerAddress: string): Promise<Nft[]> => {
    const { metadataToNfts } = useMetaplex();

    const nfts: FindNftsByOwnerOutput = await METAPLEX.nfts().findAllByOwner({
        owner: getPublicKeyFromAddress(ownerAddress),
    });

    const fetchedNFTData = nfts.filter((nft) => nft.symbol === 'DIGI'); // possible to come out as metadata

    const digisAsNFTs: Promise<Metadata | Nft | Sft>[] = [];

    for (const digi of fetchedNFTData) {
        if (digi.model === 'metadata') {
            digisAsNFTs.push(metadataToNfts(digi));
        } else {
            // if it's not metadata, it's already an NFT; j turned into a promise for consistency
            digisAsNFTs.push(Promise.resolve(digi));
        }
    }

    const digisNFTData: Nft[] = (await Promise.all(digisAsNFTs)) as Nft[];
    return digisNFTData;
};

// base58 example: C8eSR6EXDSMH8ZE8TmtgC5XEUvM4pmTSad16Jq8KqmWi (what's clickable in phantom)
// base64 example: 4kzFkYPO//WjZ7JKI5pJU7hBrOGS59tOPatTimjl8gg=
