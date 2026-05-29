import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { Field } from "./Field";
import { Textarea, type TextareaProps } from "./Textarea";

describe("Textarea", () => {
  it("renders", () => {
    render(<Textarea aria-label="x" />);
    expect(screen.getByLabelText("x")).toBeInTheDocument();
  });

  it("applies the status variant class", () => {
    render(<Textarea aria-label="x" variant="success" />);
    expect(screen.getByLabelText("x")).toHaveAdminClass("textarea", "textarea-success");
  });

  it("applies the autosize class only when autoResize is set", () => {
    const { rerender } = render(<Textarea aria-label="x" />);
    expect(screen.getByLabelText("x")).not.toHaveAdminClass("textarea-autosize");
    rerender(<Textarea aria-label="x" autoResize />);
    expect(screen.getByLabelText("x")).toHaveAdminClass("textarea", "textarea-autosize");
  });

  describe("interactions", () => {
    it("uncontrolled: typing updates value and fires onChange per keystroke", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<Textarea aria-label="x" onChange={onChange} />);
      const el = screen.getByLabelText("x") as HTMLTextAreaElement;
      await user.type(el, "hello");
      expect(el).toHaveValue("hello");
      expect(onChange).toHaveBeenCalledTimes(5);
      expect(onChange.mock.lastCall?.[0].target.value).toBe("hello");
    });

    it("controlled: value prop drives the textarea and onChange reflects new values", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      function Controlled(props: Pick<TextareaProps, "aria-label">) {
        const [value, setValue] = useState("");
        return (
          <Textarea
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
      const el = screen.getByLabelText("x") as HTMLTextAreaElement;
      await user.type(el, "ab");
      expect(el).toHaveValue("ab");
      expect(onChange).toHaveBeenNthCalledWith(1, "a");
      expect(onChange).toHaveBeenNthCalledWith(2, "ab");
    });
  });

  describe("Field integration", () => {
    it("associates with a Field label: clicking the label focuses the Textarea", async () => {
      const user = userEvent.setup();
      render(
        <Field label="Notes">
          <Textarea />
        </Field>,
      );
      await user.click(screen.getByText("Notes"));
      expect(screen.getByRole("textbox")).toHaveFocus();
    });
  });
});
