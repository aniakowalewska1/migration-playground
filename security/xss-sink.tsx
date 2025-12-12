import React from "react";

// Vulnerability: Simulate receiving untrusted user input as a prop
export default function XssSeed({ userContent }: { userContent?: string }) {
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
