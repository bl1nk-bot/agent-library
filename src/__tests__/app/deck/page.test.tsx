import { render, screen } from "@testing-library/react";
import DeckPage from "@/app/deck/page";

// Mock child components to avoid complex integration issues in unit test
vi.mock('@/components/layout/command-layout', () => ({
  CommandLayout: ({ children, sidebar, contextPanel }: any) => (
    <div data-testid="command-layout">
      <div data-testid="sidebar-slot">{sidebar}</div>
      <div data-testid="main-content">{children}</div>
      <div data-testid="context-slot">{contextPanel}</div>
    </div>
  )
}));

vi.mock('@/components/layout/sidebar', () => ({ Sidebar: () => <div>SidebarMock</div> }));
vi.mock('@/components/layout/context-panel', () => ({ ContextPanel: () => <div>ContextMock</div> }));
vi.mock('@/components/layout/omni-bar', () => ({ OmniBar: () => <div>OmniBarMock</div> }));
vi.mock('@/components/chat/chat-card', () => ({ ChatCard: () => <div>ChatCardMock</div> }));

describe("Deck Page", () => {
  it("assembles the layout correctly", () => {
    render(<DeckPage />);
    
    expect(screen.getByTestId("command-layout")).toBeInTheDocument();
    expect(screen.getByText("SidebarMock")).toBeInTheDocument();
    expect(screen.getByText("ContextMock")).toBeInTheDocument();
    expect(screen.getByText("OmniBarMock")).toBeInTheDocument();
  });
});
