import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { Input, type InputProps } from "./Input";

describe("Input", () => {
  it("renders", () => {
    render(<Input aria-label="x" />);
    expect(screen.getByLabelText("x")).toBeInTheDocument();
  });

  it("applies the status variant class", () => {
    render(<Input aria-label="x" variant="warning" />);
    expect(screen.getByLabelText("x")).toHaveAdminClass("input", "input-warning");
  });

  describe("interactions", () => {
    it("uncontrolled: typing updates value and fires onChange per keystroke", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<Input aria-label="x" onChange={onChange} />);
      const el = screen.getByLabelText("x") as HTMLInputElement;
      await user.type(el, "abc");
      expect(el).toHaveValue("abc");
      expect(onChange).toHaveBeenCalledTimes(3);
      const lastCall = onChange.mock.lastCall?.[0];
      expect(lastCall.target.value).toBe("abc");
    });

    it("controlled: value prop drives the input and onChange reflects new values", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      function Controlled(props: Pick<InputProps, "aria-label">) {
        const [value, setValue] = useState("");
        return (
          <Input
            {...props}
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              setValue(e.target.value);
            }}
          />
        );
      }

      render(<Controlled aria-label="x" />);
      const el = screen.getByLabelText("x") as HTMLInputElement;
      expect(el).toHaveValue("");
      await user.type(el, "hi");
      expect(el).toHaveValue("hi");
      expect(onChange).toHaveBeenNthCalledWith(1, "h");
      expect(onChange).toHaveBeenNthCalledWith(2, "hi");
    });

    it("controlled: ignores keystrokes when parent does not update value", async () => {
      const user = userEvent.setup();
      render(<Input aria-label="x" value="locked" onChange={() => {}} />);
      const el = screen.getByLabelText("x") as HTMLInputElement;
      await user.type(el, "xyz");
      expect(el).toHaveValue("locked");
    });
  });
});
