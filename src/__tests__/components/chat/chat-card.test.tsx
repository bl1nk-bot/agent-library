import { render, screen } from "@testing-library/react";
import { ChatCard } from "@/components/chat/chat-card";

describe("ChatCard Component", () => {
  const mockMessage = {
    role: "assistant",
    content: "This is a response",
    agent: "Gemini"
  };

  it("renders message content", () => {
    render(<ChatCard message={mockMessage} />);
    expect(screen.getByText("This is a response")).toBeInTheDocument();
  });

  it("displays agent accent color", () => {
    render(<ChatCard message={mockMessage} />);
    const card = screen.getByTestId("chat-card");
    // Check if class contains agent specific color logic (mocked or direct class check)
    // We expect border-l-agent-gold for Gemini
    expect(card.className).toContain("border-l-agent-gold");
  });
});
