import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { AppShell } from "./AppShell";
import { Navbar } from "./Navbar";
import { adminSelector } from "./test-setup";

describe("AppShell", () => {
  it("renders children inside a grid root", () => {
    render(
      <AppShell>
        <AppShell.Main>main content</AppShell.Main>
      </AppShell>,
    );
    expect(screen.getByRole("main")).toHaveTextContent("main content");
    expect(screen.getByRole("main").parentElement).toHaveAdminClass("app-shell");
  });

  it("applies the sidebar layout modifier class", () => {
    const { container } = render(
      <AppShell hasSidebar>
        <AppShell.Main>x</AppShell.Main>
      </AppShell>,
    );
    const root = container.querySelector(adminSelector("app-shell"));
    expect(root).toHaveAdminClass("app-shell-with-sidebar");
  });

  it("sets --color-system-accent from the systemAccent prop", () => {
    const { container } = render(
      <AppShell systemAccent="var(--color-purple-600)">
        <AppShell.Main>x</AppShell.Main>
      </AppShell>,
    );
    const root = container.querySelector<HTMLElement>(adminSelector("app-shell"));
    expect(root?.style.getPropertyValue("--color-system-accent")).toBe("var(--color-purple-600)");
  });

  describe("mobile drawer state", () => {
    it("uncontrolled: the toggle opens and closes, starting from defaultMobileDrawerOpen", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(
        <AppShell defaultMobileDrawerOpen onMobileDrawerOpenChange={onChange}>
          <Navbar.MobileToggle />
        </AppShell>,
      );
      const toggle = screen.getByRole("button", { name: "Open menu" });
      expect(toggle).toHaveAttribute("aria-expanded", "true");
      await user.click(toggle);
      expect(toggle).toHaveAttribute("aria-expanded", "false");
      expect(onChange).toHaveBeenLastCalledWith(false);
      await user.click(toggle);
      expect(toggle).toHaveAttribute("aria-expanded", "true");
    });

    it("controlled: mobileDrawerOpen follows the parent's state", async () => {
      const user = userEvent.setup();
      function Controlled() {
        const [open, setOpen] = useState(false);
        return (
          <AppShell mobileDrawerOpen={open} onMobileDrawerOpenChange={setOpen}>
            <Navbar.MobileToggle />
            <output>{open ? "open" : "closed"}</output>
          </AppShell>
        );
      }
      render(<Controlled />);
      await user.click(screen.getByRole("button", { name: "Open menu" }));
      expect(screen.getByRole("button", { name: "Open menu" })).toHaveAttribute(
        "aria-expanded",
        "true",
      );
      expect(screen.getByRole("status")).toHaveTextContent("open");
    });

    it("controlled: stays closed when the parent ignores the change", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(
        <AppShell mobileDrawerOpen={false} onMobileDrawerOpenChange={onChange}>
          <Navbar.MobileToggle />
        </AppShell>,
      );
      const toggle = screen.getByRole("button", { name: "Open menu" });
      await user.click(toggle);
      expect(onChange).toHaveBeenCalledWith(true);
      expect(toggle).toHaveAttribute("aria-expanded", "false");
    });
  });
});
