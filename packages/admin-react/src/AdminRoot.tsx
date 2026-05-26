import type { ComponentProps } from "react";
import { cn } from "./cn";

export interface AdminRootProps extends ComponentProps<"div"> {}

export function AdminRoot({ className, ...rest }: AdminRootProps) {
  return <div className={cn("admin-root", className)} {...rest} />;
}
