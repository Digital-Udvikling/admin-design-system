import { act, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { __resetRegistry } from "./hotkey-registry";
import { useHotkey } from "./useHotkey";

function Bind({
  keys,
  onFire,
  enabled,
}: {
  keys: string | readonly string[] | null | undefined;
  onFire: (e: KeyboardEvent) => void;
  enabled?: boolean;
}) {
  useHotkey(keys, onFire, { enabled });
  return null;
}

function press(
  init: KeyboardEventInit & { key: string },
  target: EventTarget = window,
): KeyboardEvent {
  const e = new KeyboardEvent("keydown", { bubbles: true, cancelable: true, ...init });
  act(() => {
    target.dispatchEvent(e);
  });
  return e;
}

describe("useHotkey", () => {
  beforeEach(() => {
    __resetRegistry();
  });
  afterEach(() => {
    __resetRegistry();
  });

  it("fires on matching chord", () => {
    const fire = vi.fn();
    render(<Bind keys="mod+s" onFire={fire} />);
    press({ key: "s", ctrlKey: true });
    expect(fire).toHaveBeenCalledTimes(1);
  });

  it("calls preventDefault on match", () => {
    const fire = vi.fn();
    render(<Bind keys="mod+s" onFire={fire} />);
    const e = press({ key: "s", ctrlKey: true });
    expect(e.defaultPrevented).toBe(true);
  });

  it("does not fire when enabled is false", () => {
    const fire = vi.fn();
    render(<Bind keys="mod+s" onFire={fire} enabled={false} />);
    press({ key: "s", ctrlKey: true });
    expect(fire).not.toHaveBeenCalled();
  });

  it("does not fire when keys is undefined", () => {
    const fire = vi.fn();
    render(<Bind keys={undefined} onFire={fire} />);
    press({ key: "s", ctrlKey: true });
    expect(fire).not.toHaveBeenCalled();
  });

  it("does not fire on a mismatched chord", () => {
    const fire = vi.fn();
    render(<Bind keys="mod+s" onFire={fire} />);
    press({ key: "s" });
    press({ key: "k", ctrlKey: true });
    expect(fire).not.toHaveBeenCalled();
  });

  it("unregisters on unmount", () => {
    const fire = vi.fn();
    const { unmount } = render(<Bind keys="mod+s" onFire={fire} />);
    unmount();
    press({ key: "s", ctrlKey: true });
    expect(fire).not.toHaveBeenCalled();
  });

  it("fires every matching handler (bag semantics)", () => {
    const a = vi.fn();
    const b = vi.fn();
    render(
      <>
        <Bind keys="mod+s" onFire={a} />
        <Bind keys="mod+s" onFire={b} />
      </>,
    );
    press({ key: "s", ctrlKey: true });
    expect(a).toHaveBeenCalledTimes(1);
    expect(b).toHaveBeenCalledTimes(1);
  });

  it("accepts an array of alternatives", () => {
    const fire = vi.fn();
    render(<Bind keys={["mod+s", "mod+enter"]} onFire={fire} />);
    press({ key: "s", ctrlKey: true });
    press({ key: "Enter", ctrlKey: true });
    expect(fire).toHaveBeenCalledTimes(2);
  });

  describe("input suppression", () => {
    function withInput(child: React.ReactNode) {
      return (
        <>
          <input data-testid="text" aria-label="text" />
          {child}
        </>
      );
    }

    it("skips bare-key bindings while focus is in an input", () => {
      const fire = vi.fn();
      const { getByTestId } = render(withInput(<Bind keys="s" onFire={fire} />));
      const input = getByTestId("text") as HTMLInputElement;
      input.focus();
      press({ key: "s" }, input);
      expect(fire).not.toHaveBeenCalled();
    });

    it("fires modified chords while focus is in an input", () => {
      const fire = vi.fn();
      const { getByTestId } = render(withInput(<Bind keys="mod+s" onFire={fire} />));
      const input = getByTestId("text") as HTMLInputElement;
      input.focus();
      press({ key: "s", ctrlKey: true }, input);
      expect(fire).toHaveBeenCalledTimes(1);
    });

    it("fires escape while focus is in an input", () => {
      const fire = vi.fn();
      const { getByTestId } = render(withInput(<Bind keys="escape" onFire={fire} />));
      const input = getByTestId("text") as HTMLInputElement;
      input.focus();
      press({ key: "Escape" }, input);
      expect(fire).toHaveBeenCalledTimes(1);
    });
  });
});
