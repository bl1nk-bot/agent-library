import { render, screen } from "@testing-library/react";
import { Sidebar } from "@/components/layout/sidebar";

describe("Sidebar Component", () => {
  it("renders navigation items", () => {
    render(<Sidebar />);
    // Check for aria-labels or text of nav items
    expect(screen.getByLabelText(/dashboard/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/agents/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/settings/i)).toBeInTheDocument();
  });

  it("displays agent status indicators", () => {
    render(<Sidebar />);
    const indicators = screen.getAllByTestId("agent-status-indicator");
    expect(indicators.length).toBeGreaterThan(0);
  });
});
