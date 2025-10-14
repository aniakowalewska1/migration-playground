import "@testing-library/jest-dom";

// Provide a simple global fetch mock for tests that render client components
// which call fetch (e.g. components/ItemList).
// eslint-disable-next-line @typescript-eslint/no-unused-vars
globalThis.fetch = (input: RequestInfo | URL, _init?: RequestInit) => {
  const url = typeof input === "string" ? input : input?.toString();
  // Resolve on next tick to ensure Testing Library's async helpers wrap updates with act()
  return new Promise((resolve) => {
    setTimeout(() => {
      if (url?.includes("/api/items")) {
        const body = [
          { id: "1", name: "First item" },
          { id: "2", name: "Second item" },
        ];
        resolve({
          ok: true,
          status: 200,
          json: async () => body,
          text: async () => JSON.stringify(body),
        } as unknown as Response);
        return;
      }
      resolve({
        ok: false,
        status: 404,
        json: async () => null,
      } as unknown as Response);
    }, 0);
  });
};
