"use client";

import { Toggle as BaseToggle } from "@base-ui/react/toggle";
import { cn } from "./cn";
import { Kbd } from "./Kbd";
import type { ToggleButtonProps } from "./ToggleButton";
import { useHotkeyClick } from "./useHotkey";

export type ToggleButtonBaseProps = Omit<ToggleButtonProps, "icon" | "iconTrailing">;

/** `ToggleButton` minus icon rendering, which happens in ToggleButton.tsx so Server Components can pass `icon={IconStar}`. */
export function ToggleButtonBase({
  variant = "default",
  size = "md",
  fullWidth,
  hotkey,
  className,
  disabled,
  children,
  ref,
  ...rest
}: ToggleButtonBaseProps) {
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
      {children}
      {primaryChord !== undefined ? <Kbd keys={primaryChord} /> : null}
    </BaseToggle>
  );
}
