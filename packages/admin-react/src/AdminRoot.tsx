import { clsx } from "clsx";
import type { ComponentProps } from "react";

export interface AdminRootProps extends ComponentProps<"div"> {}

export function AdminRoot({ className, ...rest }: AdminRootProps) {
  return <div className={clsx("admin-root", className)} {...rest} />;
}
