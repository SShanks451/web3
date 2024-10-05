const crypto = require("crypto");

// Node.js code for generating SHA-256

/*
const input = "100xdevs";
const hash = crypto.createHash("sha256").update(input).digest("hex");

console.log(hash);
*/

//------------------------------- Proof of Work -----------------------------------

// Q1. Give me an input string that outputs a SHA-256 hash that starts with 00000 . How will you do it?

// Function to find an input string that produces a hash starting with '00000'
function findHashWithPrefix(prefix) {
  let input = 0;
  while (true) {
    let inputStr = input.toString();
    let hash = crypto.createHash("sha256").update(inputStr).digest("hex");
    if (hash.startsWith(prefix)) {
      return { input: inputStr, hash: hash };
    }
    input++;
  }
}

// Find and print the input string and hash
const result = findHashWithPrefix("00000");
console.log(`Input: ${result.input}`);
console.log(`Hash: ${result.hash}`);
