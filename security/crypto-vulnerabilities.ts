/**
 * 10 Most Common and Important Insecure Cryptography Vulnerabilities
 *
 * This file demonstrates common cryptographic security vulnerabilities
 * that developers should avoid in production applications.
 *
 * WARNING: These examples show INSECURE patterns - DO NOT use in production!
 */

/* eslint-disable @typescript-eslint/no-unused-vars */

import * as crypto from "crypto";

// ================================
// 1. WEAK ENCRYPTION ALGORITHMS
// ================================

/**
 * VULNERABILITY: Using deprecated or weak encryption algorithms
 * IMPACT: Data can be easily decrypted by attackers
 */
class WeakEncryption {
  // ❌ INSECURE: DES is extremely weak (56-bit key)
  static encryptWithDES(data: string, key: string): string {
    const cipher = crypto.createCipher("des", key);
    let encrypted = cipher.update(data, "utf8", "hex");
    encrypted += cipher.final("hex");
    return encrypted;
  }

  // ❌ INSECURE: RC4 has known vulnerabilities
  static encryptWithRC4(data: string, key: string): string {
    const cipher = crypto.createCipher("rc4", key);
    let encrypted = cipher.update(data, "utf8", "hex");
    encrypted += cipher.final("hex");
    return encrypted;
  }

  // ❌ INSECURE: MD5 is cryptographically broken
  static hashWithMD5(data: string): string {
    return crypto.createHash("md5").update(data).digest("hex");
  }

  // ✅ SECURE ALTERNATIVE
  static secureEncrypt(
    data: string,
    key: Buffer
  ): { encrypted: string; iv: string } {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher("aes-256-gcm", key);
    cipher.setAAD(Buffer.from("additional-data"));

    let encrypted = cipher.update(data, "utf8", "hex");
    encrypted += cipher.final("hex");
    const tag = cipher.getAuthTag();

    return {
      encrypted: encrypted + ":" + tag.toString("hex"),
      iv: iv.toString("hex"),
    };
  }
}

class HardcodedKeys {
  static readonly JWT_SECRET = "hardcoded-jwt-secret-key";
}

// ================================
// 3. INSUFFICIENT KEY LENGTH
// ================================

/**
 * VULNERABILITY: Using cryptographic keys that are too short
 * IMPACT: Brute force attacks become feasible
 */
class WeakKeyLength {
  // ❌ INSECURE: 64-bit key is too short
  static generateWeakKey(): Buffer {
    return crypto.randomBytes(8); // Only 64 bits
  }

  // ❌ INSECURE: Short RSA key
  static generateWeakRSAKey(): void {
    crypto.generateKeyPair(
      "rsa",
      {
        modulusLength: 512, // Too short for modern security
      },
      () => {
        // This key is easily breakable
      }
    );
  }

  // ✅ SECURE ALTERNATIVE
  static generateSecureKey(): Buffer {
    return crypto.randomBytes(32); // 256 bits - cryptographically secure
  }
}

// ================================
// 4. WEAK RANDOM NUMBER GENERATION
// ================================

/**
 * VULNERABILITY: Using predictable random number generators
 * IMPACT: Cryptographic keys and tokens become predictable
 */
class WeakRandom {
  // ❌ INSECURE: Math.random() is not cryptographically secure
  static generateWeakToken(): string {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }

  // ❌ INSECURE: Predictable seed
  static generatePredictableKey(): string {
    const seed = Date.now(); // Predictable seed
    return crypto.createHash("sha256").update(seed.toString()).digest("hex");
  }

  // ✅ SECURE ALTERNATIVE
  static generateSecureToken(): string {
    return crypto.randomBytes(32).toString("hex");
  }
}

// ================================
// 5. IMPROPER PASSWORD STORAGE
// ================================

/**
 * VULNERABILITY: Storing passwords without proper hashing
 * IMPACT: User credentials easily compromised
 */
class WeakPasswordStorage {
  // ❌ INSECURE: Plain text password storage
  static storePlainTextPassword(password: string): string {
    return password; // Stored as-is
  }

  // ❌ INSECURE: Simple hash without salt
  static storeHashedPassword(password: string): string {
    return crypto.createHash("sha256").update(password).digest("hex");
  }

  // ❌ INSECURE: Weak salt
  static storeWeaklySalted(password: string): string {
    const salt = "static-salt"; // Same salt for all passwords
    return crypto
      .createHash("sha256")
      .update(password + salt)
      .digest("hex");
  }

  // ✅ SECURE ALTERNATIVE
  static storeSecurePassword(password: string): string {
    const salt = crypto.randomBytes(16).toString("hex");
    return (
      crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex") +
      ":" +
      salt
    );
  }
}

// ================================
// 6. IMPROPER IV/NONCE USAGE
// ================================

/**
 * VULNERABILITY: Reusing initialization vectors or nonces
 * IMPACT: Patterns in encrypted data become visible
 */
class ImproperIVUsage {
  // ❌ INSECURE: Static IV
  private static readonly STATIC_IV = Buffer.from("1234567890123456");

  static encryptWithStaticIV(data: string, key: string): string {
    const cipher = crypto.createCipheriv("aes-256-cbc", key, this.STATIC_IV);
    let encrypted = cipher.update(data, "utf8", "hex");
    encrypted += cipher.final("hex");
    return encrypted;
  }

  // ❌ INSECURE: Predictable IV
  static encryptWithPredictableIV(
    data: string,
    key: string,
    counter: number
  ): string {
    const iv = Buffer.alloc(16);
    iv.writeUInt32BE(counter, 12); // Predictable IV based on counter

    const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
    let encrypted = cipher.update(data, "utf8", "hex");
    encrypted += cipher.final("hex");
    return encrypted;
  }

  // ✅ SECURE ALTERNATIVE
  static secureEncrypt(
    data: string,
    key: string
  ): { encrypted: string; iv: string } {
    const iv = crypto.randomBytes(16); // Random IV for each encryption
    const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);

    let encrypted = cipher.update(data, "utf8", "hex");
    encrypted += cipher.final("hex");

    return {
      encrypted,
      iv: iv.toString("hex"),
    };
  }
}

// ================================
// 7. MISSING AUTHENTICATION/INTEGRITY
// ================================

/**
 * VULNERABILITY: Encryption without authentication
 * IMPACT: Data can be modified without detection
 */
class MissingAuthentication {
  // ❌ INSECURE: Encryption without authentication
  static encryptWithoutAuth(data: string, key: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);

    let encrypted = cipher.update(data, "utf8", "hex");
    encrypted += cipher.final("hex");

    return iv.toString("hex") + ":" + encrypted;
  }

  // ✅ SECURE ALTERNATIVE: Authenticated encryption
  static authenticatedEncrypt(data: string, key: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);

    let encrypted = cipher.update(data, "utf8", "hex");
    encrypted += cipher.final("hex");

    const tag = cipher.getAuthTag();

    return iv.toString("hex") + ":" + encrypted + ":" + tag.toString("hex");
  }
}

// ================================
// 8. INSECURE KEY DERIVATION
// ================================

/**
 * VULNERABILITY: Weak key derivation functions
 * IMPACT: Passwords can be cracked through brute force
 */
class WeakKeyDerivation {
  // ❌ INSECURE: Simple hash for key derivation
  static deriveKeyWeakly(password: string, salt: string): string {
    return crypto
      .createHash("sha256")
      .update(password + salt)
      .digest("hex");
  }

  // ❌ INSECURE: Low iteration count
  static deriveKeyWithLowIterations(password: string, salt: string): string {
    return crypto.pbkdf2Sync(password, salt, 100, 32, "sha256").toString("hex");
  }

  // ✅ SECURE ALTERNATIVE: Strong key derivation
  static deriveKeySecurely(password: string, salt: string): string {
    return crypto
      .pbkdf2Sync(password, salt, 100000, 32, "sha512")
      .toString("hex");
  }
}

// ================================
// 9. TIMING ATTACKS
// ================================

/**
 * VULNERABILITY: Non-constant time comparisons
 * IMPACT: Secrets can be leaked through timing analysis
 */
class TimingAttacks {
  // ❌ INSECURE: String comparison vulnerable to timing attacks
  static insecureTokenValidation(
    userToken: string,
    validToken: string
  ): boolean {
    return userToken === validToken; // Timing attack vulnerable
  }

  // ❌ INSECURE: Manual comparison
  static insecureHashComparison(hash1: string, hash2: string): boolean {
    if (hash1.length !== hash2.length) {
      return false;
    }

    for (let i = 0; i < hash1.length; i++) {
      if (hash1[i] !== hash2[i]) {
        return false; // Early return reveals information
      }
    }
    return true;
  }

  // ✅ SECURE ALTERNATIVE: Constant-time comparison
  static secureTokenValidation(userToken: string, validToken: string): boolean {
    return crypto.timingSafeEqual(
      Buffer.from(userToken),
      Buffer.from(validToken)
    );
  }
}

// ================================
// 10. INSECURE RANDOM SEEDING
// ================================

/**
 * VULNERABILITY: Predictable random seeds or insufficient entropy
 * IMPACT: Cryptographic randomness becomes predictable
 */
class InsecureSeeding {
  // ❌ INSECURE: Time-based seeding
  static generateTimeBasedRandom(): string {
    const seed = new Date().getTime();
    return crypto.createHash("sha256").update(seed.toString()).digest("hex");
  }

  // ❌ INSECURE: Low entropy seed
  static generateLowEntropySeed(): string {
    const seed = Math.floor(Math.random() * 1000); // Very low entropy
    return crypto.createHash("sha256").update(seed.toString()).digest("hex");
  }

  // ❌ INSECURE: User-controlled seed
  static generateUserControlledRandom(userInput: string): string {
    return crypto.createHash("sha256").update(userInput).digest("hex");
  }

  // ✅ SECURE ALTERNATIVE: Cryptographically secure random
  static generateSecureRandom(): string {
    return crypto.randomBytes(32).toString("hex");
  }
}

// ================================
// EXAMPLES OF VULNERABLE USAGE
// ================================

export class CryptographicVulnerabilities {
  /**
   * Example of a vulnerable authentication system
   */
  static authenticateUser(username: string, password: string): boolean {
    // ❌ Multiple vulnerabilities combined
    const storedHash = WeakPasswordStorage.storeHashedPassword("user123"); // Weak hashing
    const userHash = crypto.createHash("md5").update(password).digest("hex"); // MD5 is broken

    return userHash === storedHash; // Timing attack vulnerable
  }

  /**
   * Example of vulnerable session token generation
   */
  static generateSessionToken(): string {
    // ❌ Predictable token generation
    return WeakRandom.generateWeakToken();
  }

  /**
   * Example of vulnerable data encryption
   */
  static encryptSensitiveData(data: string): string {
    // ❌ Multiple vulnerabilities
    return WeakEncryption.encryptWithDES(data, HardcodedKeys.JWT_SECRET);
  }

  /**
   * Example of secure alternatives
   */
  static secureExample(): void {
    // ✅ Secure implementations
    WeakRandom.generateSecureToken();
    const secureKey = WeakKeyLength.generateSecureKey();
    WeakEncryption.secureEncrypt("sensitive data", secureKey);

    console.log("Secure implementations used");
  }
}

/**
 * Security Best Practices Summary:
 *
 * 1. Use strong, modern encryption algorithms (AES-256, ChaCha20)
 * 2. Never hardcode cryptographic keys or secrets
 * 3. Use adequate key lengths (256+ bits for symmetric, 2048+ for RSA)
 * 4. Use cryptographically secure random number generators
 * 5. Properly hash passwords with salt and strong algorithms (bcrypt, scrypt, Argon2)
 * 6. Always use random, unique IVs/nonces
 * 7. Use authenticated encryption (GCM mode, or encrypt-then-MAC)
 * 8. Use strong key derivation functions with high iteration counts
 * 9. Use constant-time comparisons for secrets
 * 10. Ensure sufficient entropy in random number generation
 */
