export type DigiInfo = {
    name: string;
    level: number;
    imageUrl: string;
    symbol?: string;
};

export type GetNFTResponse = {
    totalDigis: number;
    maxDigi: DigiInfo;
};
