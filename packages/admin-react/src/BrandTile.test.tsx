import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BrandTile } from "./BrandTile";

describe("BrandTile", () => {
  it("renders a monogram with no modifier classes by default", () => {
    render(<BrandTile monogram="OR" data-testid="tile" />);
    const el = screen.getByTestId("tile");
    expect(el).toHaveAdminClass("brand-tile");
    expect(el).not.toHaveAdminClass("brand-tile-lg");
    expect(el).not.toHaveAdminClass("brand-tile-soft");
    expect(el).toHaveTextContent("OR");
  });

  it("applies the lg size class", () => {
    render(<BrandTile monogram="OR" size="lg" data-testid="tile" />);
    expect(screen.getByTestId("tile")).toHaveAdminClass("brand-tile", "brand-tile-lg");
  });

  it("applies the variant class for soft tints", () => {
    render(<BrandTile monogram="OR" variant="success" data-testid="tile" />);
    expect(screen.getByTestId("tile")).toHaveAdminClass("brand-tile", "brand-tile-success");
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

  it("renders the icon at 1em so CSS sizes the glyph", () => {
    function Icon(props: { size?: number | string; "aria-hidden"?: boolean | "true" | "false" }) {
      return <svg data-testid="icon" width={props.size} {...props} />;
    }
    render(<BrandTile icon={Icon} data-testid="tile" />);
    expect(screen.getByTestId("icon")).toHaveAttribute("width", "1em");
  });

  it("renders an image and ignores icon and monogram", () => {
    function Icon() {
      return <svg data-testid="icon" />;
    }
    render(<BrandTile monogram="OR" icon={Icon} src="/logo.png" alt="Acme" data-testid="tile" />);
    const el = screen.getByTestId("tile");
    expect(el).not.toHaveTextContent("OR");
    expect(screen.queryByTestId("icon")).not.toBeInTheDocument();
    const img = el.querySelector("img");
    expect(img).toHaveAttribute("src", "/logo.png");
    expect(img).toHaveAttribute("alt", "Acme");
  });

  it("hides monogram and icon tiles from assistive tech", () => {
    render(<BrandTile monogram="OR" data-testid="tile" />);
    expect(screen.getByTestId("tile")).toHaveAttribute("aria-hidden", "true");
  });

  it("does not hide image tiles so alt reaches assistive tech", () => {
    render(<BrandTile src="/logo.png" alt="Acme" data-testid="tile" />);
    expect(screen.getByTestId("tile")).not.toHaveAttribute("aria-hidden");
  });

  it("defaults the image alt to an empty string", () => {
    render(<BrandTile src="/logo.png" data-testid="tile" />);
    expect(screen.getByTestId("tile").querySelector("img")).toHaveAttribute("alt", "");
  });
});
