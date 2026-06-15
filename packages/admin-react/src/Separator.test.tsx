import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Separator } from "./Separator";

describe("Separator", () => {
  it("renders", () => {
    render(<Separator />);
    const root = screen.getByRole("separator");
    expect(root.tagName).toBe("HR");
    expect(root).toHaveAdminClass("separator");
    expect(root).not.toHaveAdminClass("separator-vertical");
    expect(root).not.toHaveAttribute("aria-orientation");
  });

  it("vertical adds the modifier class and aria-orientation", () => {
    render(<Separator orientation="vertical" />);
    const root = screen.getByRole("separator");
    expect(root).toHaveAdminClass("separator", "separator-vertical");
    expect(root).toHaveAttribute("aria-orientation", "vertical");
  });

  it("passes through a consumer className verbatim", () => {
    render(<Separator className="my-4" />);
    const root = screen.getByRole("separator");
    expect(root).toHaveAdminClass("separator");
    expect(root).toHaveClass("my-4");
  });
});
