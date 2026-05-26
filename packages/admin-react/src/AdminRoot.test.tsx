import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AdminRoot } from "./AdminRoot";
import { usePortalContainer } from "./PortalContainerContext";

describe("AdminRoot", () => {
  it("renders a div carrying the admin-root class", () => {
    render(
      <AdminRoot data-testid="root">
        <span>inside</span>
      </AdminRoot>,
    );
    const el = screen.getByTestId("root");
    expect(el.tagName).toBe("DIV");
    expect(el).toHaveAdminClass("admin-root");
    expect(screen.getByText("inside")).toBeInTheDocument();
  });

  it("merges a caller className without dropping admin-root", () => {
    render(<AdminRoot data-testid="root" className="custom" />);
    const el = screen.getByTestId("root");
    expect(el).toHaveAdminClass("admin-root");
    expect(el).toHaveClass("custom");
  });

  it("forwards arbitrary props like data-theme", () => {
    render(<AdminRoot data-testid="root" data-theme="dark" />);
    expect(screen.getByTestId("root")).toHaveAttribute("data-theme", "dark");
  });

  it("sets data-theme from the theme prop", () => {
    render(<AdminRoot data-testid="root" theme="dark" />);
    expect(screen.getByTestId("root")).toHaveAttribute("data-theme", "dark");
  });

  it("prefers theme over an explicit data-theme", () => {
    render(<AdminRoot data-testid="root" theme="dark" data-theme="light" />);
    expect(screen.getByTestId("root")).toHaveAttribute("data-theme", "dark");
  });

  it("sets --color-system-accent from the systemAccent prop", () => {
    render(<AdminRoot data-testid="root" systemAccent="var(--color-purple-600)" />);
    const el = screen.getByTestId("root");
    expect(el.style.getPropertyValue("--color-system-accent")).toBe("var(--color-purple-600)");
  });

  it("merges systemAccent with a caller-supplied style", () => {
    render(
      <AdminRoot
        data-testid="root"
        systemAccent="var(--color-green-600)"
        style={{ minHeight: "100vh" }}
      />,
    );
    const el = screen.getByTestId("root");
    expect(el.style.getPropertyValue("--color-system-accent")).toBe("var(--color-green-600)");
    expect(el.style.minHeight).toBe("100vh");
  });

  it("provides a portal-host div inside the admin-root tree via context", () => {
    const seen: Array<HTMLElement | null> = [];
    function Probe() {
      seen.push(usePortalContainer());
      return null;
    }
    render(
      <AdminRoot data-testid="root">
        <Probe />
      </AdminRoot>,
    );
    const root = screen.getByTestId("root");
    const portal = seen.at(-1);
    expect(portal).toBeInstanceOf(HTMLElement);
    expect(root.contains(portal as HTMLElement)).toBe(true);
    expect((portal as HTMLElement).getAttribute("data-admin-portal-host")).toBe("");
  });
});

describe("AdminRoot isolated", () => {
  it("attaches an open shadow root on the host element", () => {
    render(<AdminRoot isolated data-testid="root" />);
    const host = screen.getByTestId("root");
    expect(host.tagName).toBe("DIV");
    expect(host.shadowRoot).not.toBeNull();
    expect(host.shadowRoot?.mode).toBe("open");
  });

  it("renders the admin-root div inside the shadow root, not the light DOM", () => {
    render(
      <AdminRoot isolated data-testid="root">
        <span data-testid="child">isolated child</span>
      </AdminRoot>,
    );
    const host = screen.getByTestId("root");
    // The host div itself does not carry admin-root in isolated mode.
    expect(host).not.toHaveAdminClass("admin-root");
    // The child is not in the document's light DOM; it lives in the shadow.
    expect(screen.queryByTestId("child")).toBeNull();
    const inner = host.shadowRoot?.querySelector(".admin-root");
    expect(inner).not.toBeNull();
    expect(inner?.querySelector('[data-testid="child"]')?.textContent).toBe("isolated child");
  });

  it("forwards data-theme to the inner admin-root in isolated mode", () => {
    render(<AdminRoot isolated data-testid="root" theme="dark" />);
    const host = screen.getByTestId("root");
    const inner = host.shadowRoot?.querySelector(".admin-root");
    expect(inner?.getAttribute("data-theme")).toBe("dark");
    // Host carries no data-theme; the inner div owns the theme attribute.
    expect(host.getAttribute("data-theme")).toBeNull();
  });

  it("applies systemAccent as an inline style on the inner admin-root", () => {
    render(<AdminRoot isolated data-testid="root" systemAccent="var(--color-blue-600)" />);
    const host = screen.getByTestId("root");
    const inner = host.shadowRoot?.querySelector(".admin-root") as HTMLElement | null;
    expect(inner?.style.getPropertyValue("--color-system-accent")).toBe("var(--color-blue-600)");
  });

  it("exposes a portal-host inside the shadow root via context", () => {
    const seen: Array<HTMLElement | null> = [];
    function Probe() {
      seen.push(usePortalContainer());
      return null;
    }
    render(
      <AdminRoot isolated data-testid="root">
        <Probe />
      </AdminRoot>,
    );
    const host = screen.getByTestId("root");
    const shadow = host.shadowRoot;
    const portal = seen.at(-1);
    expect(portal).toBeInstanceOf(HTMLElement);
    expect(shadow?.contains(portal as HTMLElement)).toBe(true);
    expect((portal as HTMLElement).getAttribute("data-admin-portal-host")).toBe("");
  });

  it("attaches an admin stylesheet to the shadow root", () => {
    render(<AdminRoot isolated data-testid="root" />);
    const shadow = screen.getByTestId("root").shadowRoot!;
    const hasAdoptedSheet = shadow.adoptedStyleSheets.length > 0;
    const hasStyleElement = shadow.querySelector("style") !== null;
    expect(hasAdoptedSheet || hasStyleElement).toBe(true);
  });
});
