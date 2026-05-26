import type { ComponentProps } from "react";
import { cn } from "./cn";

export interface AdminRootProps extends ComponentProps<"div"> {
  /**
   * Force a color scheme for this subtree. Sets `data-theme`, which flips the
   * semantic tokens and `color-scheme`. Omit to follow the OS preference.
   */
  theme?: "light" | "dark";
}

export function AdminRoot({ className, theme, ...rest }: AdminRootProps) {
  return (
    <div
      className={cn("admin-root", className)}
      {...rest}
      {...(theme !== undefined && { "data-theme": theme })}
    />
  );
}
