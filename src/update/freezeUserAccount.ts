import { Connection, Keypair, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { freezeAccount } from '@solana/spl-token';
import { CONNECTION, WALLET } from '../utils';

/**
 *
 * @param userAccount User account to freeze
 * @returns NFT with the new level
 */
export async function freezeUserAccount(userAccount: PublicKey): Promise<void> {
    await freezeAccount(CONNECTION, WALLET, userAccount, userAccount, WALLET.publicKey);
}
