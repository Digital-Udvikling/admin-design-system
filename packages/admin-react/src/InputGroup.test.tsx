import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Input } from "./Input";
import { InputGroup } from "./InputGroup";

describe("InputGroup", () => {
  it("renders with addons on either side of an Input", () => {
    render(
      <InputGroup>
        <InputGroup.Addon>$</InputGroup.Addon>
        <Input aria-label="amount" />
        <InputGroup.Addon>USD</InputGroup.Addon>
      </InputGroup>,
    );
    expect(screen.getByText("$")).toBeInTheDocument();
    expect(screen.getByText("USD")).toBeInTheDocument();
    expect(screen.getByLabelText("amount")).toBeInTheDocument();
  });
});
