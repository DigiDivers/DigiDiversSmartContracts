import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { Metaplex, keypairIdentity, bundlrStorage, Nft, Sft } from "@metaplex-foundation/js";
import secret from './guideSecret.json';

const QUICKNODE_RPC = 'https://spring-powerful-ensemble.solana-devnet.discover.quiknode.pro/67a7b069690f38116d2da95bb3c9d6bc2f4e8b0e/'; 
const SOLANA_CONNECTION = new Connection(QUICKNODE_RPC);
const WALLET = Keypair.fromSecretKey(new Uint8Array(secret));
const METAPLEX = Metaplex.make(SOLANA_CONNECTION)
    .use(keypairIdentity(WALLET))
    .use(bundlrStorage({
        address: 'https://devnet.bundlr.network',
        providerUrl: QUICKNODE_RPC,
        timeout: 60000,
    }));

const MINT_ADDRESS = 'YOUR_NFT_MINT_ADDRESS'; // CHANGE THIS to actual NFT address

const NEW_METADATA = {
    imgType: 'image/png',
    imgName: 'QuickPix New MetaName',
    description: 'New description!',
    attributes: [
        {trait_type: 'Speed', value: 'Quicker'},
        {trait_type: 'Type', value: 'Pixelated'},
        {trait_type: 'Background', value: 'QuickNode Blue 2'}
    ]
};
    
async function uploadMetadata(
    imgUri: string, 
    imgType: string, 
    nftName: string, 
    description: string, 
    attributes: {trait_type: string, value: string}[]
) {
    console.log(`Step 2 - Uploading New MetaData`);
    const { uri } = await METAPLEX
        .nfts()
        .uploadMetadata({
            name: nftName,
            description: description,
            image: imgUri,
            attributes: attributes,
            properties: {
                files: [
                    {
                        type: imgType,
                        uri: imgUri,
                    },
                ]
            }
        });
    console.log('   Metadata URI:',uri);
    return uri;    
}

async function updateNft(nft:Nft|Sft, metadataUri: string, newName: string) {
    console.log(`Step 3 - Updating NFT`);
    await METAPLEX
        .nfts()
        .update({
            name: newName,
            nftOrSft: nft,
            uri: metadataUri
        }, { commitment: 'finalized' });
    console.log(`   Updated NFT: https://explorer.solana.com/address/${nft.address}?cluster=devnet`);
}
