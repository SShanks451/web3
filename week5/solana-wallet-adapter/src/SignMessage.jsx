import { ed25519 } from "@noble/curves/ed25519";
import { useWallet } from "@solana/wallet-adapter-react";
import { useState } from "react";
import bs58 from "bs58";

export function SignMessage() {
  const [message, setMessage] = useState("");

  const { publicKey, signMessage } = useWallet();

  const onClickSign = async () => {
    if (!publicKey) {
      alert("Wallet not connected");
      return;
    }

    if (!signMessage) {
      alert("Wallet doesn't support message signing!");
      return;
    }

    const encodedMessage = new TextEncoder().encode(message);
    const signature = await signMessage(encodedMessage);

    if (!ed25519.verify(signature, encodedMessage, publicKey.toBytes())) {
      alert("Message signature invalid!");
      return;
    }
    alert(`Message signature: ${bs58.encode(signature)}`);
  };

  return (
    <div>
      <h1>Sign Message</h1>
      <input id="message" type="text" value={message} onChange={(e) => setMessage(e.target.value)} />
      <button onClick={onClickSign}>Sign Message</button>
    </div>
  );
}
