import { render, screen } from "@testing-library/react";
import GatewayPage from "@/app/gateway/page";

describe("Gateway Page", () => {
  it("renders the initialization button", () => {
    render(<GatewayPage />);
    const button = screen.getByRole("button", { name: /initialize deck/i });
    expect(button).toBeInTheDocument();
  });

  it("renders the main container", () => {
      render(<GatewayPage />);
      // We expect a main role for the page content
      const main = screen.getByRole("main");
      expect(main).toBeInTheDocument();
  })
});
