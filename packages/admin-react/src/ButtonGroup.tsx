import type { ComponentProps } from "react";
import { cn } from "./cn";

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
      className={cn(["btn-group", orientation === "vertical" && "btn-group-vertical"], className)}
      {...rest}
    />
  );
}
