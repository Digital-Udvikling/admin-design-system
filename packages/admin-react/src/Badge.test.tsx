import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Badge } from "./Badge";

describe("Badge", () => {
  it("renders", () => {
    render(<Badge>Beta</Badge>);
    const el = screen.getByText("Beta");
    expect(el).toBeInTheDocument();
    expect(el).toHaveAdminClass("badge", "badge-neutral");
  });

  it("applies variant and size modifiers", () => {
    render(
      <Badge variant="success" size="lg">
        OK
      </Badge>,
    );
    const el = screen.getByText("OK");
    expect(el).toHaveAdminClass("badge", "badge-success", "badge-lg");
  });

  it("omits the size class when size is md", () => {
    render(<Badge variant="danger">Err</Badge>);
    const el = screen.getByText("Err");
    expect(el).not.toHaveAdminClass("badge-md");
  });
});
