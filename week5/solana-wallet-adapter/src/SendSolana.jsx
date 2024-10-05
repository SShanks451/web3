import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { useState } from "react";

export function SendTokens() {
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");

  const { connection } = useConnection();
  const wallet = useWallet();

  async function sendTokens() {
    const transaction = new Transaction();
    transaction.add(
      SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: new PublicKey(to),
        lamports: parseFloat(amount) * LAMPORTS_PER_SOL,
      })
    );

    await wallet.sendTransaction(transaction, connection);
    alert("Sent " + amount + " SOL to " + to);
  }

  return (
    <div>
      <h1>Send Solana</h1>
      <input id="to" value={to} onChange={(e) => setTo(e.target.value)} type="text" placeholder="To" />
      <input id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} type="text" placeholder="Amount" />
      <button onClick={sendTokens}>Send</button>
    </div>
  );
}
