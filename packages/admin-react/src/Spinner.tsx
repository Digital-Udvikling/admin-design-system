import type { ComponentProps } from "react";
import { cn } from "./cn";

export type SpinnerSize = "sm" | "md" | "lg";

export interface SpinnerProps extends ComponentProps<"output"> {
  size?: SpinnerSize;
  /** Accessible label announced by screen readers. Defaults to "Loading". */
  label?: string;
}

// `<output>` has an implicit `role="status"`, so screen readers announce the
// `aria-label` politely when the spinner appears. Pure CSS handles the visual.
export function Spinner({ size = "md", label = "Loading", className, ...rest }: SpinnerProps) {
  return (
    <output
      aria-label={label}
      className={cn(["spinner", size !== "md" && `spinner-${size}`], className)}
      {...rest}
    />
  );
}
