"use client";

import { Button as BaseButton } from "@base-ui/react/button";
import { Children, isValidElement, type ReactNode } from "react";
import type { ButtonProps } from "./Button";
import { cn } from "./cn";
import { Kbd } from "./Kbd";
import { useHotkeyClick } from "./useHotkey";

const REACT_LAZY = Symbol.for("react.lazy");

export interface ButtonBaseProps extends Omit<ButtonProps, "icon" | "iconTrailing"> {
  /** Icon-only: `children` holds nothing but the rendered icons. */
  square?: boolean;
}

/** `Button` minus icon rendering, which happens in Button.tsx so Server Components can pass `icon={IconPlus}`. */
export function ButtonBase({
  variant = "default",
  size = "md",
  fullWidth,
  loading,
  square,
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
}: ButtonBaseProps) {
  const { ariaKeyShortcuts, primaryChord, setRef } = useHotkeyClick(hotkey, ref, {
    enabled: !disabled && !loading,
  });

  // `next dev` delivers a Server Component's element as a lazy node; unwrap it as Base UI does.
  const renderElement =
    (render as { $$typeof?: symbol } | undefined)?.$$typeof === REACT_LAZY
      ? Children.toArray(render as ReactNode)[0]
      : render;
  // Base UI adds role="button" to every non-native element; an <a href> should stay a link.
  const linkRender =
    nativeButton === false &&
    isValidElement<{ href?: unknown }>(renderElement) &&
    renderElement.props.href != null;

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
          square && "btn-square",
        ],
        className,
      )}
      {...rest}
    >
      {children}
      {primaryChord !== undefined ? <Kbd keys={primaryChord} /> : null}
    </BaseButton>
  );
}
