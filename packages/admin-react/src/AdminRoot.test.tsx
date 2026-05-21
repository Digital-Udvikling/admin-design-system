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
    expect(el).toHaveClass("admin-root");
    expect(screen.getByText("inside")).toBeInTheDocument();
  });

  it("merges a caller className without dropping admin-root", () => {
    render(<AdminRoot data-testid="root" className="custom" />);
    const el = screen.getByTestId("root");
    expect(el).toHaveClass("admin-root", "custom");
  });

  it("forwards arbitrary props like data-theme", () => {
    render(<AdminRoot data-testid="root" data-theme="dark" />);
    expect(screen.getByTestId("root")).toHaveAttribute("data-theme", "dark");
  });
});
