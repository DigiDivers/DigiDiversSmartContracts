# Smart Contract Management for Digi Divers

## NFT Creation (createSolNft)
Main (combining functionality of all other functions in file) is the `createLevelXNft` function. 
This function does the following: 

1. Creates a config with the NFT parameters
2. Uploads the NFT image to Arweave
3. Creates the NFT metadata
4. Uploads the NFT metadata to Arweave
5. Mints the NFT on Solana
6. Freezes the NFT so it's non-transferable for the user

### Helper functions to `createLevelXNft`
1. `transferNft` => Allows you to transfer an NFT to another address.

```javascript
transferNFT(nft, to)
```
-----------------

2. `updateNFTLevel` => Allows you to update certain parameters of the metadata of an NFT.

```javascript
updateNFT(nft, newLevel, newImage?)
```

-----------------

3. `uploadImage` => Allows you to upload an image to Arweave.
```javascript
uploadImage(image)
```
-----------------

4. `uploadMetadata` => Allows you to upload metadata to Arweave.

```javascript
uploadMetadata(metadata)
```
-----------------

5. `mintNFT` => Allows you to mint an NFT on Solana.

```javascript
mintNFT(metadataUri, name, sellerFee, symbol, creators)
```
-----------------

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

### resources

1. https://www.quicknode.com/guides/solana-development/how-to-mint-an-nft-on-solana-using-typescript
2. https://www.quicknode.com/guides/solana-development/how-to-create-programmable-nfts-on-solana
3. https://docs.solana.com/wallet-guide/file-system-wallet

# troubleshooting
