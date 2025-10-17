import fs from "fs";
import crypto from "crypto";

// Example 1: storing a "password" in plain text file
const PLAINTEXT_PASSWORD = "NOT_REAL_SECRET_password123";
fs.writeFileSync("./seeds_plaintext_password.txt", PLAINTEXT_PASSWORD);

// Example 2: weak hashing (MD5)
function weakHash(password) {
  // MD5 is considered cryptographically broken for password hashing
  return crypto.createHash("md5").update(password, "utf8").digest("hex");
}

console.log(
  "Plaintext file created and weak hash computed:",
  weakHash(PLAINTEXT_PASSWORD)
);
