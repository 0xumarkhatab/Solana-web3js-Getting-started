import { Connection, LAMPORTS_PER_SOL, PublicKey, clusterApiUrl } from "@solana/web3.js";

const connection = new Connection("https://api.devnet.solana.com", "confirmed");
const address = new PublicKey("DeAmLCUk7nJq6oKoXK2ZxqqH4ZimLFzRV8yMXtMa6Red");
const balance = await connection.getBalance(address);

console.log(`The balance of the account at ${address} is ${balance/LAMPORTS_PER_SOL} Sol`); 
console.log(`✅ Finished!`);
