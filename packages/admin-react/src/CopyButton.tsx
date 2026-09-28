import { CopyButtonBase } from "./CopyButton.client";
import type { ButtonProps } from "./Button";
import { CheckGlyph, CopyGlyph } from "./copy-glyphs";
import { renderIcon } from "./icon";

export interface CopyButtonProps extends Omit<
  ButtonProps,
  "value" | "iconTrailing" | "loading" | "render" | "nativeButton"
> {
  /** Text written to the clipboard. */
  value: string;
  /** Announced by a polite live region after a successful copy. Default: `"Copied"`. */
  copiedLabel?: string;
  /** How long the check icon and announcement stay, in ms. Default: `1200`. */
  timeout?: number;
  /** Visible label. Omit for a square icon button named by `aria-label` (default `"Copy"`). */
  children?: ButtonProps["children"];
}

/**
 * Writes `value` to the clipboard; shows a check icon while `data-copied` is set.
 * `variant` defaults to `"ghost"`; `icon` replaces the copy glyph.
 */
export function CopyButton({ icon, ...rest }: CopyButtonProps) {
  return (
    <CopyButtonBase
      idleIcon={icon == null ? <CopyGlyph /> : renderIcon(icon)}
      copiedIcon={<CheckGlyph />}
      {...rest}
    />
  );
}
