# Smart Contract Management for Digi Divers

## NFT Creation

Main (combining functionality of all other functions in file) is the `createLevelXNft` function. 
This function does the following: 

1. Creates a config with the NFT parameters
2. Uploads the NFT image to Arweave
3. Creates the NFT metadata
4. Uploads the NFT metadata to Arweave
5. Mints the NFT on Solana
6. Freezes the NFT so it's non-transferable for the user

### Helper functions to `createLevelXNft`
`transferNFT` => Allows you to transfer an NFT to another address.

    ```javascript
    transferNFT(nft, to)
    ```


`updateNFTLevel` => Allows you to update certain parameters of the metadata of an NFT.

    ```javascript
    updateNFT(nft, newLevel, newImage?)
    ```

`uploadImage` => Allows you to upload an image to Arweave.

    ```javascript
    uploadImage(image)
    ```

`uploadMetadata` => Allows you to upload metadata to Arweave.

    ```javascript
    uploadMetadata(metadata)
    ```

`mintNFT` => Allows you to mint an NFT on Solana.

    ```javascript
    mintNFT(metadataUri, name, sellerFee, symbol, creators)
    ```


## Send Sol

Allows you to send SOL to another address mapping.

    ```javascript
    sendSolToUsers(from, mappingAddressAmount)
    ```

## Add Experience Level (XP) and Level Up (LVL) Existing pNFTs

(Not working yet, needs to be changed to work with NFT Creation section)

Hypotethically => Allows you to add XP and LVL to existing pNFTs.

    ```javascript
    updateNFT(nft, metadataUri, newName)
    ```

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
