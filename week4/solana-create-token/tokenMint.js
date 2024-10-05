const { createMint, getOrCreateAssociatedTokenAccount, mintTo } = require("@solana/spl-token");
const { Keypair, Connection, clusterApiUrl, TOKEN_PROGRAM_ID, PublicKey } = require("@solana/web3.js");

const payer = Keypair.fromSecretKey(
  Uint8Array.from([
    1, 198, 237, 152, 241, 142, 8, 9, 148, 54, 166, 13, 137, 158, 57, 147, 166, 1, 99, 239, 59, 240, 116, 65, 81, 121, 51, 225, 20, 55, 135, 224, 253,
    211, 240, 17, 7, 81, 83, 137, 165, 120, 51, 186, 165, 174, 100, 137, 191, 106, 91, 67, 55, 70, 62, 164, 180, 15, 139, 231, 162, 137, 90, 62,
  ])
);

const mintAuthority = payer;

const connection = new Connection(clusterApiUrl("devnet"));

async function createMintForToken(payer, mintAuthority) {
  const mint = await createMint(connection, payer, mintAuthority, null, 6, TOKEN_PROGRAM_ID);
  console.log("Mint created at: ", mint.toBase58());
  return mint;
}

async function mintNewTokens(mint, to, amount) {
  const tokenAccount = await getOrCreateAssociatedTokenAccount(connection, payer, mint, new PublicKey(to));
  console.log("Token account created at", tokenAccount.address.toBase58());

  await mintTo(connection, payer, mint, tokenAccount.address, payer, amount);
  console.log("Minted", amount, "tokens to", tokenAccount.address.toBase58());
}

async function main() {
  const mint = await createMintForToken(payer, mintAuthority.publicKey);
  await mintNewTokens(mint, mintAuthority.publicKey, 100);
}

main();
