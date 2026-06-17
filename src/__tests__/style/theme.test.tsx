import { render, screen } from "@testing-library/react";
import React from "react";

const ThemeTestComponent = () => (
  <div className="bg-obsidian text-agent-cyan border-glass font-sans">Theme Test</div>
);

describe("Theme Configuration", () => {
  it("should have a placeholder test for theme", () => {
    expect(true).toBe(true);
  });

  it("renders a component with Ashval design classes", () => {
    render(<ThemeTestComponent />);
    const el = screen.getByText("Theme Test");
    expect(el).toBeInTheDocument();
  });
});
