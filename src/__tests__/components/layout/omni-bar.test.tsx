import { render, screen, fireEvent } from "@testing-library/react";
import { OmniBar } from "@/components/layout/omni-bar";

describe("OmniBar Component", () => {
  it("renders input field", () => {
    render(<OmniBar />);
    expect(screen.getByPlaceholderText(/type a command/i)).toBeInTheDocument();
  });

  it("handles input change", () => {
    render(<OmniBar />);
    const input = screen.getByPlaceholderText(/type a command/i);
    fireEvent.change(input, { target: { value: "/help" } });
    expect(input).toHaveValue("/help");
  });

  it("renders agent switcher", () => {
    render(<OmniBar />);
    // Check for agent switcher button/icon
    expect(screen.getByTestId("agent-switcher")).toBeInTheDocument();
  });
});
