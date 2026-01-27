import { render, screen } from "@testing-library/react";
import { Background } from "@/components/ui/background";

describe("Background Component", () => {
  it("renders children", () => {
    render(<Background>Test Content</Background>);
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("has the noise overlay", () => {
     render(<Background>Test</Background>);
     // Expecting an element with this testid
     const noise = screen.getByTestId("noise-overlay");
     expect(noise).toBeInTheDocument();
  });
});
