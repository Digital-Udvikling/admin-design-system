import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Container } from "./Container";

describe("Container", () => {
  it("renders the base class and omits the size class at the md default", () => {
    render(<Container>page body</Container>);
    const el = screen.getByText("page body");
    expect(el).toBeInTheDocument();
    expect(el).toHaveAdminClass("container");
    expect(el).not.toHaveAdminClass("container-md");
  });

  it("emits the size modifier when not md", () => {
    render(<Container size="lg">wide</Container>);
    expect(screen.getByText("wide")).toHaveAdminClass("container", "container-lg");
  });

  it("supports the fluid width via the size prop", () => {
    render(<Container size="fluid">bleed</Container>);
    expect(screen.getByText("bleed")).toHaveAdminClass("container", "container-fluid");
  });

  it("emits the compact modifier alongside a size", () => {
    render(
      <Container size="sm" compact>
        dense
      </Container>,
    );
    expect(screen.getByText("dense")).toHaveAdminClass(
      "container",
      "container-sm",
      "container-compact",
    );
  });

  it("passes the consumer className through unprefixed and forwards rest props", () => {
    render(
      <Container className="my-page" data-testid="region">
        x
      </Container>,
    );
    const el = screen.getByTestId("region");
    expect(el).toHaveAdminClass("container");
    expect(el).toHaveClass("my-page");
  });
});
