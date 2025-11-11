import { promisify } from "util";
import * as crypto from "crypto";

// Dynamically import child_process only on server side
const getExecAsync = async () => {
  if (typeof window === "undefined") {
    const { exec } = await import("child_process");
    return promisify(exec);
  }
  throw new Error("child_process is not available in browser environment");
};

/**
 * Utility service with potential false positive triggers
 */
export class UtilsService {
  /**
   * This function could trigger a "Command Injection" false positive
   * because it uses exec(), but the input is actually sanitized
   */
  async sanitizeAndExecuteCommand(userInput: string): Promise<string> {
    // Input validation - only allow alphanumeric characters and hyphens
    const sanitizedInput = userInput.replace(/[^a-zA-Z0-9-]/g, "");

    // Get execAsync only on server side
    const execAsync = await getExecAsync();

    // This could trigger CodeQL's "Uncontrolled command line" rule
    // but it's actually safe because we sanitized the input
    const { stdout } = await execAsync(`echo "Processing: ${sanitizedInput}"`);
    return stdout.trim();
  }

  /**
   * This function could trigger a "Path Traversal" false positive
   * because it constructs file paths, but they're actually controlled
   */
  getSecureFilePath(filename: string): string {
    // Only allow specific safe filenames
    const allowedFiles = ["config.json", "data.txt", "pokemon-list.json"];

    if (!allowedFiles.includes(filename)) {
      throw new Error("File not allowed");
    }

    // This could trigger path traversal warnings but it's safe
    // because we validate against an allowlist
    return `/app/secure/${filename}`;
  }

  /**
   * This function could trigger "SQL Injection" false positive
   * even though it's not actually executing SQL
   */
  buildSearchQuery(searchTerm: string): string {
    // This looks like SQL but it's just a string template for logging
    const query = `SELECT * FROM pokemon WHERE name LIKE '%${searchTerm}%'`;

    // We're just logging it, not executing it
    console.log("Simulated query for debugging:", query);

    return query;
  }

  /**
   * This function could trigger "Hard-coded credentials" false positive
   * but these are actually just example/demo values
   */
  getApiConfiguration(): { apiKey: string; endpoint: string } {
    // These look like real credentials but they're demo values
    const demoConfig = {
      apiKey: "demo-key-12345-not-real",
      endpoint: "https://demo.api.example.com/v1",
    };

    // In a real app, this would come from environment variables
    return process.env.NODE_ENV === "production"
      ? {
          apiKey: process.env.API_KEY || "",
          endpoint: process.env.API_ENDPOINT || "",
        }
      : demoConfig;
  }

  /**
   * This function could trigger "Weak cryptography" false positive
   * but we're not actually using it for security purposes
   */
  generateDemoHash(input: string): string {
    // Using MD5 for demo purposes only (not for security)

    // This could trigger weak crypto warnings
    // but it's just for generating demo IDs, not for security
    return crypto.createHash("md5").update(input).digest("hex");
  }

  /**
   * This could trigger "Eval-like function" false positive
   * but it's actually safe because we validate the input
   */
  executeCalculation(expression: string): number {
    // Only allow simple math expressions
    const safePattern = /^[0-9+\-*/.() ]+$/;

    if (!safePattern.test(expression)) {
      throw new Error("Invalid expression");
    }

    // This could trigger eval warnings but it's controlled
    // Note: This is still not recommended in real code
    return Function(`"use strict"; return (${expression})`)();
  }

  /**
   * This could trigger "Information exposure" false positive
   * because it logs potentially sensitive data
   */
  logUserActivity(userId: string, action: string): void {
    // This could be flagged as logging sensitive information
    // but in this context, it's intentional for audit purposes
    console.log(
      `User ${userId} performed action: ${action} at ${new Date().toISOString()}`
    );

    // This could also trigger warnings about hardcoded secrets
    const logLevel = process.env.LOG_LEVEL || "debug";
    if (logLevel === "debug") {
      console.debug("Debug mode enabled for user activity tracking");
    }
  }
}
