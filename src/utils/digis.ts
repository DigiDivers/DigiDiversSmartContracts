import { Nft } from '@metaplex-foundation/js';
import { JsonAttribute } from '../types';

function getDigiLevel(digi: Nft): number {
    return Number(digi.json?.attributes?.find((att) => att.trait_type === 'Level')?.value) || 0;
}
function getDigiExperience(digi: Nft): number {
    return (
        Number(digi.json?.attributes?.find((att) => att.trait_type === 'Experience')?.value) || 0
    );
}
function getDigiRating(digi: Nft): number {
    return Number(digi.json?.attributes?.find((att) => att.trait_type === 'Rating')?.value) || 0;
}

function addedAttributeArray(digi: Nft, attributeToAdd: JsonAttribute): JsonAttribute[] {
    if (typeof attributeToAdd.value === 'number') {
        attributeToAdd.value = attributeToAdd.value.toString();
    }

    const newAttributes =
        digi.json?.attributes?.filter((att: any) => att.trait_type !== attributeToAdd.trait_type) ||
        [];
    newAttributes.push(attributeToAdd as any);
    return newAttributes as JsonAttribute[];
}

export { getDigiLevel, getDigiExperience, getDigiRating, addedAttributeArray };
