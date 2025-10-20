"use client";

import { useState } from "react";
import { UtilsService } from "../services/utils.service";

interface DemoComponentProps {
  className?: string;
}

export const DemoComponent = ({ className = "" }: DemoComponentProps) => {
  const [userInput, setUserInput] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const utilsService = new UtilsService();

  const handleProcessInput = async () => {
    if (!userInput.trim()) return;

    setLoading(true);
    try {
      // This will use the potentially "vulnerable" code that's actually safe
      const processedResult = await utilsService.sanitizeAndExecuteCommand(
        userInput
      );

      // Log user activity (might trigger false positive for info exposure)
      utilsService.logUserActivity("demo-user-123", "process_input");

      // Generate a demo hash (might trigger false positive for weak crypto)
      const demoId = utilsService.generateDemoHash(userInput);

      // Build a demo query (might trigger false positive for SQL injection)
      const demoQuery = utilsService.buildSearchQuery(userInput);

      setResult(`Processed: ${processedResult}, ID: ${demoId.substring(0, 8)}`);

      console.log("Demo query generated:", demoQuery);
    } catch (error) {
      console.error("Processing failed:", error);
      setResult("Processing failed");
    } finally {
      setLoading(false);
    }
  };

  const handleMathCalculation = () => {
    try {
      // This might trigger false positive for eval usage
      const mathResult = utilsService.executeCalculation("2 + 2 * 3");
      setResult(`Math result: ${mathResult}`);
    } catch (error) {
      console.error("Calculation failed:", error);
      setResult("Invalid calculation");
    }
  };

  return (
    <div className={`p-4 border rounded-lg ${className}`}>
      <h3 className="text-lg font-semibold mb-4">
        Demo Component with Potential False Positives
      </h3>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="demo-input"
            className="block text-sm font-medium mb-2"
          >
            Enter some text to process:
          </label>
          <input
            id="demo-input"
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Enter alphanumeric text..."
            className="w-full p-2 border border-gray-300 rounded-lg"
            data-testid="demo-input"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleProcessInput}
            disabled={loading || !userInput.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
            data-testid="process-button"
          >
            {loading ? "Processing..." : "Process Input"}
          </button>

          <button
            onClick={handleMathCalculation}
            className="px-4 py-2 bg-green-500 text-white rounded-lg"
            data-testid="calc-button"
          >
            Demo Math (2 + 2 * 3)
          </button>
        </div>

        {result && (
          <div className="p-3 bg-gray-100 rounded-lg">
            <strong>Result:</strong> {result}
          </div>
        )}
      </div>

      <div className="mt-4 text-xs text-gray-600">
        <p>
          This component demonstrates code patterns that might trigger false
          positives:
        </p>
        <ul className="list-disc list-inside mt-2">
          <li>Command execution with sanitized input</li>
          <li>MD5 hashing for non-security purposes</li>
          <li>SQL-like string construction (not actual SQL)</li>
          <li>Controlled eval-like functionality</li>
          <li>User activity logging</li>
        </ul>
      </div>
    </div>
  );
};
