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

  it("applies the danger variant on the group", () => {
    const { container } = render(<NumberInput variant="danger" inputAriaLabel="Q" />);
    expect(container.querySelector(adminSelector("number-input"))).toHaveAdminClass(
      "number-input-danger",
    );
  });

  it("forwards classNames to slots", () => {
    render(<NumberInput inputAriaLabel="Q" classNames={{ increment: "x-custom" }} />);
    expect(screen.getByRole("button", { name: "Increase" })).toHaveClass("x-custom");
  });

  it("puts className on the visible group and classNames.root on the root", () => {
    const { container } = render(
      <NumberInput
        inputAriaLabel="Q"
        className="max-w-32"
        classNames={{ group: "x-group", root: "x-root" }}
      />,
    );
    const group = container.querySelector(adminSelector("number-input"));
    expect(group).toHaveClass("max-w-32", "x-group");
    expect(container.querySelector(adminSelector("number-input-root"))).toHaveClass("x-root");
    expect(container.querySelector(adminSelector("number-input-root"))).not.toHaveClass("max-w-32");
  });

  it("puts style on the visible group, not the display: contents root", () => {
    const { container } = render(<NumberInput inputAriaLabel="Q" style={{ width: 120 }} />);
    expect(container.querySelector(adminSelector("number-input"))).toHaveStyle({ width: "120px" });
    expect(container.querySelector(adminSelector("number-input-root"))).not.toHaveAttribute(
      "style",
    );
  });

  it("resolves a className function against the group state", () => {
    const { container } = render(
      <NumberInput inputAriaLabel="Q" disabled className={(s) => (s.disabled ? "is-off" : "")} />,
    );
    expect(container.querySelector(adminSelector("number-input"))).toHaveClass("is-off");
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
