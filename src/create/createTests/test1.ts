// Testing the createSolNFT module
import { NftWithToken, PublicKey } from '@metaplex-foundation/js';
import { createAndMintLevelXNft } from '../createAndMintLevelXNft';
import { freezeUserAccount, updateNftLevel } from '../../update';
import { transferNft } from '../../transfer';

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

async function testingTransferNFTtoUser(nft: NftWithToken) {
    // test transfer function
    console.log(`Transfering NFT to user...`);
    // transfering to my account testing
    const nftResponse = await transferNft(
        nft,
        new PublicKey('C8eSR6EXDSMH8ZE8TmtgC5XEUvM4pmTSad16Jq8KqmWi')
    );
    console.log(`nft after transfer: `, nftResponse);
}

async function testingFreezeUserAccount(nft: NftWithToken) {
    // test freeze function
    console.log(`Freezing user account...`);
    await freezeUserAccount(nft.address);
    console.log(`Account frozen successfully: \n`, nft);

    // console.log();
}

export async function test1() {
    console.log('test1(): creating, updating, transfering and freezing an NFT...');
    const nftCreated = await testingCreateNFT();
    await testingUpdateNFT(nftCreated); // update nft testing
    await testingTransferNFTtoUser(nftCreated); // transfer to my account testing
    // await testingFreezeUserAccount(nftCreated); // freeze account testing
}
