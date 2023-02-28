import { Nft } from '@metaplex-foundation/js';

function getDigiLevel(digi: Nft): number {
    return Number(digi.json?.attributes?.find((att) => att.trait_type === 'Level')?.value) || 0;
}

export { getDigiLevel };
