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

  it("sets --color-system-accent from the systemAccent prop", () => {
    render(<Navbar data-testid="nav" systemAccent="var(--color-purple-600)" />);
    expect(screen.getByTestId("nav").style.getPropertyValue("--color-system-accent")).toBe(
      "var(--color-purple-600)",
    );
  });

  it("merges systemAccent with a caller-supplied style", () => {
    render(
      <Navbar
        data-testid="nav"
        systemAccent="var(--color-green-600)"
        style={{ position: "sticky" }}
      />,
    );
    const el = screen.getByTestId("nav");
    expect(el.style.getPropertyValue("--color-system-accent")).toBe("var(--color-green-600)");
    expect(el.style.position).toBe("sticky");
  });

  describe("Dropdown", () => {
    it("marks an active trigger and renders its icon and slot classes", () => {
      render(
        <Navbar>
          <Navbar.Items>
            <Navbar.Dropdown
              label="Reports"
              active
              icon={<svg data-testid="icon" aria-hidden />}
              classNames={{ trigger: "x-trigger", popup: "x-popup" }}
            >
              <button type="button">Sales</button>
            </Navbar.Dropdown>
          </Navbar.Items>
        </Navbar>,
      );
      const trigger = screen.getByText("Reports");
      expect(trigger).toHaveAdminClass("navbar-item", "menu-trigger");
      expect(trigger).toHaveClass("x-trigger");
      expect(trigger).toHaveAttribute("data-active");
      expect(trigger).toContainElement(screen.getByTestId("icon"));
      expect(screen.getByRole("menu", { hidden: true })).toHaveClass("x-popup");
    });

    it("leaves data-active off by default", () => {
      render(
        <Navbar.Dropdown label="Reports">
          <button type="button">Sales</button>
        </Navbar.Dropdown>,
      );
      expect(screen.getByText("Reports")).not.toHaveAttribute("data-active");
    });
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
