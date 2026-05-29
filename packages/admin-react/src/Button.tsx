import { Button as BaseButton } from "@base-ui/react/button";
import { useCallback, useRef, type ComponentProps } from "react";
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
   * Keyboard shortcut bound to this button. Pressing the chord dispatches a
   * native click on the underlying element, so `onClick` fires, `type="submit"`
   * submits the form, and an anchor-rendered button (`render={<a href>}`)
   * navigates — all the native side effects of a real click. Same syntax as
   * `useHotkey`. Pass an array for alternatives — only the first is rendered as
   * a visual chip.
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
  ref,
  ...rest
}: ButtonProps) {
  // Latch the rendered element so the hotkey can dispatch a real `.click()` on
  // it (native side effects: form submit, anchor navigation). Merge with any
  // consumer-supplied `ref` so passing one still works.
  const elementRef = useRef<HTMLElement | null>(null);
  const setRef = useCallback(
    (node: HTMLElement | null) => {
      elementRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );

  const { ariaKeyShortcuts, primaryChord } = useHotkey(hotkey, () => elementRef.current?.click(), {
    enabled: !disabled && !loading,
  });

  const iconOnly = children == null && (icon != null || iconTrailing != null);

  return (
    <BaseButton
      ref={setRef}
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
