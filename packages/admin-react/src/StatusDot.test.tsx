import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StatusDot } from "./StatusDot";

describe("StatusDot", () => {
  it("renders a decorative dot without a label", () => {
    const { container } = render(<StatusDot variant="success" />);
    const dot = container.firstElementChild;
    expect(dot).toHaveAdminClass("indicator-dot", "indicator-dot-success");
    expect(dot).toHaveAttribute("aria-hidden", "true");
    expect(dot).not.toHaveAttribute("role");
  });

  it("with aria-label, is a named status", () => {
    render(<StatusDot variant="danger" aria-label="Offline" />);
    const dot = screen.getByRole("status", { name: "Offline" });
    expect(dot).toHaveAdminClass("indicator-dot", "indicator-dot-danger");
    expect(dot).not.toHaveAttribute("aria-hidden");
  });

  it("neutral emits no variant class", () => {
    const { container } = render(<StatusDot className="ml-1" />);
    expect(container.firstElementChild?.className).toBe("_ao-indicator-dot ml-1");
  });
});
