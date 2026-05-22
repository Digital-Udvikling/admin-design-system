import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { Tooltip } from "./Tooltip";

// Base UI's TooltipTrigger defaults `delay` to 600ms. Pass `delay={0}` /
// `closeDelay={0}` per-trigger in interaction tests to drive hover/focus
// transitions synchronously without juggling fake timers.

describe("Tooltip", () => {
  it("smoke: renders trigger; popup mounts when defaultOpen", () => {
    render(
      <Tooltip.Root defaultOpen>
        <Tooltip.Trigger>Hover me</Tooltip.Trigger>
        <Tooltip.Popup>Save</Tooltip.Popup>
      </Tooltip.Root>,
    );
    expect(screen.getByRole("button", { name: "Hover me" })).toBeInTheDocument();
    const popup = document.body.querySelector(".tooltip") as HTMLElement | null;
    expect(popup).not.toBeNull();
    expect(popup).toHaveTextContent("Save");
  });

  it("shorthand: trigger renders via render-prop into the user-supplied element", () => {
    render(
      <Tooltip content="Save (⌘S)">
        <button type="button">Save</button>
      </Tooltip>,
    );
    // Base UI clones the user's <button> rather than wrapping it.
    expect(screen.getAllByRole("button", { name: /Save/ })).toHaveLength(1);
  });

  describe("interactions", () => {
    it("opens on hover and closes on unhover", async () => {
      const user = userEvent.setup();
      render(
        <Tooltip.Root>
          <Tooltip.Trigger delay={0} closeDelay={0}>
            target
          </Tooltip.Trigger>
          <Tooltip.Popup>Hint</Tooltip.Popup>
        </Tooltip.Root>,
      );
      const trigger = screen.getByRole("button", { name: "target" });
      expect(document.body.querySelector(".tooltip")).toBeNull();
      await user.hover(trigger);
      const popup = await screen.findByRole("tooltip");
      expect(popup).toHaveTextContent("Hint");
      await user.unhover(trigger);
      // Either fully unmounted, or marked closed via data-ending-style.
      const after = document.body.querySelector(".tooltip");
      expect(after === null || after.hasAttribute("data-ending-style")).toBe(true);
    });

    it("opens on focus", async () => {
      const user = userEvent.setup();
      render(
        <>
          <button type="button">before</button>
          <Tooltip.Root>
            <Tooltip.Trigger delay={0} closeDelay={0}>
              target
            </Tooltip.Trigger>
            <Tooltip.Popup>Hint</Tooltip.Popup>
          </Tooltip.Root>
        </>,
      );
      expect(document.body.querySelector(".tooltip")).toBeNull();
      await user.tab(); // before
      await user.tab(); // target
      expect(await screen.findByRole("tooltip")).toHaveTextContent("Hint");
    });

    it("closes on Escape after focus-open", async () => {
      const user = userEvent.setup();
      render(
        <Tooltip.Root>
          <Tooltip.Trigger delay={0} closeDelay={0}>
            target
          </Tooltip.Trigger>
          <Tooltip.Popup>Hint</Tooltip.Popup>
        </Tooltip.Root>,
      );
      await user.tab();
      await screen.findByRole("tooltip");
      await user.keyboard("{Escape}");
      const after = document.body.querySelector(".tooltip");
      expect(after === null || after.hasAttribute("data-ending-style")).toBe(true);
    });

    it("controlled: open/onOpenChange round-trip via hover", async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();

      function Controlled() {
        const [open, setOpen] = useState(false);
        return (
          <Tooltip.Root
            open={open}
            onOpenChange={(next, details) => {
              onOpenChange(next, details);
              setOpen(next);
            }}
          >
            <Tooltip.Trigger delay={0} closeDelay={0}>
              target
            </Tooltip.Trigger>
            <Tooltip.Popup>Hint</Tooltip.Popup>
          </Tooltip.Root>
        );
      }

      render(<Controlled />);
      const trigger = screen.getByRole("button", { name: "target" });
      await user.hover(trigger);
      await screen.findByRole("tooltip");
      expect(onOpenChange).toHaveBeenCalledWith(true, expect.anything());
    });

    it("applies size modifier class", () => {
      const { rerender } = render(
        <Tooltip.Root defaultOpen>
          <Tooltip.Trigger>x</Tooltip.Trigger>
          <Tooltip.Popup size="sm">Hint</Tooltip.Popup>
        </Tooltip.Root>,
      );
      expect(document.body.querySelector(".tooltip")).toHaveClass("tooltip-sm");
      rerender(
        <Tooltip.Root defaultOpen>
          <Tooltip.Trigger>x</Tooltip.Trigger>
          <Tooltip.Popup>Hint</Tooltip.Popup>
        </Tooltip.Root>,
      );
      const popup = document.body.querySelector(".tooltip") as HTMLElement;
      expect(popup).toHaveClass("tooltip");
      expect(popup).not.toHaveClass("tooltip-sm");
    });
  });
});
