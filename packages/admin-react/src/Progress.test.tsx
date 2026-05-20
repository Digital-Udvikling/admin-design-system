import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Progress } from "./Progress";

describe("Progress", () => {
  it("renders as a determinate <progress> when value is set", () => {
    render(<Progress value={42} aria-label="Loading" />);
    const el = screen.getByRole("progressbar", { name: "Loading" });
    expect(el.tagName).toBe("PROGRESS");
    expect(el).toHaveAttribute("value", "42");
    expect(el).toHaveAttribute("max", "100");
    expect(el).toHaveClass("progress");
  });

  it("renders as indeterminate when value is omitted", () => {
    render(<Progress aria-label="Working" />);
    const el = screen.getByRole("progressbar", { name: "Working" });
    expect(el).not.toHaveAttribute("value");
  });

  it("applies variant + size modifiers", () => {
    render(<Progress value={10} variant="danger" size="lg" aria-label="x" />);
    const el = screen.getByRole("progressbar", { name: "x" });
    expect(el).toHaveClass("progress", "progress-danger", "progress-lg");
  });

  it("omits the primary variant class", () => {
    render(<Progress value={0} aria-label="x" />);
    expect(screen.getByRole("progressbar", { name: "x" })).not.toHaveClass("progress-primary");
  });
});
