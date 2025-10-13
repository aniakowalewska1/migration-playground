import { render, screen } from "@testing-library/react";
import Header from "../../components/Header";

describe("Header", () => {
  it("renders title and description", () => {
    render(<Header />);
    expect(screen.getByText(/Migration Playground/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Small demo app with unit and E2E tests/i)
    ).toBeInTheDocument();
  });
});
