import type { ComponentProps } from "react";
import { cn } from "./cn";
import { formatChord, parseKeys } from "./hotkey-parse";

export interface KbdProps extends Omit<ComponentProps<"span">, "children"> {
  /**
   * Hotkey chord(s) to render as styled `<kbd>` chips. Same syntax as the
   * `hotkey` prop / `useHotkey` (e.g. `"mod+s"`, `"shift+?"`, `"escape"`).
   * When multiple alternatives are passed, only the first is rendered —
   * matches platform menu convention of showing the primary binding.
   */
  keys?: string | readonly string[];
  /** Literal text rendered as a single chip — for inline use in tooltips/prose. */
  children?: string;
}

/**
 * Visual representation of a keyboard shortcut. Two shapes:
 *
 * ```tsx
 * <Kbd keys="mod+s" />     // parsed: <Ctrl><S> in a .kbd-group
 * <Kbd>Esc</Kbd>           // literal: single <kbd>Esc</kbd>
 * ```
 *
 * Render outside of action surfaces (tooltips, help dialogs) or inside them
 * via the `hotkey` prop on `<Button>` / `<Menu.Item>`.
 */
export function Kbd({ keys, children, className, ...rest }: KbdProps) {
  if (keys != null) {
    const chord = parseKeys(keys)[0];
    if (!chord) {
      return null;
    }
    const parts = formatChord(chord);
    return (
      <span className={cn("kbd-group", className)} {...rest}>
        {parts.map((part, i) => (
          <kbd key={`${i}-${part}`} className={cn("kbd", undefined)}>
            {part}
          </kbd>
        ))}
      </span>
    );
  }
  return (
    <kbd className={cn("kbd", className)} {...rest}>
      {children}
    </kbd>
  );
}
