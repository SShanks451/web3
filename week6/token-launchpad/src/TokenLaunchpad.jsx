import {
  createAssociatedTokenAccountInstruction,
  createInitializeMetadataPointerInstruction,
  createInitializeMint2Instruction,
  createMintToInstruction,
  ExtensionType,
  getAssociatedTokenAddressSync,
  getMintLen,
  LENGTH_SIZE,
  TOKEN_2022_PROGRAM_ID,
  TYPE_SIZE,
} from "@solana/spl-token";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Keypair, SystemProgram, Transaction } from "@solana/web3.js";
import { pack, createInitializeInstruction } from "@solana/spl-token-metadata";
import { useState } from "react";

export function TokenLaunchPad() {
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [initialSupply, setInitialSupply] = useState("");

  const { connection } = useConnection();
  const wallet = useWallet();

  async function createToken() {
    const mintKeypair = Keypair.generate();
    const metadata = {
      mint: mintKeypair.publicKey,
      name: "KIRA",
      symbol: "KIR   ",
      uri: "https://cdn.100xdevs.com/metadata.json",
      additionalMetadata: [],
    };

    const mintLen = getMintLen([ExtensionType.MetadataPointer]);
    const metadataLen = TYPE_SIZE + LENGTH_SIZE + pack(metadata).length;

    const lamports = await connection.getMinimumBalanceForRentExemption(mintLen + metadataLen);

    // creating mint account with metadata
    const transaction = new Transaction().add(
      SystemProgram.createAccount({
        fromPubkey: wallet.publicKey,
        newAccountPubkey: mintKeypair.publicKey,
        space: mintLen,
        lamports,
        programId: TOKEN_2022_PROGRAM_ID,
      }),
      createInitializeMetadataPointerInstruction(mintKeypair.publicKey, wallet.publicKey, mintKeypair.publicKey, TOKEN_2022_PROGRAM_ID),
      createInitializeMint2Instruction(mintKeypair.publicKey, 9, wallet.publicKey, wallet.publicKey, TOKEN_2022_PROGRAM_ID),
      createInitializeInstruction({
        programId: TOKEN_2022_PROGRAM_ID,
        mint: mintKeypair.publicKey,
        metadata: mintKeypair.publicKey,
        name: metadata.name,
        symbol: metadata.symbol,
        uri: metadata.uri,
        mintAuthority: wallet.publicKey,
        updateAuthority: wallet.publicKey,
      })
    );

    transaction.feePayer = wallet.publicKey;
    transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
    transaction.partialSign(mintKeypair);

    await wallet.sendTransaction(transaction, connection);
    console.log(`Token mint created at ${mintKeypair.publicKey.toBase58()}`);

    // creating associated token account
    const associatedToken = getAssociatedTokenAddressSync(mintKeypair.publicKey, wallet.publicKey, false, TOKEN_2022_PROGRAM_ID);

    const transaction2 = new Transaction().add(
      createAssociatedTokenAccountInstruction(wallet.publicKey, associatedToken, wallet.publicKey, mintKeypair.publicKey, TOKEN_2022_PROGRAM_ID)
    );

    await wallet.sendTransaction(transaction2, connection);
    console.log(`Associated token: ${associatedToken.toBase58()}`);

    // minting associated token account
    const transaction3 = new Transaction().add(
      createMintToInstruction(mintKeypair.publicKey, associatedToken, wallet.publicKey, 1000000000, [], TOKEN_2022_PROGRAM_ID)
    );

    await wallet.sendTransaction(transaction3, connection);
    console.log("Minted!");
  }

  return (
    <div className="w-[100%] flex justify-center h-screen">
      <div className="flex flex-col justify-center">
        <div className="text-4xl">Solana Token Launchpad</div>
        <input
          className="w-[70%] mx-auto mt-10 mb-2 bg-gray-800 border border-black px-1 py-2"
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="w-[70%] mx-auto my-2 bg-gray-800 border border-black px-1 py-2"
          type="text"
          placeholder="Symbol"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
        />
        <input
          className="w-[70%] mx-auto my-2 bg-gray-800 border border-black px-1 py-2"
          type="text"
          placeholder="Image URL"
          value={imageURL}
          onChange={(e) => setImageURL(e.target.value)}
        />
        <input
          className="w-[70%] mx-auto my-2 bg-gray-800 border border-black px-1 py-2"
          type="text"
          placeholder="Initial Supply"
          value={initialSupply}
          onChange={(e) => setInitialSupply(e.target.value)}
        />
        <button onClick={createToken} className="bg-black border-2 border-black rounded-lg my-4 text-xl px-5 py-1 shadow-lg mx-auto">
          Create Token
        </button>
      </div>
    </div>
  );
}
