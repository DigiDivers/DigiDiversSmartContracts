// Testing the createSolNFT module
import { NftWithToken } from '@metaplex-foundation/js';
import { createAndMintLevelXNft } from './createAndMintLevelXNft';
import { updateNftLevel } from '../update';

async function testingCreateNFT() {
    // test create function
    console.log(`Creating NFT...`);
    const nft: NftWithToken = await createAndMintLevelXNft(1, '1.png');
    return nft;
}

async function testingUpdateNFT(nft: NftWithToken) {
    // test update function
    console.log(`Nft before update: `, nft);
    const nftResponse = await updateNftLevel(nft, 2, '2.png');
    console.log(`nft after update: `, nftResponse);
}

// Main testing function
async function testsMain() {
    const nftCreated = await testingCreateNFT();
    await testingUpdateNFT(nftCreated);
}

testsMain();
