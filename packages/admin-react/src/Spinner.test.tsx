import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Spinner } from "./Spinner";

describe("Spinner", () => {
  it("renders with role=status and a default label", () => {
    render(<Spinner />);
    const el = screen.getByRole("status");
    expect(el).toHaveAttribute("aria-label", "Loading");
    expect(el).toHaveClass("spinner");
  });

  it("accepts a custom label and size modifier", () => {
    render(<Spinner size="lg" label="Saving" />);
    const el = screen.getByRole("status");
    expect(el).toHaveAttribute("aria-label", "Saving");
    expect(el).toHaveClass("spinner-lg");
  });

  it("omits the size class when size is md", () => {
    render(<Spinner />);
    expect(screen.getByRole("status")).not.toHaveClass("spinner-md");
  });
});
