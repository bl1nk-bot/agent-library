import { render, screen, fireEvent } from "@testing-library/react";
import { InitializeButton } from "@/components/ui/initialize-button";

describe("InitializeButton Component", () => {
  it("renders with correct text", () => {
    render(<InitializeButton />);
    expect(screen.getByRole("button")).toHaveTextContent(/INITIALIZE DECK/i);
  });

  it("calls onClick when clicked", () => {
    const handleClick = vi.fn();
    render(<InitializeButton onClick={handleClick} />);
    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("has the pulse animation class", () => {
    render(<InitializeButton />);
    const button = screen.getByRole("button");
    // We expect an animate-pulse or custom pulse class
    expect(button.className).toContain("animate-pulse");
  });
});
