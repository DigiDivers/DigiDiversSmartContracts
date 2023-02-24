import { fetchMaxDigiByWallet } from './fetch';

async function main() {
    // get NFT tests
    console.log(await fetchMaxDigiByWallet('EZCZz/y0YImqB6dGtua8GB7lSmZKGr9Go9k7Nsz0CP4='));
}

main();
