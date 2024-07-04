/**
 *
 *  Create an SPL token devnet solana
 *
 */

import { createCreateMetadataAccountV3Instruction } from "@metaplex-foundation/mpl-token-metadata";
import { getExplorerLink, getKeypairFromEnvironment } from "@solana-developers/helpers";
import { MINT_SIZE, TOKEN_PROGRAM_ID, createAssociatedTokenAccount, createAssociatedTokenAccountInstruction, createInitializeAccountInstruction, createInitializeMintInstruction, createMint, getAccountLenForMint, getAssociatedTokenAddress, getMinimumBalanceForRentExemptMint, getMint, getOrCreateAssociatedTokenAccount, mintTo } from "@solana/spl-token";
import { Connection, Keypair, PublicKey, SystemProgram, Transaction, clusterApiUrl, sendAndConfirmTransaction } from "@solana/web3.js";


const config = require("dotenv/config");


async function main() {
  const connection = new Connection(clusterApiUrl("devnet"));
  const mintAuthorityKeypair = getKeypairFromEnvironment("SECRET_KEY");
  const FreezeAuthorityKeypair = getKeypairFromEnvironment("FREEZE_SECRET_KEY");
  let decimals = 2;

  // when you private key
  // console.log("1. Creating Token Mint ...");
  
  const tokenMint = await createMint(
    connection,
    mintAuthorityKeypair, // payer
    mintAuthorityKeypair.publicKey,
    FreezeAuthorityKeypair.publicKey,
    decimals
  );


  let link = getExplorerLink("address", tokenMint.toBase58(), "devnet");
  console.log(`✅ 1. Finished! Creating token mint: ${link}`);

  let user = mintAuthorityKeypair;
  const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
    "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
  );
    // console.log("2. Attaching metadata ...");
  
  
  // Subtitute in your token mint account
  const tokenMintAccount = tokenMint;

  let uri =
    "https://bafybeic4rrkwjsmlafnndic4rurbuehxsxm2fi3xfujgmwhp2eoa6wwz4a.ipfs.w3s.link/sol_training_token_metadata.json";
  const metadataData = {
    name: "Solana Training Token",
    symbol: "TRAINING",
    // Arweave / IPFS / Pinata etc link using metaplex standard for off-chain data
    uri,
    sellerFeeBasisPoints: 0,
    creators: null,
    collection: null,
    uses: null,
  };

  const metadataPDAAndBump = PublicKey.findProgramAddressSync(
    [
      Buffer.from("metadata"),
      TOKEN_METADATA_PROGRAM_ID.toBuffer(),
      tokenMintAccount.toBuffer(),
    ],
    TOKEN_METADATA_PROGRAM_ID
  );

  const metadataPDA = metadataPDAAndBump[0];

  const transaction = new Transaction();

  const createMetadataAccountInstruction =
    createCreateMetadataAccountV3Instruction(
      {
        metadata: metadataPDA,
        mint: tokenMintAccount,
        mintAuthority: user.publicKey,
        payer: user.publicKey,
        updateAuthority: user.publicKey,
      },
      {
        createMetadataAccountArgsV3: {
          collectionDetails: null,
          data: metadataData,
          isMutable: true,
        },
      }
    );

  transaction.add(createMetadataAccountInstruction);

  let transactionSignature = await sendAndConfirmTransaction(
    connection,
    transaction,
    [user]
  );

  const transactionLink = getExplorerLink(
    "transaction",
    transactionSignature,
    "devnet"
  );

  console.log(
    `✅ Transaction confirmed, explorer link is: ${transactionLink}!`
  );

  const tokenMintLink = getExplorerLink(
    "address",
    tokenMintAccount.toString(),
    "devnet"
  );

  console.log(`✅ 2. Metadata is attached : ${tokenMintLink}`);

  
  // Here we are making an associated token account for our own address, but we can
  // make an ATA on any other wallet in devnet!
  // const recipient = new PublicKey("SOMEONE_ELSES_DEVNET_ADDRESS");

  const recipient = user.publicKey;

  // console.log("3. Getting or Creating Associated Token Account for receiver ...");
  

  let tokenAccount;
  
  tokenAccount =  await getOrCreateAssociatedTokenAccount(connection,user,tokenMintAccount,recipient);
  
 
// console.log("4. Minting Tokens to Receiver ... ");

const MINOR_UNITS_PER_MAJOR_UNITS = Math.pow(10, 2);
  let recipientAssociatedTokenAccount =new PublicKey(tokenAccount.address.toBase58());
 transactionSignature = await mintTo(
  connection,
  user,
  tokenMintAccount,
  recipientAssociatedTokenAccount,
  user,
  10 * MINOR_UNITS_PER_MAJOR_UNITS
);

 link = getExplorerLink("transaction", transactionSignature, "devnet");

console.log(`✅ 3. Tokens Minted ! Check Mint Token Transaction\n ${link}`);

}
async function buildCreateMintTransaction(
  connection: Connection,
  payer: PublicKey,
  mint: PublicKey
): Promise<any> {
    const mintState = await getMint(connection, mint);
     const space = getAccountLenForMint(mintState);
  const lamports = await connection.getMinimumBalanceForRentExemption(space);
  console.log("lamports are ", lamports);

  const accountKeypair = Keypair.generate();
  const programId = TOKEN_PROGRAM_ID;

  const transaction = new Transaction().add(
    SystemProgram.createAccount({
      fromPubkey: payer,
      newAccountPubkey: accountKeypair.publicKey,
      space,
      lamports,
      programId,
    }),
    createInitializeAccountInstruction(
      accountKeypair.publicKey,
      mint,
      payer,
      programId
    )
  );

  return transaction;
}
async function buildCreateAssociatedTokenAccountTransaction(
  payer:  PublicKey,
  mint:  PublicKey
): Promise< Transaction> {
  const associatedTokenAddress = await getAssociatedTokenAddress(
    mint,
    payer,
    false
  );

  const transaction = new  Transaction().add(
    createAssociatedTokenAccountInstruction(
      payer,
      associatedTokenAddress,
      payer,
      mint
    )
  );

  return transaction;
}

main();
