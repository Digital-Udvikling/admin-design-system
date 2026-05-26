import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { AppShell } from "./AppShell";
import { Sidebar } from "./Sidebar";
import { adminSelector } from "./test-setup";

describe("Sidebar", () => {
  it("renders header, nav, items, and footer", () => {
    render(
      <Sidebar>
        <Sidebar.Header>Brand</Sidebar.Header>
        <Sidebar.Nav>
          <Sidebar.Group>
            <Sidebar.GroupLabel>Section</Sidebar.GroupLabel>
            <Sidebar.Item href="#a" active>
              Home
            </Sidebar.Item>
            <Sidebar.Item href="#b">Settings</Sidebar.Item>
          </Sidebar.Group>
        </Sidebar.Nav>
        <Sidebar.Footer>
          <Sidebar.CollapseToggle />
        </Sidebar.Footer>
      </Sidebar>,
    );
    expect(screen.getByText("Brand")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("aria-current", "page");
  });

  it("Item: renders icon/badge into the matching slots and wraps children in a label", () => {
    render(
      <Sidebar>
        <Sidebar.Item href="#x" icon={<svg data-testid="icon" aria-hidden />} badge="12">
          Orders
        </Sidebar.Item>
      </Sidebar>,
    );
    const link = screen.getByRole("link", { name: /Orders/ });
    expect(link.querySelector(adminSelector("sidebar-icon"))).toContainElement(
      screen.getByTestId("icon"),
    );
    expect(link.querySelector(adminSelector("sidebar-label"))).toHaveTextContent("Orders");
    expect(link.querySelector(adminSelector("sidebar-badge"))).toHaveTextContent("12");
  });

  it("does not render children twice when the mobile drawer is closed", () => {
    render(
      <AppShell hasSidebar>
        <Sidebar>
          <Sidebar.Item href="#a">Unique</Sidebar.Item>
        </Sidebar>
        <AppShell.Main />
      </AppShell>,
    );
    expect(screen.getAllByText("Unique")).toHaveLength(1);
  });

  it("does not render children twice when the mobile drawer is open", () => {
    render(
      <AppShell hasSidebar mobileDrawerOpen>
        <Sidebar>
          <Sidebar.Item href="#a">Unique</Sidebar.Item>
        </Sidebar>
        <AppShell.Main />
      </AppShell>,
    );
    expect(screen.getAllByText("Unique")).toHaveLength(1);
  });

  describe("collapse", () => {
    it("uncontrolled: defaultCollapsed seeds the hidden checkbox; clicking the toggle flips it", async () => {
      const user = userEvent.setup();
      const onCollapsedChange = vi.fn();
      render(
        <Sidebar defaultCollapsed onCollapsedChange={onCollapsedChange}>
          <Sidebar.Footer>
            <Sidebar.CollapseToggle />
          </Sidebar.Footer>
        </Sidebar>,
      );
      const checkbox = screen.getByRole("checkbox", { name: "Toggle sidebar" });
      expect(checkbox).toBeChecked();
      await user.click(checkbox);
      expect(checkbox).not.toBeChecked();
      expect(onCollapsedChange).toHaveBeenNthCalledWith(1, false);
    });

    it("controlled: collapsed prop drives the checkbox via onCollapsedChange round-trip", async () => {
      const user = userEvent.setup();
      const onCollapsedChange = vi.fn();
      function Controlled() {
        const [collapsed, setCollapsed] = useState(false);
        return (
          <Sidebar
            collapsed={collapsed}
            onCollapsedChange={(next) => {
              onCollapsedChange(next);
              setCollapsed(next);
            }}
          >
            <Sidebar.Footer>
              <Sidebar.CollapseToggle />
            </Sidebar.Footer>
          </Sidebar>
        );
      }
      render(<Controlled />);
      const checkbox = screen.getByRole("checkbox", { name: "Toggle sidebar" });
      expect(checkbox).not.toBeChecked();
      await user.click(checkbox);
      expect(checkbox).toBeChecked();
      expect(onCollapsedChange).toHaveBeenNthCalledWith(1, true);
    });

    it("controlled: ignores clicks when the parent does not update collapsed", async () => {
      const user = userEvent.setup();
      render(
        <Sidebar collapsed={false} onCollapsedChange={() => {}}>
          <Sidebar.Footer>
            <Sidebar.CollapseToggle />
          </Sidebar.Footer>
        </Sidebar>,
      );
      const checkbox = screen.getByRole("checkbox", { name: "Toggle sidebar" });
      await user.click(checkbox);
      expect(checkbox).not.toBeChecked();
    });
  });

  describe("Collapsible", () => {
    it("expands its panel when the trigger is clicked", async () => {
      const user = userEvent.setup();
      render(
        <Sidebar>
          <Sidebar.Nav>
            <Sidebar.Collapsible label="Webshop">
              <Sidebar.SubItem href="#cms">CMS</Sidebar.SubItem>
            </Sidebar.Collapsible>
          </Sidebar.Nav>
        </Sidebar>,
      );
      const summary = screen.getByText("Webshop");
      const details = summary.closest("details");
      expect(details).not.toHaveAttribute("open");
      await user.click(summary);
      expect(details).toHaveAttribute("open");
    });
  });
});
