# Smart Contract Management for Digi Divers

## NFT Creation
Allows you to create a Metaplex Candy Machine with a given name, description, and image

Comes with front-end to mint NFTs. 

![How website looks](https://github.com/DigiDivers/DigiDiversSmartContracts/blob/main/Screenshot%202023-02-19%20at%2020.07.49.png)

Comes with front-end to mint NFTs, which is unnecessary given that we will only call the `mintNFT` function
from the front-end of the game. 

## Send Sol
Allows you to send SOL to another address mapping. 

    `sendSolToUsers(from, mappingAddressAmount)`

## Add Experience Level (XP) and Level Up (LVL) Existing pNFTs

(Not working yet)
Allows you to add XP and LVL to existing pNFTs. 

    `updateNFT(nft, metadataUri, newName)`