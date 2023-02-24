import { PublicKey } from '@solana/web3.js';
import { NftWithToken } from '@metaplex-foundation/js';
import { METAPLEX, WALLET } from '../utils';

/**
 *
 * @param nft NFT to transfer
 * @param recipient Recipient of the NFT
 * @returns NFT new information
 */
export async function transferNft(nft: NftWithToken, recipient: PublicKey): Promise<NftWithToken> {
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
