import type { ComponentProps } from "react";
import { cn } from "./cn";

export interface SeparatorProps extends ComponentProps<"hr"> {
  /** A vertical rule for flex rows. Defaults to a horizontal rule. */
  orientation?: "horizontal" | "vertical";
}

/**
 * A styled `<hr>` (implicit `role="separator"`). Margins are zeroed — spacing
 * comes from the parent's gap or margin utilities.
 */
export function Separator({ orientation = "horizontal", className, ...rest }: SeparatorProps) {
  const vertical = orientation === "vertical";
  return (
    <hr
      className={cn(["separator", vertical && "separator-vertical"], className)}
      aria-orientation={vertical ? "vertical" : undefined}
      {...rest}
    />
  );
}
