import type { ComponentProps } from "react";
import { cn } from "./cn";

export type SpinnerSize = "sm" | "md" | "lg";

export interface SpinnerProps extends ComponentProps<"output"> {
  size?: SpinnerSize;
  /** Accessible name. Default: "Loading". */
  "aria-label"?: string;
}

// `<output>` is an implicit status region, but it announces content changes, not a name present on mount.
export function Spinner({
  size = "md",
  "aria-label": ariaLabel = "Loading",
  className,
  ...rest
}: SpinnerProps) {
  return (
    <output
      aria-label={ariaLabel}
      className={cn(["spinner", size !== "md" && `spinner-${size}`], className)}
      {...rest}
    />
  );
}
