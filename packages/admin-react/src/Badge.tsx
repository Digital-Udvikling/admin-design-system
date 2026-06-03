import type { ComponentProps } from "react";
import { cn } from "./cn";
import { renderIcon, type IconProp } from "./icon";

export type BadgeVariant = "neutral" | "info" | "success" | "warning" | "danger" | "primary";
export type BadgeSize = "sm" | "md" | "lg";

export interface BadgeProps extends ComponentProps<"span"> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  /** Leading icon. */
  icon?: IconProp;
}

export function Badge({
  variant = "neutral",
  size = "md",
  icon,
  className,
  children,
  ...rest
}: BadgeProps) {
  return (
    <span
      className={cn(
        ["badge", variant !== "neutral" && `badge-${variant}`, size !== "md" && `badge-${size}`],
        className,
      )}
      {...rest}
    >
      {renderIcon(icon)}
      {children}
    </span>
  );
}
