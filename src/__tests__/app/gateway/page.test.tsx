import { render, screen, fireEvent, act } from "@testing-library/react";
import GatewayPage from "@/app/gateway/page";

// Mock child components to isolate Gateway logic
vi.mock('@/components/ui/radar-scanner', () => ({
  RadarScanner: () => <div data-testid="radar-scanner">Radar</div>
}));
vi.mock('@/components/ui/status-feed', () => ({
  StatusFeed: ({ messages }: { messages: string[] }) => (
    <div data-testid="status-feed">{messages.join(',')}</div>
  )
}));

describe("Gateway Page", () => {
  it("renders the synchronization button", () => {
    render(<GatewayPage />);
    const button = screen.getByRole("button", { name: /synchronize environment/i });
    expect(button).toBeInTheDocument();
  });

  it("starts scanning sequence on click", async () => {
    render(<GatewayPage />);
    const button = screen.getByRole("button", { name: /synchronize environment/i });
    
    await act(async () => {
      fireEvent.click(button);
    });
    
    // Check if the button changes state or text (e.g., "Scanning...")
    // Or if a specific scan UI appears
    expect(screen.getByText(/scanning/i)).toBeInTheDocument();
  });
});
