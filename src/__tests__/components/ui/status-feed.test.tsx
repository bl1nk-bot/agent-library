import { render, screen, act } from "@testing-library/react";
import { StatusFeed } from "@/components/ui/status-feed";

describe("StatusFeed Component", () => {
  const messages = ["Initializing...", "Scanning...", "Success!"];

  it("renders the initial state with a cursor", () => {
    render(<StatusFeed messages={messages} />);
    const container = screen.getByTestId("status-feed");
    // Should contain the cursor span but no text yet
    expect(container).not.toHaveTextContent("Initializing");
  });

  it("shows messages sequentially", async () => {
    vi.useFakeTimers();
    render(<StatusFeed messages={messages} delay={100} />);
    
    // Advance time for first message
    await act(async () => {
      vi.advanceTimersByTime(100);
    });
    expect(screen.getByText(/Initializing/i)).toBeInTheDocument();

    // Advance for second message
    await act(async () => {
      vi.advanceTimersByTime(100);
    });
    expect(screen.getByText(/Scanning/i)).toBeInTheDocument();

    vi.useRealTimers();
  });
});
