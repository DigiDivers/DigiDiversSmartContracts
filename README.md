# Smart Contract Management for Digi Divers

## NFT Creation

Front-end to mint NFTs from the Digi Divers collection game.
Comes with front-end to mint NFTs.

Comes with front-end to mint NFTs, which is unnecessary given that we will only call the `mintNFT` function
from the front-end of the game.

## Send Sol

Allows you to send SOL to another address mapping.

    `sendSolToUsers(from, mappingAddressAmount)`

## Add Experience Level (XP) and Level Up (LVL) Existing pNFTs

(Not working yet, needs to be changed to work with NFT Creation section)

Hypotethically => Allows you to add XP and LVL to existing pNFTs.

    `updateNFT(nft, metadataUri, newName)`

## createSolNFT (will update)

to mint a devnet nft:

1. add the local wallet to ur phantom using helper.ts
2. run `cd createSolNFT`
3. install ts-node
4. run `ts-node app.ts`

### resources

1. https://www.quicknode.com/guides/solana-development/how-to-mint-an-nft-on-solana-using-typescript
2. https://www.quicknode.com/guides/solana-development/how-to-create-programmable-nfts-on-solana
3. https://docs.solana.com/wallet-guide/file-system-wallet

# troubleshooting
