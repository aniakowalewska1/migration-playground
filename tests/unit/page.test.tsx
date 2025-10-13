import { render, screen } from "@testing-library/react";
import Home from "../../app/page";

describe("Home", () => {
  it("renders the Next.js logo", () => {
    render(<Home />);
    const logo = screen.getByAltText("Next.js logo");
    expect(logo).toBeInTheDocument();
  });

  it("displays the getting started text", () => {
    render(<Home />);
    expect(screen.getByText(/Get started by editing/i)).toBeInTheDocument();
    expect(screen.getByText("app/page.tsx")).toBeInTheDocument();
  });

  it("displays save and see changes text", () => {
    render(<Home />);
    expect(
      screen.getByText(/Save and see your changes instantly/i)
    ).toBeInTheDocument();
  });

  it("renders Deploy now link", () => {
    render(<Home />);
    const deployLink = screen.getByRole("link", { name: /Deploy now/i });
    expect(deployLink).toBeInTheDocument();
    expect(deployLink).toHaveAttribute(
      "href",
      expect.stringContaining("vercel.com")
    );
    expect(deployLink).toHaveAttribute("target", "_blank");
    expect(deployLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders Read our docs link", () => {
    render(<Home />);
    const docsLink = screen.getByRole("link", { name: /Read our docs/i });
    expect(docsLink).toBeInTheDocument();
    expect(docsLink).toHaveAttribute(
      "href",
      expect.stringContaining("nextjs.org/docs")
    );
    expect(docsLink).toHaveAttribute("target", "_blank");
  });

  it("renders footer links", () => {
    render(<Home />);
    expect(screen.getByRole("link", { name: /Learn/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Examples/i })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Go to nextjs.org/i })
    ).toBeInTheDocument();
  });

  it("renders all expected images", () => {
    render(<Home />);
    const images = screen.getAllByRole("img");
    // Next.js logo, Vercel logo, file icon, window icon, globe icon
    expect(images.length).toBeGreaterThanOrEqual(2);
  });
});
