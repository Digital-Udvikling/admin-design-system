import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { Field } from "./Field";
import { Input, PasswordInput, type InputProps } from "./Input";

function StubIcon(props: { size?: number | string; "aria-hidden"?: boolean | "true" | "false" }) {
  return <svg data-testid="icon" {...props} />;
}

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

  describe("icons", () => {
    it("leading icon: wraps, sits before the input, and is aria-hidden", () => {
      render(<Input aria-label="x" icon={StubIcon} />);
      const el = screen.getByLabelText("x");
      const wrapper = el.parentElement as HTMLElement;
      expect(wrapper).toHaveAdminClass("input-icon");
      const iconEl = el.previousElementSibling as HTMLElement;
      expect(iconEl).toBe(screen.getByTestId("icon"));
      expect(iconEl).toHaveAttribute("aria-hidden", "true");
    });

    it("trailing icon: sits after the input inside the wrapper", () => {
      render(<Input aria-label="x" iconTrailing={StubIcon} />);
      const el = screen.getByLabelText("x");
      expect(el.parentElement).toHaveAdminClass("input-icon");
      expect(el.nextElementSibling).toBe(screen.getByTestId("icon"));
    });

    it("no icon props: renders no wrapper", () => {
      render(<Input aria-label="x" />);
      const el = screen.getByLabelText("x");
      expect(el.parentElement).not.toHaveAdminClass("input-icon");
      expect(screen.queryByTestId("icon")).not.toBeInTheDocument();
    });

    it("Field label wiring survives the wrapper", async () => {
      const user = userEvent.setup();
      render(
        <Field label="Search">
          <Input icon={StubIcon} />
        </Field>,
      );
      const el = screen.getByLabelText("Search");
      expect(el.parentElement).toHaveAdminClass("input-icon");
      await user.click(screen.getByText("Search"));
      expect(el).toHaveFocus();
    });

    it("uncontrolled typing works with an icon set", async () => {
      const user = userEvent.setup();
      render(<Input aria-label="x" icon={StubIcon} />);
      const el = screen.getByLabelText("x") as HTMLInputElement;
      await user.type(el, "abc");
      expect(el).toHaveValue("abc");
    });
  });

  describe("clearable", () => {
    it("uncontrolled: shows the clear button once there's a value and empties on click", async () => {
      const user = userEvent.setup();
      render(<Input aria-label="x" clearable />);
      const el = screen.getByLabelText("x") as HTMLInputElement;
      expect(screen.queryByRole("button", { name: "Clear" })).not.toBeInTheDocument();

      await user.type(el, "hello");
      const clear = screen.getByRole("button", { name: "Clear" });
      await user.click(clear);

      expect(el).toHaveValue("");
      expect(screen.queryByRole("button", { name: "Clear" })).not.toBeInTheDocument();
    });

    it("controlled: clearing fires onChange with an empty value", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      function Controlled() {
        const [value, setValue] = useState("seed");
        return (
          <Input
            aria-label="x"
            clearable
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              setValue(e.target.value);
            }}
          />
        );
      }

      render(<Controlled />);
      await user.click(screen.getByRole("button", { name: "Clear" }));
      expect(onChange).toHaveBeenLastCalledWith("");
      expect(screen.getByLabelText("x")).toHaveValue("");
    });

    it("does not show the clear button when disabled", async () => {
      render(<Input aria-label="x" clearable disabled defaultValue="locked" />);
      expect(screen.queryByRole("button", { name: "Clear" })).not.toBeInTheDocument();
    });
  });

  describe("PasswordInput", () => {
    it("toggles the input type via the reveal button", async () => {
      const user = userEvent.setup();
      render(<PasswordInput aria-label="pw" defaultValue="secret" />);
      const el = screen.getByLabelText("pw") as HTMLInputElement;
      expect(el).toHaveAttribute("type", "password");

      const toggle = screen.getByRole("button", { name: "Show password" });
      expect(toggle).toHaveAttribute("aria-pressed", "false");

      await user.click(toggle);
      expect(el).toHaveAttribute("type", "text");
      expect(toggle).toHaveAttribute("aria-pressed", "true");
    });
  });
});
