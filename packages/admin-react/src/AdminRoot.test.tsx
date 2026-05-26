import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AdminRoot } from "./AdminRoot";

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
});
