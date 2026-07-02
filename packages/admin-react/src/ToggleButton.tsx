import { Toggle as BaseToggle } from "@base-ui/react/toggle";
import type { ComponentProps } from "react";
import type { ButtonSize, ButtonVariant } from "./Button";
import { cn } from "./cn";
import { renderIcon, type IconProp } from "./icon";
import { Kbd } from "./Kbd";
import { useHotkeyClick } from "./useHotkey";

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
export function ToggleButton({
  variant = "default",
  size = "md",
  fullWidth,
  icon,
  iconTrailing,
  hotkey,
  className,
  disabled,
  children,
  ref,
  ...rest
}: ToggleButtonProps) {
  const { ariaKeyShortcuts, primaryChord, setRef } = useHotkeyClick(hotkey, ref, {
    enabled: !disabled,
  });

  return (
    <BaseToggle
      ref={setRef}
      disabled={disabled}
      aria-keyshortcuts={ariaKeyShortcuts}
      className={cn(
        [
          "btn",
          variant !== "default" && `btn-${variant}`,
          size !== "md" && `btn-${size}`,
          fullWidth && "btn-full-width",
        ],
        className,
      )}
      {...rest}
    >
      {renderIcon(icon)}
      {children}
      {renderIcon(iconTrailing)}
      {primaryChord !== undefined ? <Kbd keys={primaryChord} /> : null}
    </BaseToggle>
  );
}
