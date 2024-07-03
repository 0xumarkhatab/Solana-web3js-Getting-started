
/**
 *  Send Funds 
 * 
 */
import { getKeypairFromEnvironment } from "@solana-developers/helpers";
import { Connection, PublicKey, SystemProgram, Transaction, sendAndConfirmTransaction } from "@solana/web3.js";
const config = require("dotenv/config");

try {
  const suppliedToPubkey = process.argv[2] || null;

  if (!suppliedToPubkey) {
    console.log(
      `Please provide a public key to send to i.e npx esrun transfer.ts HenwdA5WLfU1AXcrfCrKkT3ikiz6jRR2N34kM4BYENFZ. `
    );
    process.exit(1);
  }

  console.log(`suppliedToPubkey: ${suppliedToPubkey}`);

  const senderKeypair = getKeypairFromEnvironment("SECRET_KEY");

  const toPubkey = new PublicKey(suppliedToPubkey);

  const connection = new Connection(
    "https://api.devnet.solana.com",
    "confirmed"
  );

  console.log(
    `✅ Loaded our own keypair, the destination public key, and connected to Solana`
  );

  const transaction = new Transaction();

  const LAMPORTS_TO_SEND = 5000;

  const sendSolInstruction = SystemProgram.transfer({
    fromPubkey: senderKeypair.publicKey,
    toPubkey,
    lamports: LAMPORTS_TO_SEND,
  });

  transaction.add(sendSolInstruction);
  
  const signature = await sendAndConfirmTransaction(connection, transaction, [
    senderKeypair,
  ]);

  console.log(
    `💸 Finished! Sent ${LAMPORTS_TO_SEND} to the address ${toPubkey}. `
  );
  console.log(`Transaction signature is ${signature}!`);
} catch (error) {
    console.log('error', error);
    
}
