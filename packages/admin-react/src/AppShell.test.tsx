import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AppShell } from "./AppShell";

describe("AppShell", () => {
  it("renders children inside a grid root", () => {
    render(
      <AppShell>
        <AppShell.Main>main content</AppShell.Main>
      </AppShell>,
    );
    expect(screen.getByRole("main")).toHaveTextContent("main content");
    expect(screen.getByRole("main").parentElement).toHaveClass("app-shell");
  });

  it("applies layout modifier classes for sidebar and footer", () => {
    const { container } = render(
      <AppShell hasSidebar hasFooter>
        <AppShell.Main>x</AppShell.Main>
      </AppShell>,
    );
    const root = container.querySelector(".app-shell");
    expect(root).toHaveClass("app-shell-with-sidebar");
    expect(root).toHaveClass("app-shell-with-footer");
  });

  it("sets --color-system-accent from the systemAccent prop", () => {
    const { container } = render(
      <AppShell systemAccent="var(--color-purple-600)">
        <AppShell.Main>x</AppShell.Main>
      </AppShell>,
    );
    const root = container.querySelector<HTMLElement>(".app-shell");
    expect(root?.style.getPropertyValue("--color-system-accent")).toBe("var(--color-purple-600)");
  });
});
