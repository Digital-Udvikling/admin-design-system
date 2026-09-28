import type { ComponentProps } from "react";
import { cn } from "./cn";

export type StatusDotVariant = "neutral" | "info" | "success" | "warning" | "danger" | "primary";

export interface StatusDotProps extends ComponentProps<"span"> {
  /** Dot colour. Default: `"neutral"`. */
  variant?: StatusDotVariant;
}

/**
 * Standalone `.indicator-dot`. With `aria-label` it renders `role="status"`, as a labelled
 * `Indicator` does; without one it is `aria-hidden`, and adjacent text must carry the status.
 */
export function StatusDot({
  variant = "neutral",
  className,
  "aria-label": ariaLabel,
  ...rest
}: StatusDotProps) {
  return (
    <span
      className={cn(
        ["indicator-dot", variant !== "neutral" && `indicator-dot-${variant}`],
        className,
      )}
      {...(ariaLabel !== undefined
        ? { role: "status", "aria-label": ariaLabel }
        : { "aria-hidden": true })}
      {...rest}
    />
  );
}
