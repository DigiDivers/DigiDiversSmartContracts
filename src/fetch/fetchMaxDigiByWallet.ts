import { Nft } from '@metaplex-foundation/js';
import { GetNFTResponse } from '../types';
import { fetchDigisByWallet } from './fetchDigisByWallet';
import { getDigiLevel } from '../utils';

// base58 example: C8eSR6EXDSMH8ZE8TmtgC5XEUvM4pmTSad16Jq8KqmWi (what's clickable in phantom)
// base64 example: 4kzFkYPO//WjZ7JKI5pJU7hBrOGS59tOPatTimjl8gg=

export const fetchMaxDigiByWallet = async (ownerAddress: string) => {
    const res: GetNFTResponse = {
        totalDigis: 0,
        maxDigi: {
            name: '',
            level: 0,
            imageUrl: '',
            symbol: '',
        },
    };

    const digisNftData: Nft[] = await fetchDigisByWallet(ownerAddress);
    res.totalDigis = digisNftData.length;

    const maxDigi: Nft = digisNftData.reduce((acc, curr) => {
        const accLevel = getDigiLevel(acc);
        const currLevel = getDigiLevel(curr);

        if (accLevel > currLevel) {
            return acc;
        } else return curr;
    }, digisNftData[0]);

    if (res.totalDigis > 0) {
        res.maxDigi = {
            name: maxDigi.json?.name || '',
            level: getDigiLevel(maxDigi),
            imageUrl: maxDigi.json?.image || '',
            symbol: maxDigi.symbol,
        };
    }

    return res;
};
