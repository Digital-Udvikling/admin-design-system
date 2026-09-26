import type { Toggle as BaseToggle } from "@base-ui/react/toggle";
import type { ComponentProps } from "react";
import type { ButtonSize, ButtonVariant } from "./Button";
import { renderIcon, type IconProp } from "./icon";
import { ToggleButtonBase } from "./ToggleButton.client";

export interface ToggleButtonProps extends ComponentProps<typeof BaseToggle> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  /** Leading icon. Pass a component (`icon={IconStar}`) or an element. */
  icon?: IconProp;
  /** Trailing icon. Pass a component (`iconTrailing={IconChevronDown}`) or an element. */
  iconTrailing?: IconProp;
  /**
   * Keyboard shortcut that dispatches a native click on the button, flipping
   * the pressed state. Same syntax as `useHotkey`. Pass an array for
   * alternatives — only the first is rendered as a visual chip.
   */
  hotkey?: string | readonly string[];
}

/**
 * A two-state button styled like `Button`; `aria-pressed` carries the state,
 * which CSS renders as a leading mini switch. Composes with `ButtonGroup`.
 */
export function ToggleButton({ icon, iconTrailing, children, ...rest }: ToggleButtonProps) {
  return (
    <ToggleButtonBase {...rest}>
      {renderIcon(icon)}
      {children}
      {renderIcon(iconTrailing)}
    </ToggleButtonBase>
  );
}
