import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AppShell } from "./AppShell";
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

  it("applies layout modifier classes for sidebar and footer", () => {
    const { container } = render(
      <AppShell hasSidebar hasFooter>
        <AppShell.Main>x</AppShell.Main>
      </AppShell>,
    );
    const root = container.querySelector(adminSelector("app-shell"));
    expect(root).toHaveAdminClass("app-shell-with-sidebar");
    expect(root).toHaveAdminClass("app-shell-with-footer");
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
});
