import { Button as BaseButton } from "@base-ui/react/button";
import type { ComponentProps } from "react";
import { cn } from "./cn";
import { renderIcon, type IconProp } from "./icon";
import { Kbd } from "./Kbd";
import { useHotkey } from "./useHotkey";

export type ButtonVariant = "default" | "primary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ComponentProps<typeof BaseButton> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  /** Shows a spinner in place of the leading icon and disables interaction.
   *  Sets `aria-busy="true"` and the native `disabled` attribute. */
  loading?: boolean;
  /** Leading icon. Pass a component (`icon={IconPlus}`) or an element. */
  icon?: IconProp;
  /** Trailing icon. Pass a component (`iconTrailing={IconArrowRight}`) or an element. */
  iconTrailing?: IconProp;
  /**
   * Keyboard shortcut bound to this button. Pressing the chord invokes the
   * button's `onClick` handler — not a real DOM click, so `type="submit"`
   * form submission and other native side effects only happen if `onClick`
   * triggers them itself. Same syntax as `useHotkey`. Pass an array for
   * alternatives — only the first is rendered as a visual chip.
   */
  hotkey?: string | readonly string[];
}

export function Button({
  variant = "default",
  size = "md",
  fullWidth,
  loading,
  icon,
  iconTrailing,
  hotkey,
  className,
  type = "button",
  disabled,
  children,
  onClick,
  ...rest
}: ButtonProps) {
  type OnClickEvent = Parameters<NonNullable<typeof onClick>>[0];
  const { ariaKeyShortcuts, primaryChord } = useHotkey(
    hotkey,
    (e) => onClick?.(e as unknown as OnClickEvent),
    { enabled: !disabled && !loading },
  );

  const iconOnly = children == null && (icon != null || iconTrailing != null);

  return (
    <BaseButton
      onClick={onClick}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      aria-keyshortcuts={ariaKeyShortcuts}
      className={cn(
        [
          "btn",
          variant !== "default" && `btn-${variant}`,
          size !== "md" && `btn-${size}`,
          fullWidth && "btn-full-width",
          loading && "btn-loading",
          iconOnly && "btn-square",
        ],
        className,
      )}
      {...rest}
    >
      {loading ? null : renderIcon(icon)}
      {children}
      {renderIcon(iconTrailing)}
      {primaryChord !== undefined ? <Kbd keys={primaryChord} /> : null}
    </BaseButton>
  );
}
