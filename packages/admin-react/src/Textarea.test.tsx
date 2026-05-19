import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { Textarea, type TextareaProps } from "./Textarea";

describe("Textarea", () => {
  it("renders", () => {
    render(<Textarea aria-label="x" />);
    expect(screen.getByLabelText("x")).toBeInTheDocument();
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
});
