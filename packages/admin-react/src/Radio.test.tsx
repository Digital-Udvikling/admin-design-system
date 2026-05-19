import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { Radio, RadioGroup } from "./Radio";

describe("Radio + RadioGroup", () => {
  it("renders", () => {
    render(
      <RadioGroup>
        <Radio value="a" aria-label="a" />
        <Radio value="b" aria-label="b" />
      </RadioGroup>,
    );
    expect(screen.getByRole("radio", { name: "a" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "b" })).toBeInTheDocument();
  });

  describe("interactions", () => {
    it("uncontrolled: clicking a radio sets aria-checked and fires onValueChange with the clicked value", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(
        <RadioGroup onValueChange={onValueChange}>
          <Radio value="a" aria-label="a" />
          <Radio value="b" aria-label="b" />
        </RadioGroup>,
      );
      const a = screen.getByRole("radio", { name: "a" });
      const b = screen.getByRole("radio", { name: "b" });
      expect(a).toHaveAttribute("aria-checked", "false");
      expect(b).toHaveAttribute("aria-checked", "false");
      await user.click(b);
      expect(a).toHaveAttribute("aria-checked", "false");
      expect(b).toHaveAttribute("aria-checked", "true");
      expect(onValueChange).toHaveBeenNthCalledWith(1, "b", expect.anything());
      await user.click(a);
      expect(a).toHaveAttribute("aria-checked", "true");
      expect(b).toHaveAttribute("aria-checked", "false");
      expect(onValueChange).toHaveBeenNthCalledWith(2, "a", expect.anything());
    });

    it("controlled: value prop drives the group via onValueChange round-trip", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();

      function Controlled() {
        const [value, setValue] = useState<string | null>(null);
        return (
          <RadioGroup
            value={value}
            onValueChange={(next, details) => {
              onValueChange(next, details);
              setValue(next as string);
            }}
          >
            <Radio value="a" aria-label="a" />
            <Radio value="b" aria-label="b" />
          </RadioGroup>
        );
      }

      render(<Controlled />);
      const a = screen.getByRole("radio", { name: "a" });
      const b = screen.getByRole("radio", { name: "b" });
      await user.click(a);
      expect(a).toHaveAttribute("aria-checked", "true");
      expect(b).toHaveAttribute("aria-checked", "false");
      await user.click(b);
      expect(a).toHaveAttribute("aria-checked", "false");
      expect(b).toHaveAttribute("aria-checked", "true");
      expect(onValueChange.mock.calls.map((c) => c[0])).toEqual(["a", "b"]);
    });

    it("controlled: ignores clicks when parent does not update value", async () => {
      const user = userEvent.setup();
      render(
        <RadioGroup value="a" onValueChange={() => {}}>
          <Radio value="a" aria-label="a" />
          <Radio value="b" aria-label="b" />
        </RadioGroup>,
      );
      const a = screen.getByRole("radio", { name: "a" });
      const b = screen.getByRole("radio", { name: "b" });
      await user.click(b);
      expect(a).toHaveAttribute("aria-checked", "true");
      expect(b).toHaveAttribute("aria-checked", "false");
    });
  });
});
