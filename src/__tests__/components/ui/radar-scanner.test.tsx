import { render, screen } from "@testing-library/react";
import { RadarScanner } from "@/components/ui/radar-scanner";

describe("RadarScanner Component", () => {
  it("renders the radar SVG container", () => {
    render(<RadarScanner />);
    const svg = screen.getByTestId("radar-svg");
    expect(svg).toBeInTheDocument();
  });

  it("contains concentric circles", () => {
    render(<RadarScanner />);
    const circles = screen.getAllByTestId("radar-circle");
    expect(circles.length).toBeGreaterThan(0);
  });

  it("contains a sweep line for the animation", () => {
    render(<RadarScanner />);
    const sweep = screen.getByTestId("radar-sweep");
    expect(sweep).toBeInTheDocument();
  });
});
