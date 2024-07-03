/**
 * 
 *  Key Pair Generation
 */
console.log('Generating Key Pair')
const { Keypair } =require( "@solana/web3.js");

const keypair = Keypair.generate();

console.log(`The public key is: `, keypair.publicKey.toBase58());
console.log(`The secret key is: `, keypair.secretKey);

/***
 * 
 *  IMPORT FROM ENV 
 */

console.log("Importing Key Pair");
const { getKeypairFromEnvironment } = require("@solana-developers/helpers");

const config=require("dotenv/config");

const keypair_ = getKeypairFromEnvironment("SECRET_KEY");

console.log(`The public key is: `, keypair_.publicKey.toBase58());
console.log(`The secret key is: `, keypair_.secretKey);
