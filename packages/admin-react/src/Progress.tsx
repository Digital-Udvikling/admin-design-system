import type { ComponentProps } from "react";
import { cn } from "./cn";

export type ProgressVariant = "info" | "success" | "warning" | "danger";
export type ProgressSize = "sm" | "md" | "lg";

export interface ProgressProps extends Omit<ComponentProps<"progress">, "value"> {
  /** Current value in `[0, max]`. Omit (or pass `undefined`) for an indeterminate bar. */
  value?: number;
  max?: number;
  variant?: ProgressVariant;
  size?: ProgressSize;
}

export function Progress({
  value,
  max = 100,
  variant = "info",
  size = "md",
  className,
  ...rest
}: ProgressProps) {
  return (
    <progress
      value={value}
      max={max}
      className={cn(
        [
          "progress",
          variant !== "info" && `progress-${variant}`,
          size !== "md" && `progress-${size}`,
        ],
        className,
      )}
      {...rest}
    />
  );
}
