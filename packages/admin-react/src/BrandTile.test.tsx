import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BrandTile } from "./BrandTile";

describe("BrandTile", () => {
  it("renders a monogram", () => {
    render(<BrandTile monogram="OR" data-testid="tile" />);
    const el = screen.getByTestId("tile");
    expect(el).toHaveAdminClass("brand-tile");
    expect(el).toHaveTextContent("OR");
  });

  it("renders an icon and ignores the monogram when both are provided", () => {
    function Icon(props: { size?: number | string; "aria-hidden"?: boolean | "true" | "false" }) {
      return <svg data-testid="icon" {...props} />;
    }
    render(<BrandTile monogram="OR" icon={Icon} data-testid="tile" />);
    const el = screen.getByTestId("tile");
    expect(el).not.toHaveTextContent("OR");
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });
});
