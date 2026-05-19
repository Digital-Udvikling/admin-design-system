import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { Switch } from "./Switch";

describe("Switch", () => {
  it("renders", () => {
    render(<Switch aria-label="x" />);
    expect(screen.getByRole("switch", { name: "x" })).toBeInTheDocument();
  });

  describe("interactions", () => {
    it("uncontrolled: click toggles aria-checked and fires onCheckedChange with new value", async () => {
      const user = userEvent.setup();
      const onCheckedChange = vi.fn();
      render(<Switch aria-label="x" onCheckedChange={onCheckedChange} />);
      const root = screen.getByRole("switch");
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
          <Switch
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
      const root = screen.getByRole("switch");
      await user.click(root);
      expect(root).toHaveAttribute("aria-checked", "true");
      await user.click(root);
      expect(root).toHaveAttribute("aria-checked", "false");
      expect(onCheckedChange).toHaveBeenCalledTimes(2);
    });

    it("controlled: ignores clicks when parent does not update checked", async () => {
      const user = userEvent.setup();
      render(<Switch aria-label="x" checked={false} onCheckedChange={() => {}} />);
      const root = screen.getByRole("switch");
      await user.click(root);
      expect(root).toHaveAttribute("aria-checked", "false");
    });
  });
});
