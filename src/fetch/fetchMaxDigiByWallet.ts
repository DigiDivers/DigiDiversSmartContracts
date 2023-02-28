import { Nft } from '@metaplex-foundation/js';
import { GetNFTResponse } from '../types';
import { fetchDigisByWallet } from './fetchDigisByWallet';
import { attributeArrayToObject, getDigiLevel } from '../utils';

// base58 example: C8eSR6EXDSMH8ZE8TmtgC5XEUvM4pmTSad16Jq8KqmWi (what's clickable in phantom)
// base64 example: 4kzFkYPO//WjZ7JKI5pJU7hBrOGS59tOPatTimjl8gg=

export const fetchMaxDigiByWallet = async (ownerAddress: string): Promise<GetNFTResponse> => {
    const res: GetNFTResponse = {
        totalDigis: 0,
        maxDigi: {
            name: '',
            attributes: {},
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
            attributes: attributeArrayToObject((maxDigi.json?.attributes as any) || []),
            imageUrl: maxDigi.json?.image || '',
            symbol: maxDigi.symbol,
        };
    }

    return res;
};
