import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it } from "vitest";
import { NumberInput } from "./NumberInput";
import { adminSelector } from "./test-setup";

describe("NumberInput", () => {
  it("renders the group, field, and stepper buttons", () => {
    const { container } = render(<NumberInput defaultValue={3} inputAriaLabel="Quantity" />);
    expect(container.querySelector(adminSelector("number-input"))).toBeInTheDocument();
    expect(screen.getByLabelText("Quantity")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Increase" })).toHaveAdminClass("number-input-step");
    expect(screen.getByRole("button", { name: "Decrease" })).toBeInTheDocument();
  });

  it("applies the size modifier on the group", () => {
    const { container } = render(<NumberInput size="lg" inputAriaLabel="Q" />);
    expect(container.querySelector(adminSelector("number-input"))).toHaveAdminClass(
      "number-input-lg",
    );
  });

  it("forwards classNames to slots", () => {
    render(<NumberInput inputAriaLabel="Q" classNames={{ increment: "x-custom" }} />);
    expect(screen.getByRole("button", { name: "Increase" })).toHaveClass("x-custom");
  });

  it("increments the value when the + button is clicked", async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [value, setValue] = useState<number | null>(3);
      return <NumberInput value={value} onValueChange={setValue} inputAriaLabel="Quantity" />;
    }
    render(<Controlled />);
    const input = screen.getByLabelText("Quantity");
    expect(input).toHaveDisplayValue("3");
    await user.click(screen.getByRole("button", { name: "Increase" }));
    expect(input).toHaveDisplayValue("4");
  });
});
