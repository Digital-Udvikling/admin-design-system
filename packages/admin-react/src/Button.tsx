import { Button as BaseButton } from "@base-ui/react/button";
import { isValidElement, type ComponentProps } from "react";
import { cn } from "./cn";
import { renderIcon, type IconProp } from "./icon";
import { Kbd } from "./Kbd";
import { useHotkeyClick } from "./useHotkey";

export type ButtonVariant = "default" | "primary" | "ghost" | "muted" | "danger";
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

export function Button({
  variant = "default",
  size = "md",
  fullWidth,
  loading,
  icon,
  iconTrailing,
  hotkey,
  className,
  type,
  disabled,
  focusableWhenDisabled,
  nativeButton,
  render,
  children,
  onClick,
  ref,
  ...rest
}: ButtonProps) {
  const { ariaKeyShortcuts, primaryChord, setRef } = useHotkeyClick(hotkey, ref, {
    enabled: !disabled && !loading,
  });

  const iconOnly = children == null && (icon != null || iconTrailing != null);
  // Base UI adds role="button" to every non-native element; an <a href> should stay a link.
  const linkRender =
    nativeButton === false &&
    isValidElement<{ href?: unknown }>(render) &&
    render.props.href != null;

  return (
    <BaseButton
      ref={setRef}
      onClick={onClick}
      type={nativeButton === false ? type : (type ?? "button")}
      nativeButton={nativeButton}
      render={render}
      {...(linkRender ? { role: undefined } : null)}
      disabled={disabled || loading}
      focusableWhenDisabled={focusableWhenDisabled ?? loading}
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
      {renderIcon(icon)}
      {children}
      {renderIcon(iconTrailing)}
      {primaryChord !== undefined ? <Kbd keys={primaryChord} /> : null}
    </BaseButton>
  );
}
