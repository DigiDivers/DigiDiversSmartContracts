import secret from './localWallet/my-keypair.json';
import { Keypair } from '@solana/web3.js';

const privKey = Keypair.fromSecretKey(new Uint8Array(secret)).secretKey;
const pubKey = Keypair.fromSecretKey(new Uint8Array(secret)).publicKey;

console.log(pubKey);
console.log(privKey);
