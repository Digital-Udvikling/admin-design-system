import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { Checkbox } from "./Checkbox";

describe("Checkbox", () => {
  it("renders", () => {
    render(<Checkbox aria-label="x" />);
    expect(screen.getByRole("checkbox", { name: "x" })).toBeInTheDocument();
  });

  describe("interactions", () => {
    it("uncontrolled: clicking toggles aria-checked and fires onCheckedChange with new value", async () => {
      const user = userEvent.setup();
      const onCheckedChange = vi.fn();
      render(<Checkbox aria-label="x" onCheckedChange={onCheckedChange} />);
      const root = screen.getByRole("checkbox");
      expect(root).toHaveAttribute("aria-checked", "false");
      await user.click(root);
      expect(root).toHaveAttribute("aria-checked", "true");
      expect(onCheckedChange).toHaveBeenNthCalledWith(1, true, expect.anything());
      await user.click(root);
      expect(root).toHaveAttribute("aria-checked", "false");
      expect(onCheckedChange).toHaveBeenNthCalledWith(2, false, expect.anything());
    });

    it("controlled: checked prop drives the state via onCheckedChange round-trip", async () => {
      const user = userEvent.setup();
      const onCheckedChange = vi.fn();

      function Controlled() {
        const [checked, setChecked] = useState(false);
        return (
          <Checkbox
            aria-label="x"
            checked={checked}
            onCheckedChange={(next, details) => {
              onCheckedChange(next, details);
              setChecked(next);
            }}
          />
        );
      }

      render(<Controlled />);
      const root = screen.getByRole("checkbox");
      expect(root).toHaveAttribute("aria-checked", "false");
      await user.click(root);
      expect(root).toHaveAttribute("aria-checked", "true");
      await user.click(root);
      expect(root).toHaveAttribute("aria-checked", "false");
      expect(onCheckedChange).toHaveBeenCalledTimes(2);
      expect(onCheckedChange.mock.calls[0]?.[0]).toBe(true);
      expect(onCheckedChange.mock.calls[1]?.[0]).toBe(false);
    });

    it("controlled: ignores clicks when parent does not update checked", async () => {
      const user = userEvent.setup();
      render(<Checkbox aria-label="x" checked={false} onCheckedChange={() => {}} />);
      const root = screen.getByRole("checkbox");
      await user.click(root);
      expect(root).toHaveAttribute("aria-checked", "false");
    });
  });
});
