import React from "react";

/**
 * This component intentionally renders unescaped HTML from user input.
 * It exists only to test whether static analysis / SAST tools detect XSS sinks.
 */
export default function XssSeed({ userContent }: { userContent?: string }) {
  // Simulate receiving untrusted user input as a prop
  const userInput =
    userContent || "<img src=x onerror=\"console.error('xss')\">Hello</img>";

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
