export type DigiInfo = {
    name: string;
    attributes: NftAttributes;
    imageUrl: string;
    symbol?: string;
};

export type GetNFTResponse = {
    totalDigis: number;
    maxDigi: DigiInfo;
};

export interface NftAttributes {
    [key: string]: string | number;
}


export interface JsonAttribute {
    trait_type: string;
    value: string | number;
}
