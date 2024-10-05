const { PublicKey } = require("@solana/web3.js");
const { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID } = require("@solana/spl-token");

const userAddress = new PublicKey("J5qb1XR921qA9RX7FSCr63QUTJnHVsvXtsYpY1mxBEiZ");
const tokenMintAddress = new PublicKey("2JinBRJBYFib37HgmpgjjnUf5F5YCtP11AAEzdHa3pwD");

// Derive the associated token address
const getAssociatedTokenAddress = (mintAddress, ownerAddress) => {
  return PublicKey.findProgramAddressSync(
    [ownerAddress.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mintAddress.toBuffer()],
    ASSOCIATED_TOKEN_PROGRAM_ID
  );
};

const [associatedTokenAddress, bump] = getAssociatedTokenAddress(tokenMintAddress, userAddress);
console.log(`Assocciated Token Address: ${associatedTokenAddress.toBase58()}, bump: ${bump}`);
