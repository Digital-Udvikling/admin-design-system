import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { AppShell } from "./AppShell";
import { Navbar } from "./Navbar";

describe("Navbar", () => {
  it("renders brand, items, and actions", () => {
    render(
      <Navbar>
        <Navbar.Brand>Acme</Navbar.Brand>
        <Navbar.Items>
          <Navbar.Item href="#orders">Orders</Navbar.Item>
          <Navbar.Item href="#users" active>
            Users
          </Navbar.Item>
        </Navbar.Items>
        <Navbar.Actions>
          <button type="button">Sign out</button>
        </Navbar.Actions>
      </Navbar>,
    );
    expect(screen.getByText("Acme")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Users" })).toHaveAttribute("aria-current", "page");
  });

  describe("MobileToggle", () => {
    it("toggles the AppShell mobile drawer state when clicked", async () => {
      const user = userEvent.setup();
      render(
        <AppShell hasSidebar>
          <Navbar>
            <Navbar.MobileToggle />
            <Navbar.Brand>Acme</Navbar.Brand>
          </Navbar>
        </AppShell>,
      );
      const toggle = screen.getByRole("button", { name: "Open menu" });
      expect(toggle).toHaveAttribute("aria-expanded", "false");
      await user.click(toggle);
      expect(toggle).toHaveAttribute("aria-expanded", "true");
      await user.click(toggle);
      expect(toggle).toHaveAttribute("aria-expanded", "false");
    });
  });
});
