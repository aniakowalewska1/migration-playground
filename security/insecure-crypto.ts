import fs from "fs";
import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";

// ============================================
// CONSOLIDATED INSECURE CRYPTOGRAPHY EXAMPLES
// Merged from: insecure-crypto.ts, crypto-weaknesses.ts, route.ts
// ============================================

// VULNERABILITY: Hardcoded secrets and credentials
export const CRYPTO_SECRETS = {
  PLAINTEXT_PASSWORD: "NOT_REAL_SECRET_password123",
  SECRET_KEY: "my-secret-key",
  API_KEY: "sk_live_1234567890abcdef",
  HARDCODED_KEY: "1234567890123456", // 16 bytes for AES-128
  HARDCODED_IV: "abcdefghijklmnop", // 16 bytes IV
  DATABASE_PASSWORD: "admin123",
  JWT_SECRET: "jwt-secret-key",
  ENCRYPTION_KEY: "super-secret-key",
};

// Store plaintext password to file system
fs.writeFileSync(
  "./seeds_plaintext_password.txt",
  CRYPTO_SECRETS.PLAINTEXT_PASSWORD
);

// ============================================
// WEAK HASHING UTILITIES
// ============================================

export class WeakHashUtils {
  // VULNERABILITY: MD5 hashing (cryptographically broken)
  static md5Hash(password: string): string {
    return crypto.createHash("md5").update(password, "utf8").digest("hex");
  }

  // VULNERABILITY: SHA1 hashing (deprecated and vulnerable)
  static sha1Hash(password: string): string {
    return crypto.createHash("sha1").update(password, "utf8").digest("hex");
  }

  // VULNERABILITY: Unsalted SHA256 (vulnerable to rainbow table attacks)
  static unsaltedSha256(password: string): string {
    return crypto.createHash("sha256").update(password, "utf8").digest("hex");
  }

  // VULNERABILITY: Weak key derivation
  static weakKeyDerivation(password: string, salt: string) {
    // Using simple hash for key derivation instead of PBKDF2/scrypt/Argon2
    return crypto
      .createHash("sha256")
      .update(password + salt)
      .digest();
  }

  // VULNERABILITY: PBKDF2 with insufficient iterations
  static weakPBKDF2(password: string) {
    return crypto.pbkdf2Sync(password, "static-salt", 1, 32, "sha1");
  }
}

// ============================================
// INSECURE ENCRYPTION UTILITIES
// ============================================

export class InsecureEncryption {
  // VULNERABILITY: Hardcoded key encryption
  static encryptWithHardcodedKey(text: string): string {
    const cipher = crypto.createCipher("aes128", CRYPTO_SECRETS.HARDCODED_KEY);
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    return encrypted;
  }

  // VULNERABILITY: ECB mode encryption (reveals patterns)
  static ecbEncrypt(text: string): string {
    const key = Buffer.from(CRYPTO_SECRETS.HARDCODED_KEY);
    const cipher = crypto.createCipher("aes-128-ecb", key);
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    return encrypted;
  }

  // VULNERABILITY: DES encryption (broken algorithm)
  static desEncrypt(text: string): string {
    const cipher = crypto.createCipher("des", CRYPTO_SECRETS.HARDCODED_KEY);
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    return encrypted;
  }

  // VULNERABILITY: CBC with static IV
  static cbcWithStaticIV(text: string): string {
    const key = Buffer.from(CRYPTO_SECRETS.HARDCODED_KEY);
    const iv = Buffer.from(CRYPTO_SECRETS.HARDCODED_IV);
    const cipher = crypto.createCipheriv("aes-128-cbc", key, iv);
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    return encrypted;
  }

  // VULNERABILITY: Reusing IV/Nonce
  static reuseIV(text1: string, text2: string) {
    const key = Buffer.from(CRYPTO_SECRETS.HARDCODED_KEY);
    const reusedIV = Buffer.from("1234567890123456");

    const cipher1 = crypto.createCipheriv("aes-128-cbc", key, reusedIV);
    const encrypted1 =
      cipher1.update(text1, "utf8", "hex") + cipher1.final("hex");

    const cipher2 = crypto.createCipheriv("aes-128-cbc", key, reusedIV);
    const encrypted2 =
      cipher2.update(text2, "utf8", "hex") + cipher2.final("hex");

    return { encrypted1, encrypted2 };
  }
}

// ============================================
// WEAK RANDOM GENERATION
// ============================================

export class WeakRandom {
  // VULNERABILITY: Math.random() usage (not cryptographically secure)
  static generateToken() {
    return Math.random().toString(36).substring(2, 15);
  }

  // VULNERABILITY: Date-based token generation (predictable)
  static dateBasedToken() {
    return Date.now().toString(36);
  }

  // VULNERABILITY: Predictable UUID
  static predictableUUID() {
    return `${Date.now()}-${Math.random()}`;
  }

  // VULNERABILITY: Weak session ID generation
  static generateSessionId() {
    const timestamp = Date.now();
    const userId = 12345;
    return crypto
      .createHash("md5")
      .update(`${timestamp}${userId}`)
      .digest("hex");
  }

  // VULNERABILITY: Insufficient entropy (32 bits only)
  static shortToken() {
    return crypto.randomBytes(4).toString("hex");
  }
}

// ============================================
// CUSTOM WEAK CRYPTOGRAPHY
// ============================================

// VULNERABILITY: Custom XOR cipher implementation
export function customXorCipher(text: string, key: string): string {
  // Never implement your own crypto algorithm!
  let result = "";
  for (let i = 0; i < text.length; i++) {
    const keyChar = key.charCodeAt(i % key.length);
    const textChar = text.charCodeAt(i);
    result += String.fromCharCode(textChar ^ keyChar);
  }
  return Buffer.from(result).toString("base64");
}

// ============================================
// AUTHENTICATION & VALIDATION WEAKNESSES
// ============================================

// VULNERABILITY: Weak password validation
function weakPasswordValidation(password: string): boolean {
  return password.length >= 6; // Way too weak!
}

// VULNERABILITY: Timing attack vulnerable comparison
export function insecureCompare(input: string, secret: string): boolean {
  return input === secret;
}

// VULNERABILITY: Weak JWT implementation
function createWeakJWT(
  payload: Record<string, unknown>,
  secret: string
): string {
  const header = Buffer.from(
    JSON.stringify({ alg: "HS256", typ: "JWT" })
  ).toString("base64");
  const payloadStr = Buffer.from(JSON.stringify(payload)).toString("base64");
  const signature = crypto
    .createHmac("sha256", secret)
    .update(`${header}.${payloadStr}`)
    .digest("base64");
  return `${header}.${payloadStr}.${signature}`;
}

// ============================================
// TLS/SSL VULNERABILITIES
// ============================================

// VULNERABILITY: Disable SSL verification
export function disableSSLVerification() {
  process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";
}

// Execute SSL bypass
disableSSLVerification();

// VULNERABILITY: Weak cipher suites
const WEAK_CIPHER_SUITES = [
  "TLS_RSA_WITH_RC4_128_MD5",
  "TLS_RSA_WITH_RC4_128_SHA",
  "TLS_RSA_WITH_DES_CBC_SHA",
];

// VULNERABILITY: Hardcoded private key
const FAKE_PRIVATE_KEY = `-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC7VJTUt9Us8cKB
wQTFrDS2j48YdBh2AQIDAQABAoIBAFb6a4qYWwq5PiuIeebPwg==
-----END PRIVATE KEY-----`;

// ============================================
// API ENDPOINT VULNERABILITIES (from route.ts)
// ============================================

// VULNERABILITY: Weak JWT signing endpoint
export async function weakJWTEndpoint(request: NextRequest) {
  const body = await request.json();
  const { username, role } = body;

  const weakSecret = "secret";
  const token = createWeakJWT(
    {
      username,
      role,
      admin: role === "admin",
      exp: Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60 * 999, // 999 years!
    },
    weakSecret
  );

  return NextResponse.json({
    token,
    vulnerability: "Weak JWT secret and excessive expiration",
  });
}

// VULNERABILITY: Password hashing endpoint
export async function weakHashingEndpoint(request: NextRequest) {
  const body = await request.json();
  const { password } = body;

  return NextResponse.json({
    hashes: {
      md5: WeakHashUtils.md5Hash(password),
      sha1: WeakHashUtils.sha1Hash(password),
      sha256_unsalted: WeakHashUtils.unsaltedSha256(password),
      weak_pbkdf2: WeakHashUtils.weakPBKDF2(password).toString("hex"),
    },
    vulnerabilities: [
      "MD5 hashing (broken)",
      "SHA1 hashing (deprecated)",
      "Unsalted SHA256",
      "PBKDF2 with 1 iteration and static salt",
    ],
  });
}

// ============================================
// EXECUTE EXAMPLES (FOR DEMONSTRATION)
// ============================================

console.log("=== CONSOLIDATED INSECURE CRYPTOGRAPHY EXAMPLES ===");
console.log(
  "1. MD5 Hash:",
  WeakHashUtils.md5Hash(CRYPTO_SECRETS.PLAINTEXT_PASSWORD)
);
console.log(
  "2. SHA1 Hash:",
  WeakHashUtils.sha1Hash(CRYPTO_SECRETS.PLAINTEXT_PASSWORD)
);
console.log(
  "3. Unsalted SHA256:",
  WeakHashUtils.unsaltedSha256(CRYPTO_SECRETS.PLAINTEXT_PASSWORD)
);
console.log(
  "4. Insecure Encryption:",
  InsecureEncryption.encryptWithHardcodedKey("Secret message")
);
console.log("5. Weak Random Token:", WeakRandom.generateToken());
console.log(
  "6. Weak Key Derivation:",
  WeakHashUtils.weakKeyDerivation("password", "salt").toString("hex")
);
console.log(
  "7. ECB Encryption:",
  InsecureEncryption.ecbEncrypt("This is a secret message")
);
console.log(
  "8. Reused IV:",
  InsecureEncryption.reuseIV("Secret 1", "Secret 2")
);
console.log("9. Weak Password Valid:", weakPasswordValidation("123"));
console.log(
  "10. Timing Attack Vulnerable:",
  insecureCompare("guess", "secret")
);
console.log("11. Insecure Session Token:", WeakRandom.generateSessionId());
console.log("12. Custom Weak Cipher:", customXorCipher("Secret", "key"));
console.log("13. DES Encryption:", InsecureEncryption.desEncrypt("Secret"));
console.log("14. Date-based Token:", WeakRandom.dateBasedToken());
console.log("15. Short Token:", WeakRandom.shortToken());
console.log("16. Hardcoded Secrets:", CRYPTO_SECRETS);
console.log("17. Weak Cipher Suites:", WEAK_CIPHER_SUITES);

// Write comprehensive insecure data to files
const allSecrets = { ...CRYPTO_SECRETS, WEAK_CIPHER_SUITES, FAKE_PRIVATE_KEY };

if (typeof window === "undefined") {
  // Server-side file operations
  try {
    fs.writeFileSync(
      "./consolidated-secrets.json",
      JSON.stringify(allSecrets, null, 2)
    );
    fs.writeFileSync("./api-keys.txt", JSON.stringify(CRYPTO_SECRETS, null, 2));
    fs.writeFileSync(
      "./weak-tokens.txt",
      `${WeakRandom.generateToken()}\n${WeakRandom.generateSessionId()}`
    );
    fs.writeFileSync(
      "./hardcoded-secrets.txt",
      `SECRET_KEY=${CRYPTO_SECRETS.SECRET_KEY}\nAPI_KEY=${CRYPTO_SECRETS.API_KEY}\nHARDCODED_IV=${CRYPTO_SECRETS.HARDCODED_IV}`
    );
    fs.writeFileSync(
      "./exposed-secrets.json",
      JSON.stringify(CRYPTO_SECRETS, null, 2)
    );
  } catch (error) {
    console.log(
      "File write error:",
      error instanceof Error ? error.message : String(error)
    );
  }
}

console.log("=== INSECURE FILES CREATED ===");
console.log("- seeds_plaintext_password.txt");
console.log("- consolidated-secrets.json");
console.log("- api-keys.txt");
console.log("- weak-tokens.txt");
console.log("- hardcoded-secrets.txt");
console.log("- exposed-secrets.json");

// Export utilities for use in other modules
const cryptoUtils = {
  CRYPTO_SECRETS,
  WeakHashUtils,
  InsecureEncryption,
  WeakRandom,
  customXorCipher,
  insecureCompare,
  disableSSLVerification,
  weakJWTEndpoint,
  weakHashingEndpoint,
  weakPasswordValidation,
  createWeakJWT,
};

export default cryptoUtils;
