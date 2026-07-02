import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { __resetRegistry } from "./hotkey-registry";
import { ToggleButton } from "./ToggleButton";

describe("ToggleButton", () => {
  it("renders as an unpressed button with the btn class", () => {
    render(<ToggleButton>Bold</ToggleButton>);
    const btn = screen.getByRole("button", { name: "Bold" });
    expect(btn).toHaveAdminClass("btn");
    expect(btn).toHaveAttribute("aria-pressed", "false");
  });

  it("maps variant and size to the matching classes", () => {
    render(
      <ToggleButton variant="ghost" size="sm">
        Bold
      </ToggleButton>,
    );
    const btn = screen.getByRole("button");
    expect(btn).toHaveAdminClass("btn-ghost");
    expect(btn).toHaveAdminClass("btn-sm");
  });

  it("does not add btn-square for icon-only usage — the ::before indicator fills the leading slot", () => {
    function Icon(props: { "aria-hidden"?: boolean | "true" | "false" }) {
      return <svg data-testid="icon" {...props} />;
    }
    render(<ToggleButton icon={Icon} aria-label="Bold" />);
    expect(screen.getByRole("button")).not.toHaveAdminClass("btn-square");
  });

  describe("interactions", () => {
    it("uncontrolled: click flips aria-pressed and back", async () => {
      const user = userEvent.setup();
      render(<ToggleButton>Bold</ToggleButton>);
      const btn = screen.getByRole("button");
      await user.click(btn);
      expect(btn).toHaveAttribute("aria-pressed", "true");
      await user.click(btn);
      expect(btn).toHaveAttribute("aria-pressed", "false");
    });

    it("uncontrolled: defaultPressed starts pressed", () => {
      render(<ToggleButton defaultPressed>Bold</ToggleButton>);
      expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "true");
    });

    it("controlled: reflects pressed and reports changes", async () => {
      const user = userEvent.setup();
      function Harness() {
        const [pressed, setPressed] = useState(false);
        return (
          <ToggleButton pressed={pressed} onPressedChange={setPressed}>
            Bold
          </ToggleButton>
        );
      }
      render(<Harness />);
      const btn = screen.getByRole("button");
      await user.click(btn);
      expect(btn).toHaveAttribute("aria-pressed", "true");
    });

    it("controlled: state stays put when the parent ignores the change", async () => {
      const user = userEvent.setup();
      const onPressedChange = vi.fn();
      render(
        <ToggleButton pressed={false} onPressedChange={onPressedChange}>
          Bold
        </ToggleButton>,
      );
      const btn = screen.getByRole("button");
      await user.click(btn);
      expect(onPressedChange).toHaveBeenCalledWith(true, expect.anything());
      expect(btn).toHaveAttribute("aria-pressed", "false");
    });

    it("does not toggle when disabled", async () => {
      const user = userEvent.setup();
      const onPressedChange = vi.fn();
      render(
        <ToggleButton disabled onPressedChange={onPressedChange}>
          Bold
        </ToggleButton>,
      );
      const btn = screen.getByRole("button");
      expect(btn).toBeDisabled();
      await user.click(btn);
      expect(onPressedChange).not.toHaveBeenCalled();
    });
  });

  describe("hotkey prop", () => {
    beforeEach(() => __resetRegistry());
    afterEach(() => __resetRegistry());

    function pressCtrlB() {
      act(() => {
        window.dispatchEvent(
          new KeyboardEvent("keydown", {
            key: "b",
            ctrlKey: true,
            bubbles: true,
            cancelable: true,
          }),
        );
      });
    }

    it("renders a Kbd chip and aria-keyshortcuts", () => {
      render(<ToggleButton hotkey="mod+b">Bold</ToggleButton>);
      const btn = screen.getByRole("button", { name: /Bold/ });
      expect(btn.querySelectorAll("kbd")).toHaveLength(2);
      expect(btn).toHaveAttribute("aria-keyshortcuts", "Control+B");
    });

    it("flips the pressed state when the chord fires", () => {
      render(<ToggleButton hotkey="mod+b">Bold</ToggleButton>);
      const btn = screen.getByRole("button", { name: /Bold/ });
      pressCtrlB();
      expect(btn).toHaveAttribute("aria-pressed", "true");
      pressCtrlB();
      expect(btn).toHaveAttribute("aria-pressed", "false");
    });

    it("does not fire when disabled", () => {
      const onPressedChange = vi.fn();
      render(
        <ToggleButton hotkey="mod+b" disabled onPressedChange={onPressedChange}>
          Bold
        </ToggleButton>,
      );
      pressCtrlB();
      expect(onPressedChange).not.toHaveBeenCalled();
    });
  });
});
