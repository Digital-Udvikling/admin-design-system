import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { AdminRoot } from "./AdminRoot";
import { AppShell } from "./AppShell";
import { Sidebar } from "./Sidebar";
import { adminSelector, RouterLink } from "./test-setup";

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

  it("SubItem: wraps children in a label and forwards classNames.label", () => {
    render(
      <Sidebar>
        <Sidebar.SubItem href="#cms" classNames={{ label: "x-label" }}>
          CMS
        </Sidebar.SubItem>
      </Sidebar>,
    );
    const label = screen
      .getByRole("link", { name: "CMS" })
      .querySelector(adminSelector("sidebar-label"));
    expect(label).toHaveTextContent("CMS");
    expect(label).toHaveClass("x-label");
  });

  it("Item: an empty badge renders no badge wrapper", () => {
    render(
      <Sidebar>
        <Sidebar.Item href="#x" badge={null}>
          Orders
        </Sidebar.Item>
        <Sidebar.Item href="#y" badge="">
          Customers
        </Sidebar.Item>
      </Sidebar>,
    );
    expect(document.querySelector(adminSelector("sidebar-badge"))).toBeNull();
  });

  it("forwards classNames to slots", () => {
    render(
      <Sidebar>
        <Sidebar.Item href="#x" classNames={{ label: "x-custom" }}>
          Orders
        </Sidebar.Item>
      </Sidebar>,
    );
    expect(screen.getByText("Orders")).toHaveClass("x-custom");
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

  it("portals the mobile drawer inside AdminRoot so scoped styles reach it", async () => {
    render(
      <AdminRoot>
        <AppShell hasSidebar defaultMobileDrawerOpen>
          <Sidebar>
            <Sidebar.Item href="#a">Unique</Sidebar.Item>
          </Sidebar>
          <AppShell.Main />
        </AppShell>
      </AdminRoot>,
    );
    const link = await screen.findByRole("link", { name: "Unique" });
    const drawer = link.closest(adminSelector("sidebar-drawer"));
    expect(drawer).not.toBeNull();
    expect(drawer?.closest(adminSelector("admin-root"))).not.toBeNull();
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

    it("collapses the rail without a CollapseToggle", () => {
      const { container, rerender } = render(<Sidebar collapsed />);
      const aside = container.querySelector("aside");
      expect(aside).toHaveAttribute("data-collapsed");
      rerender(<Sidebar collapsed={false} />);
      expect(aside).not.toHaveAttribute("data-collapsed");
    });

    it("uncontrolled: the toggle flips data-collapsed on the root", async () => {
      const user = userEvent.setup();
      const { container } = render(
        <Sidebar defaultCollapsed>
          <Sidebar.Footer>
            <Sidebar.CollapseToggle />
          </Sidebar.Footer>
        </Sidebar>,
      );
      const aside = container.querySelector("aside");
      expect(aside).toHaveAttribute("data-collapsed");
      await user.click(screen.getByRole("checkbox", { name: "Toggle sidebar" }));
      expect(aside).not.toHaveAttribute("data-collapsed");
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

    it("controlled: open drives the panel via onOpenChange round-trip", async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();
      function Controlled() {
        const [open, setOpen] = useState(false);
        return (
          <Sidebar.Collapsible
            label="Webshop"
            open={open}
            onOpenChange={(next) => {
              onOpenChange(next);
              setOpen(next);
            }}
          >
            <Sidebar.SubItem href="#cms">CMS</Sidebar.SubItem>
          </Sidebar.Collapsible>
        );
      }
      render(<Controlled />);
      const summary = screen.getByText("Webshop");
      const details = summary.closest("details");
      await user.click(summary);
      expect(details).toHaveAttribute("open");
      await user.click(summary);
      expect(details).not.toHaveAttribute("open");
      expect(onOpenChange.mock.calls).toEqual([[true], [false]]);
    });

    it("controlled: ignores clicks when the parent does not update open", async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();
      render(
        <Sidebar.Collapsible label="Webshop" open={false} onOpenChange={onOpenChange}>
          <Sidebar.SubItem href="#cms">CMS</Sidebar.SubItem>
        </Sidebar.Collapsible>,
      );
      const summary = screen.getByText("Webshop");
      await user.click(summary);
      expect(summary.closest("details")).not.toHaveAttribute("open");
      expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(true);
    });
  });

  it("render: Item and SubItem render onto a router link", () => {
    render(
      <>
        <Sidebar.Item active badge="3" render={<RouterLink href="/orders" />}>
          Orders
        </Sidebar.Item>
        <Sidebar.SubItem render={<RouterLink href="/orders/open" />}>Open</Sidebar.SubItem>
      </>,
    );
    const item = screen.getByRole("link", { name: /Orders/ });
    expect(item).toHaveAttribute("data-router");
    expect(item).toHaveAdminClass("sidebar-item");
    expect(item).toHaveAttribute("aria-current", "page");
    expect(item.querySelector(adminSelector("sidebar-badge"))).toHaveTextContent("3");
    const sub = screen.getByRole("link", { name: "Open" });
    expect(sub).toHaveAttribute("data-router");
    expect(sub).toHaveAdminClass("sidebar-subitem");
  });
});
