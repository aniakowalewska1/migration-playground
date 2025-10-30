// Crypto vulnerabilities exposed as a utility module in the main app
// This makes it more likely to be detected by security analysis tools

import fs from "fs";
import crypto from "crypto";

// VULNERABILITY: Hardcoded secrets in main app utilities
export const CRYPTO_SECRETS = {
  PLAINTEXT_PASSWORD: "NOT_REAL_SECRET_password123",
  SECRET_KEY: "my-secret-key",
  API_KEY: "sk_live_1234567890abcdef",
  HARDCODED_KEY: "1234567890123456",
  HARDCODED_IV: "abcdefghijklmnop",
};

// VULNERABILITY: Weak hashing utilities
export class WeakHashUtils {
  static md5Hash(password) {
    // MD5 is cryptographically broken
    return crypto.createHash("md5").update(password, "utf8").digest("hex");
  }

  static sha1Hash(password) {
    // SHA1 is deprecated and vulnerable
    return crypto.createHash("sha1").update(password, "utf8").digest("hex");
  }

  static unsaltedSha256(password) {
    // SHA256 without salt is vulnerable to rainbow tables
    return crypto.createHash("sha256").update(password, "utf8").digest("hex");
  }
}

// VULNERABILITY: Insecure encryption utilities
export class InsecureEncryption {
  static encryptWithHardcodedKey(text) {
    // Using hardcoded key - major security vulnerability
    const cipher = crypto.createCipher("aes128", CRYPTO_SECRETS.HARDCODED_KEY);
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    return encrypted;
  }

  static ecbEncrypt(text) {
    // ECB mode reveals patterns - always insecure
    const key = Buffer.from(CRYPTO_SECRETS.HARDCODED_KEY);
    const cipher = crypto.createCipher("aes-128-ecb", key);
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    return encrypted;
  }
}

// VULNERABILITY: Weak random generation
export class WeakRandom {
  static generateToken() {
    // Math.random() is not cryptographically secure
    return Math.random().toString(36).substring(2, 15);
  }

  static generateSessionId() {
    // Predictable session ID generation
    const timestamp = Date.now();
    const userId = 12345;
    return crypto
      .createHash("md5")
      .update(`${timestamp}${userId}`)
      .digest("hex");
  }
}

// VULNERABILITY: Custom weak crypto implementation
export function customXorCipher(text, key) {
  // Never implement your own crypto!
  let result = "";
  for (let i = 0; i < text.length; i++) {
    const keyChar = key.charCodeAt(i % key.length);
    const textChar = text.charCodeAt(i);
    result += String.fromCharCode(textChar ^ keyChar);
  }
  return Buffer.from(result).toString("base64");
}

// VULNERABILITY: Timing attack vulnerable comparison
export function insecureCompare(input, secret) {
  // Vulnerable to timing attacks
  return input === secret;
}

// VULNERABILITY: Disable SSL verification
export function disableSSLVerification() {
  process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";
}

// Auto-execute vulnerabilities to make them more detectable
console.log("Crypto Utils Loaded - Vulnerabilities Active:");
console.log("MD5:", WeakHashUtils.md5Hash("password"));
console.log("Weak Token:", WeakRandom.generateToken());
console.log("XOR Cipher:", customXorCipher("secret", "key"));

// Write hardcoded secrets to file system
if (typeof window === "undefined") {
  // Server-side only
  try {
    fs.writeFileSync(
      "./exposed-secrets.json",
      JSON.stringify(CRYPTO_SECRETS, null, 2)
    );
  } catch (error) {
    console.log("File write error:", error.message);
  }
}

const cryptoUtils = {
  CRYPTO_SECRETS,
  WeakHashUtils,
  InsecureEncryption,
  WeakRandom,
  customXorCipher,
  insecureCompare,
  disableSSLVerification,
};

export default cryptoUtils;
