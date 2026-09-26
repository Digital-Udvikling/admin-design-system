import type { Button as BaseButton } from "@base-ui/react/button";
import type { ComponentProps } from "react";
import { ButtonBase } from "./Button.client";
import { renderIcon, type IconProp } from "./icon";

export type ButtonVariant = "default" | "primary" | "ghost" | "muted" | "danger" | "danger-ghost";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ComponentProps<typeof BaseButton> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  /** Shows a spinner in place of the first icon and blocks activation.
   *  Sets `aria-busy` and `aria-disabled` rather than `disabled`, so the button keeps focus. */
  loading?: boolean;
  /** Leading icon. Pass a component (`icon={IconPlus}`) or an element. */
  icon?: IconProp;
  /** Trailing icon. Pass a component (`iconTrailing={IconArrowRight}`) or an element. */
  iconTrailing?: IconProp;
  /**
   * Keyboard shortcut that dispatches a native click on the rendered element —
   * `onClick` fires, `type="submit"` submits, an anchor-rendered button
   * (`render={<a href>}`) navigates. Same syntax as `useHotkey`. Pass an array
   * for alternatives — only the first is rendered as a visual chip.
   */
  hotkey?: string | readonly string[];
  /** Id of the element an HTML invoker `command` targets (`commandfor`). */
  commandfor?: string;
  /** HTML invoker command run on the `commandfor` target; `--*` for custom commands. */
  command?:
    | "show-modal"
    | "close"
    | "request-close"
    | "show-popover"
    | "hide-popover"
    | "toggle-popover"
    | `--${string}`;
}

export function Button({ icon, iconTrailing, children, ...rest }: ButtonProps) {
  return (
    <ButtonBase square={children == null && (icon != null || iconTrailing != null)} {...rest}>
      {renderIcon(icon)}
      {children}
      {renderIcon(iconTrailing)}
    </ButtonBase>
  );
}
