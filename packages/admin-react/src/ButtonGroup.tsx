import { clsx } from "clsx";
import type { ComponentProps } from "react";

export type ButtonGroupOrientation = "horizontal" | "vertical";

export interface ButtonGroupProps extends ComponentProps<"div"> {
  orientation?: ButtonGroupOrientation;
}

export function ButtonGroup({
  orientation = "horizontal",
  role = "group",
  className,
  ...rest
}: ButtonGroupProps) {
  return (
    <div
      role={role}
      className={clsx("btn-group", orientation === "vertical" && "btn-group-vertical", className)}
      {...rest}
    />
  );
}
