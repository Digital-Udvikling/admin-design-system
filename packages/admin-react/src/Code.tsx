import type { ComponentProps } from "react";
import { cn } from "./cn";

export type CodeProps = ComponentProps<"code">;

/**
 * Inline `<code>` chip for an identifier in a sentence (a slug, ID or command).
 * Tinted from the text colour, so it follows a surrounding alert or link.
 * For a block of code, use `CodeBlock`.
 */
export function Code({ className, ...rest }: CodeProps) {
  return <code className={cn("code", className)} {...rest} />;
}
