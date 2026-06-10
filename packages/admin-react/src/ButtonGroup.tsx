import type { ComponentProps } from "react";
import { cn } from "./cn";

export type ButtonGroupOrientation = "horizontal" | "vertical";

export interface ButtonGroupProps extends ComponentProps<"div"> {
  orientation?: ButtonGroupOrientation;
  /** Stretch across the container. Horizontal groups split the row into
   *  equal-width buttons; vertical groups fill the container width. */
  fullWidth?: boolean;
}

export function ButtonGroup({
  orientation = "horizontal",
  fullWidth = false,
  role = "group",
  className,
  ...rest
}: ButtonGroupProps) {
  return (
    <div
      role={role}
      className={cn(
        [
          "btn-group",
          orientation === "vertical" && "btn-group-vertical",
          fullWidth && "btn-group-full-width",
        ],
        className,
      )}
      {...rest}
    />
  );
}
