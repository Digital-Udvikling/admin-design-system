import type { ComponentProps } from "react";
import { cn } from "./cn";
import { formatChord, parseKeys } from "./hotkey-parse";

export interface KbdProps extends Omit<ComponentProps<"span">, "children"> {
  /**
   * Chord(s) in `useHotkey` syntax. Only the first alternative renders,
   * matching the platform menu convention of showing the primary binding.
   */
  keys?: string | readonly string[];
  /** Literal text rendered as a single chip — for inline use in tooltips/prose. */
  children?: string;
}

/** Keyboard shortcut chips — parsed via `keys`, or a single literal chip via `children`. */
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
