import { PublicKey } from '@solana/web3.js';
import { toUint8Array } from 'js-base64';

const getPublicKeyFromAddress = (address: string): PublicKey => {
    // address is base64 encoded
    const publicKeyByteArray = toUint8Array(address);
    return new PublicKey(publicKeyByteArray);
};

const base58Tobase64 = (address: string): string => {
    return 'implement me';
};


export { getPublicKeyFromAddress, base58Tobase64 };


