import fs from "fs";
import crypto from "crypto";

// ============================================
// INSECURE CRYPTOGRAPHY EXAMPLES
// ============================================

const PLAINTEXT_PASSWORD = "NOT_REAL_SECRET_password123";
const SECRET_KEY = "my-secret-key";
const API_KEY = "sk_live_1234567890abcdef";

// Example 1: Storing passwords in plain text
fs.writeFileSync("./seeds_plaintext_password.txt", PLAINTEXT_PASSWORD);

// Example 2: Weak hashing algorithms (MD5)
function weakHashMD5(password) {
  // MD5 is cryptographically broken and vulnerable to rainbow table attacks
  return crypto.createHash("md5").update(password, "utf8").digest("hex");
}

// Example 3: Weak hashing algorithms (SHA1)
function weakHashSHA1(password) {
  // SHA1 is deprecated and vulnerable to collision attacks
  return crypto.createHash("sha1").update(password, "utf8").digest("hex");
}

// Example 4: Using SHA256 without salt (still insecure for passwords)
function unsaltedHash(password) {
  // Even SHA256 without salt is vulnerable to rainbow table attacks
  return crypto.createHash("sha256").update(password, "utf8").digest("hex");
}

// Example 5: Hardcoded encryption keys
const HARDCODED_KEY = "1234567890123456"; // 16 bytes for AES-128
const HARDCODED_IV = "abcdefghijklmnop"; // 16 bytes IV

function insecureEncryption(text) {
  // Using hardcoded key and IV - major security vulnerability
  const cipher = crypto.createCipher("aes128", HARDCODED_KEY);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
}

// Example 6: Weak random number generation
function weakRandomToken() {
  // Math.random() is not cryptographically secure
  return Math.random().toString(36).substring(2, 15);
}

// Example 7: Insecure key derivation
function weakKeyDerivation(password, salt) {
  // Using simple hash for key derivation instead of PBKDF2/scrypt/Argon2
  return crypto
    .createHash("sha256")
    .update(password + salt)
    .digest();
}

// Example 8: ECB mode encryption (insecure)
function ecbEncryption(text) {
  // ECB mode reveals patterns in plaintext - always insecure
  const key = Buffer.from(HARDCODED_KEY);
  const cipher = crypto.createCipher("aes-128-ecb", key);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
}

// Example 9: Reusing IV/Nonce
const REUSED_IV = Buffer.from("1234567890123456");
function reuseIV(text1, text2) {
  // Reusing IV/nonce breaks semantic security
  const key = Buffer.from(HARDCODED_KEY);

  const cipher1 = crypto.createCipheriv("aes-128-cbc", key, REUSED_IV);
  const encrypted1 =
    cipher1.update(text1, "utf8", "hex") + cipher1.final("hex");

  const cipher2 = crypto.createCipheriv("aes-128-cbc", key, REUSED_IV);
  const encrypted2 =
    cipher2.update(text2, "utf8", "hex") + cipher2.final("hex");

  return { encrypted1, encrypted2 };
}

// Example 10: Weak password validation
function weakPasswordValidation(password) {
  // Insufficient password complexity requirements
  return password.length >= 6; // Way too weak!
}

// Example 11: Timing attack vulnerability
function insecureStringComparison(input, secret) {
  // String comparison that's vulnerable to timing attacks
  return input === secret;
}

// Example 12: Insecure token generation
function insecureSessionToken() {
  // Predictable token generation
  const timestamp = Date.now();
  const userId = 12345;
  return crypto.createHash("md5").update(`${timestamp}${userId}`).digest("hex");
}

// Example 13: Weak encryption with custom algorithm
function customWeakCipher(text, key) {
  // Never implement your own crypto algorithm!
  let result = "";
  for (let i = 0; i < text.length; i++) {
    const keyChar = key.charCodeAt(i % key.length);
    const textChar = text.charCodeAt(i);
    result += String.fromCharCode(textChar ^ keyChar); // Simple XOR
  }
  return Buffer.from(result).toString("base64");
}

// Example 14: Insecure certificate validation (conceptual)
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0"; // Disables SSL verification!

// Example 15: Hardcoded secrets in environment simulation
const INSECURE_CONFIG = {
  DATABASE_PASSWORD: "admin123",
  JWT_SECRET: "jwt-secret-key",
  API_KEY: "sk_live_1234567890abcdef",
  ENCRYPTION_KEY: "super-secret-key",
};

// ============================================
// EXECUTE EXAMPLES (FOR DEMONSTRATION)
// ============================================

console.log("=== INSECURE CRYPTOGRAPHY EXAMPLES ===");
console.log("1. MD5 Hash:", weakHashMD5(PLAINTEXT_PASSWORD));
console.log("2. SHA1 Hash:", weakHashSHA1(PLAINTEXT_PASSWORD));
console.log("3. Unsalted SHA256:", unsaltedHash(PLAINTEXT_PASSWORD));
console.log("4. Insecure Encryption:", insecureEncryption("Secret message"));
console.log("5. Weak Random Token:", weakRandomToken());
console.log(
  "6. Weak Key Derivation:",
  weakKeyDerivation("password", "salt").toString("hex")
);
console.log(
  "7. ECB Encryption:",
  ecbEncryption(
    "This is a secret message that should not be encrypted with ECB mode"
  )
);
console.log("8. Reused IV:", reuseIV("Secret 1", "Secret 2"));
console.log("9. Weak Password Valid:", weakPasswordValidation("123"));
console.log(
  "10. Timing Attack Vulnerable:",
  insecureStringComparison("guess", "secret")
);
console.log("11. Insecure Session Token:", insecureSessionToken());
console.log("12. Custom Weak Cipher:", customWeakCipher("Secret", "key"));
console.log("13. Hardcoded Secrets:", INSECURE_CONFIG);

// Write additional insecure data to files
fs.writeFileSync("./api-keys.txt", JSON.stringify(INSECURE_CONFIG, null, 2));
fs.writeFileSync(
  "./weak-tokens.txt",
  `${weakRandomToken()}\n${insecureSessionToken()}`
);
fs.writeFileSync(
  "./hardcoded-secrets.txt",
  `SECRET_KEY=${SECRET_KEY}\nAPI_KEY=${API_KEY}\nHARDCODED_IV=${HARDCODED_IV}`
);

console.log("=== INSECURE FILES CREATED ===");
console.log("- seeds_plaintext_password.txt");
console.log("- api-keys.txt");
console.log("- weak-tokens.txt");
console.log("- hardcoded-secrets.txt");
