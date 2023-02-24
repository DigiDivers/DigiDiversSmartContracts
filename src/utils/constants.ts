import { Connection, Keypair, clusterApiUrl } from '@solana/web3.js';
import { secret } from '../assets';
import { Metaplex, bundlrStorage, keypairIdentity } from '@metaplex-foundation/js';

export const WALLET = Keypair.fromSecretKey(new Uint8Array(secret));
export const DEVNET_ENDPOINT = clusterApiUrl('devnet');

export const CONNECTION = new Connection(clusterApiUrl('devnet'), 'confirmed');
export const METAPLEX: Metaplex = Metaplex.make(CONNECTION)
    .use(keypairIdentity(WALLET))
    .use(
        bundlrStorage({
            address: 'https://devnet.bundlr.network',
            providerUrl: DEVNET_ENDPOINT,
            timeout: 60000,
        })
    );
