import React from "react";

export default function Header() {
  return (
    <header className="w-full max-w-3xl">
      <h1 className="text-2xl font-bold">Migration Playground</h1>
      <p className="text-sm text-muted-foreground">
        Small demo app with unit and E2E tests
      </p>
    </header>
  );
}
