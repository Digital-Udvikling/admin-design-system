import type { ComponentProps } from "react";
import { cn } from "./cn";

export type PageCenterSize = "md" | "lg";

export interface PageCenterProps extends ComponentProps<"main"> {
  /** Width cap of the centred child: `md` (default) 24rem, `lg` 32rem. */
  size?: PageCenterSize;
}

/**
 * `<main class="page-center">` for a standalone page outside `<AppShell>`, such as sign-in
 * or an error page: at least the viewport's height, with its one child centred and capped.
 */
export function PageCenter({ size = "md", className, ...rest }: PageCenterProps) {
  return (
    <main
      className={cn(["page-center", size !== "md" && `page-center-${size}`], className)}
      {...rest}
    />
  );
}
