import React from "react";

/**
 * This component intentionally renders unescaped HTML from a "userInput" variable.
 * It exists only to test whether static analysis / SAST tools detect XSS sinks.
 */
export default function XssSeed() {
  // Simulate user input (in a real app this would come from req.body / query / API)
  const userInput = "<img src=x onerror=\"console.error('xss')\">Hello</img>";

  return (
    <div>
      <h3>Test-only XSS sink</h3>
      <div
        dangerouslySetInnerHTML={{ __html: userInput }}
        data-testid="seed-xss-sink"
      />
    </div>
  );
}
