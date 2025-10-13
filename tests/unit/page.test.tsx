import { render, screen } from "@testing-library/react";
import Home from "../../app/page";

describe("Home", () => {
  it("renders header title and description", () => {
    render(<Home />);
    expect(
      screen.getByRole("heading", { name: /Migration Playground/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Small demo app with unit and E2E tests/i)
    ).toBeInTheDocument();
  });

  it("renders links and attributes", () => {
    render(<Home />);
    const deployLink = screen.getByRole("link", { name: /Deploy now/i });
    expect(deployLink).toBeInTheDocument();
    expect(deployLink).toHaveAttribute(
      "href",
      expect.stringContaining("vercel.com")
    );
    expect(deployLink).toHaveAttribute("rel", "noopener noreferrer");

    const docsLink = screen.getByRole("link", { name: /Read our docs/i });
    expect(docsLink).toBeInTheDocument();
  });

  it("shows items fetched from the API", async () => {
    render(<Home />);
    // ItemList fetch is mocked in jest.setup, wait for items to appear
    const first = await screen.findByText("First item");
    const second = await screen.findByText("Second item");
    expect(first).toBeInTheDocument();
    expect(second).toBeInTheDocument();
  });

  it("renders footer links", () => {
    render(<Home />);
    expect(screen.getByRole("link", { name: /Learn/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Examples/i })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Go to nextjs.org/i })
    ).toBeInTheDocument();
  });
});
