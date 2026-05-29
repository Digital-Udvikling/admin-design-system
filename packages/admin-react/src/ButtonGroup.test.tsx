import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "./Button";
import { ButtonGroup } from "./ButtonGroup";

describe("ButtonGroup", () => {
  it("renders", () => {
    render(
      <ButtonGroup>
        <Button>a</Button>
        <Button>b</Button>
      </ButtonGroup>,
    );
    expect(screen.getByRole("button", { name: "a" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "b" })).toBeInTheDocument();
  });

  it("applies the full-width modifier", () => {
    render(
      <ButtonGroup fullWidth>
        <Button>a</Button>
      </ButtonGroup>,
    );
    expect(screen.getByRole("group")).toHaveClass("_ao-btn-group-full-width");
  });

  it("omits the full-width modifier by default", () => {
    render(
      <ButtonGroup>
        <Button>a</Button>
      </ButtonGroup>,
    );
    expect(screen.getByRole("group")).not.toHaveClass("_ao-btn-group-full-width");
  });
});
