import { Metadata, Nft } from '@metaplex-foundation/js';
import { METAPLEX } from './constants';

const useMetaplex = () => {
    const metadataToNfts = async (metadata: Metadata): Promise<Nft> => {
        const nft = await METAPLEX.nfts().load({ metadata: metadata });
        return nft as Nft;
    };

    return { metadataToNfts };
};

export default useMetaplex;
