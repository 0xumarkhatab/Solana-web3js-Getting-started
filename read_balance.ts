/**
 * 
 *  Check any address's balance across mainnet , devnet or testnet of solana
 *  
 */

import { Connection, LAMPORTS_PER_SOL, PublicKey, clusterApiUrl } from "@solana/web3.js";

let user_address = "HenwdA5WLfU1AXcrfCrKkT3ikiz6jRR2N34kM4BYENFZ";
let network = 1 // 0 mainnet , 1 devnet , 2 testnet

let networks_mapping = {0:'mainnet-beta',1:'devnet',2:'testnet'};

let choosen_network_tag=networks_mapping[network]
async function main() {
    
const connection = new Connection(clusterApiUrl((choosen_network_tag)));

let account;
try {
  account = new PublicKey(user_address);
  if (!PublicKey.isOnCurve(account)) {
    throw new Error("Invalid address: " + user_address);
  }
} catch (error) {
    console.log("Address is not correct !")
    return 0;
}

const balance = await connection.getBalance(account);

console.log(
  `The balance of ${account} is ${
    balance / LAMPORTS_PER_SOL
  } Sol `
);
console.log(`✅ Finished!`);

}
main()