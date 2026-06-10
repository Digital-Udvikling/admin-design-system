import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { Dialog } from "./Dialog";
import { Tooltip } from "./Tooltip";
import { adminSelector } from "./test-setup";

// Base UI's trigger defaults `delay` to 600ms; `delay={0}` / `closeDelay={0}`
// drives hover/focus transitions synchronously without fake timers.

describe("Tooltip", () => {
  it("smoke: renders trigger; popup mounts when defaultOpen", () => {
    render(
      <Tooltip.Root defaultOpen>
        <Tooltip.Trigger>Hover me</Tooltip.Trigger>
        <Tooltip.Popup>Save</Tooltip.Popup>
      </Tooltip.Root>,
    );
    expect(screen.getByRole("button", { name: "Hover me" })).toBeInTheDocument();
    const popup = document.body.querySelector(adminSelector("tooltip")) as HTMLElement | null;
    expect(popup).not.toBeNull();
    expect(popup).toHaveAdminClass("tooltip");
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
      expect(document.body.querySelector(adminSelector("tooltip"))).toBeNull();
      await user.hover(trigger);
      const popup = await screen.findByRole("tooltip");
      expect(popup).toHaveTextContent("Hint");
      await user.unhover(trigger);
      const after = document.body.querySelector(adminSelector("tooltip"));
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
      expect(document.body.querySelector(adminSelector("tooltip"))).toBeNull();
      await user.tab();
      await user.tab();
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
      const after = document.body.querySelector(adminSelector("tooltip"));
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

    it("portals the popup into an ancestor <Dialog> instead of document.body", () => {
      // Same top-layer constraint as <Select>: popups portaled to document.body
      // paint behind a modal <dialog>, so the wrapper portals into the dialog.
      render(
        <Dialog.Container open>
          <Tooltip.Root defaultOpen>
            <Tooltip.Trigger>target</Tooltip.Trigger>
            <Tooltip.Popup>Hint</Tooltip.Popup>
          </Tooltip.Root>
        </Dialog.Container>,
      );
      const dialog = document.querySelector("dialog") as HTMLDialogElement;
      const popup = document.querySelector(adminSelector("tooltip")) as HTMLElement | null;
      expect(popup).not.toBeNull();
      expect(dialog.contains(popup)).toBe(true);
    });

    it("applies size modifier class", () => {
      const { rerender } = render(
        <Tooltip.Root defaultOpen>
          <Tooltip.Trigger>x</Tooltip.Trigger>
          <Tooltip.Popup size="sm">Hint</Tooltip.Popup>
        </Tooltip.Root>,
      );
      expect(document.body.querySelector(adminSelector("tooltip"))).toHaveAdminClass("tooltip-sm");
      rerender(
        <Tooltip.Root defaultOpen>
          <Tooltip.Trigger>x</Tooltip.Trigger>
          <Tooltip.Popup>Hint</Tooltip.Popup>
        </Tooltip.Root>,
      );
      const popup = document.body.querySelector(adminSelector("tooltip")) as HTMLElement;
      expect(popup).toHaveAdminClass("tooltip");
      expect(popup).not.toHaveAdminClass("tooltip-sm");
    });
  });
});
