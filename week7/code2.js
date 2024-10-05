// Transfer lamports from your account to another account

const { Keypair, Connection, Transaction, SystemProgram } = require("@solana/web3.js");

const payer = Keypair.fromSecretKey(
  Uint8Array.from([
    1, 198, 237, 152, 241, 142, 8, 9, 148, 54, 166, 13, 137, 158, 57, 147, 166, 1, 99, 239, 59, 240, 116, 65, 81, 121, 51, 225, 20, 55, 135, 224, 253,
    211, 240, 17, 7, 81, 83, 137, 165, 120, 51, 186, 165, 174, 100, 137, 191, 106, 91, 67, 55, 70, 62, 164, 180, 15, 139, 231, 162, 137, 90, 62,
  ])
);

const connection = new Connection("https://api.devnet.solana.com");

async function main() {
  const newAccount = Keypair.generate();
  const lamports = 2 * 1000000000;

  const transaction = new Transaction();
  transaction.add(
    SystemProgram.transfer({
      fromPubkey: payer.publicKey,
      toPubkey: newAccount.publicKey,
      lamports,
    })
  );

  await connection.sendTransaction(transaction, [payer]);
  console.log(`Transferred to  ${newAccount.publicKey.toBase58()}`);
}

main();
