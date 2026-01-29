import { render, screen } from "@testing-library/react";
import { CommandLayout } from "@/components/layout/command-layout";

// Mock Framer Motion to avoid animation issues in test environment
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, ...props }: any) => <div className={className} data-testid="motion-div" {...props}>{children}</div>,
    aside: ({ children, className, ...props }: any) => <aside className={className} data-testid="motion-aside" {...props}>{children}</aside>
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe("CommandLayout Component", () => {
  it("renders three main sections", () => {
    render(
      <CommandLayout 
        sidebar={<div>Sidebar</div>}
        contextPanel={<div>Context</div>}
      >
        <div>Main Content</div>
      </CommandLayout>
    );

    expect(screen.getByText("Sidebar")).toBeInTheDocument();
    expect(screen.getByText("Main Content")).toBeInTheDocument();
    expect(screen.getByText("Context")).toBeInTheDocument();
  });

  it("has full height structure", () => {
    render(
        <CommandLayout 
          sidebar={<div>Sidebar</div>}
          contextPanel={<div>Context</div>}
        >
          <div>Main</div>
        </CommandLayout>
      );
      
      const container = screen.getByTestId("command-layout-container");
      expect(container).toHaveClass("h-screen");
      expect(container).toHaveClass("overflow-hidden");
  });
});
