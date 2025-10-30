import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// Simulated JWT implementation for vulnerability demonstration
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
// INSECURE CRYPTOGRAPHY API ENDPOINTS
// ============================================

// Example 1: Weak JWT signing
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { username, role } = body;

  // VULNERABILITY: Using weak secret for JWT
  const weakSecret = "secret";
  const token = createWeakJWT(
    {
      username,
      role,
      admin: role === "admin",
      exp: Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60 * 999,
    },
    weakSecret // Predictable secret
  );

  return NextResponse.json({
    token,
    vulnerability: "Weak JWT secret and excessive expiration",
  });
}

// Example 2: Insecure password hashing endpoint
export async function PUT(request: NextRequest) {
  const body = await request.json();
  const { password } = body;

  // VULNERABILITY: Multiple weak hashing methods
  const md5Hash = crypto.createHash("md5").update(password).digest("hex");
  const sha1Hash = crypto.createHash("sha1").update(password).digest("hex");
  const unsaltedSha256 = crypto
    .createHash("sha256")
    .update(password)
    .digest("hex");

  // VULNERABILITY: Weak key derivation
  const weakKey = crypto.pbkdf2Sync(password, "static-salt", 1, 32, "sha1");

  return NextResponse.json({
    hashes: {
      md5: md5Hash,
      sha1: sha1Hash,
      sha256_unsalted: unsaltedSha256,
      weak_pbkdf2: weakKey.toString("hex"),
    },
    vulnerabilities: [
      "MD5 hashing (broken)",
      "SHA1 hashing (deprecated)",
      "Unsalted SHA256",
      "PBKDF2 with 1 iteration and static salt",
    ],
  });
}

// Example 3: Insecure encryption endpoint
export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const { data } = body;

  // VULNERABILITY: Hardcoded encryption parameters
  const hardcodedKey = "1234567890123456"; // 16 bytes
  const staticIV = "abcdefghijklmnop"; // Always the same IV

  // VULNERABILITY: Deprecated cipher method
  const cipher = crypto.createCipher("des", hardcodedKey); // DES is broken
  let encrypted = cipher.update(data, "utf8", "hex");
  encrypted += cipher.final("hex");

  // VULNERABILITY: ECB mode (if available)
  const key = Buffer.from(hardcodedKey);

  const ecbCipher = crypto.createCipheriv("aes-128-ecb", key, null);
  let ecbEncrypted = ecbCipher.update(data, "utf8", "hex");
  ecbEncrypted += ecbCipher.final("hex");

  // VULNERABILITY: Using the static IV in CBC mode (predictable)
  const iv = Buffer.from(staticIV);
  const cbcCipher = crypto.createCipheriv("aes-128-cbc", key, iv);
  let cbcEncrypted = cbcCipher.update(data, "utf8", "hex");
  cbcEncrypted += cbcCipher.final("hex");

  return NextResponse.json({
    des_encrypted: encrypted,
    ecb_encrypted: ecbEncrypted,
    cbc_with_static_iv: cbcEncrypted,
    hardcoded_key: hardcodedKey,
    static_iv: staticIV,
    vulnerabilities: [
      "Hardcoded encryption key",
      "Static IV reuse",
      "DES encryption (broken)",
      "ECB mode (reveals patterns)",
      "CBC with predictable IV",
    ],
  });
}

// Example 4: Weak random generation
export async function GET() {
  // VULNERABILITY: Multiple weak randomization methods
  const mathRandom = Math.random().toString(36);
  const dateBasedToken = Date.now().toString(36);
  const predictableUUID = `${Date.now()}-${Math.random()}`;

  // VULNERABILITY: Weak session ID generation
  const sessionId = crypto
    .createHash("md5")
    .update(`${Date.now()}${Math.random()}`)
    .digest("hex");

  // VULNERABILITY: Insufficient entropy
  const shortToken = crypto.randomBytes(4).toString("hex"); // Only 32 bits

  return NextResponse.json({
    tokens: {
      math_random: mathRandom,
      date_based: dateBasedToken,
      predictable_uuid: predictableUUID,
      weak_session_id: sessionId,
      short_token: shortToken,
    },
    vulnerabilities: [
      "Math.random() is not cryptographically secure",
      "Date-based tokens are predictable",
      "MD5 for session generation",
      "Insufficient entropy (32 bits)",
    ],
  });
}

// Example 5: Insecure certificate and TLS handling
export async function DELETE() {
  // VULNERABILITY: Disabling certificate validation
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

  // VULNERABILITY: Weak cipher suites (conceptual)
  const weakCipherSuites = [
    "TLS_RSA_WITH_RC4_128_MD5",
    "TLS_RSA_WITH_RC4_128_SHA",
    "TLS_RSA_WITH_DES_CBC_SHA",
  ];

  // VULNERABILITY: Hardcoded private key material
  const fakePrivateKey = `-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC7VJTUt9Us8cKB
wQTFrDS2j48YdBh2AQIDAQABAoIBAFb6a4qYWwq5PiuIeebPwg==
-----END PRIVATE KEY-----`;

  return NextResponse.json({
    certificate_validation_disabled: true,
    weak_cipher_suites: weakCipherSuites,
    exposed_private_key: fakePrivateKey,
    vulnerabilities: [
      "Disabled TLS certificate validation",
      "Weak cipher suites",
      "Private key exposed in code",
    ],
  });
}
