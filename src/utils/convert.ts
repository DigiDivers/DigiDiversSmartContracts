import { PublicKey } from '@solana/web3.js';
import { toUint8Array } from 'js-base64';
import { JsonAttribute, NftAttributes } from '../types';

const getPublicKeyFromAddress = (address: string): PublicKey => {
    // address is base64 encoded
    const publicKeyByteArray = toUint8Array(address);
    return new PublicKey(publicKeyByteArray);
};

const base58Tobase64 = (address: string): string => {
    return 'implement me';
};

function attributeArrayToObject(attributes: JsonAttribute[]): NftAttributes {
    return attributes.reduce((acc: any, curr: any) => {
        acc[curr.trait_type] = curr.value;
        return acc;
    }, {});
}

export { getPublicKeyFromAddress, base58Tobase64, attributeArrayToObject };
