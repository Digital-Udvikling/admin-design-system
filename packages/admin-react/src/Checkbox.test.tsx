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

  describe("indicator", () => {
    // The CSS draws the glyph on `.checkbox[data-*] > .checkbox-indicator:empty`.
    it("default indicator is an empty direct child of the checked root", async () => {
      const user = userEvent.setup();
      render(<Checkbox aria-label="x" />);
      const root = screen.getByRole("checkbox");
      expect(root.querySelector("._ao-checkbox-indicator")).toBeNull();
      await user.click(root);
      const indicator = root.querySelector("._ao-checkbox-indicator");
      expect(indicator).toBeEmptyDOMElement();
      expect(indicator?.parentElement).toBe(root);
      expect(root).toHaveAttribute("data-checked");
    });

    it("indeterminate marks the root so the indicator draws a dash", () => {
      render(<Checkbox aria-label="x" indeterminate />);
      const root = screen.getByRole("checkbox");
      const indicator = root.querySelector("._ao-checkbox-indicator");
      expect(indicator).toBeEmptyDOMElement();
      expect(indicator?.parentElement).toBe(root);
      expect(root).toHaveAttribute("data-indeterminate");
    });

    it("custom children replace the default indicator", () => {
      render(
        <Checkbox aria-label="x" defaultChecked>
          <Checkbox.Indicator>
            <span data-testid="glyph" />
          </Checkbox.Indicator>
        </Checkbox>,
      );
      expect(screen.getByTestId("glyph")).toBeInTheDocument();
    });
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
