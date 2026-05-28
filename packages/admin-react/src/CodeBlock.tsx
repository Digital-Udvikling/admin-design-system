import type { ComponentProps } from "react";
import { cn } from "./cn";

export interface CodeBlockProps extends ComponentProps<"pre"> {
  /** Don't wrap long lines — let them overflow horizontally instead. Pair
   *  with an inline `max-height` to clamp vertical growth. */
  nowrap?: boolean;
}

/**
 * Styled `<pre>` for logs, JSON dumps, terminal output, raw model output.
 * Theme-following surface via `--color-code-surface` / `--color-code-text`.
 * Wraps by default; opt out with `nowrap`. No syntax highlighting — layer
 * Shiki/Prism on a nested `<code>` if needed.
 */
export function CodeBlock({ nowrap, className, ...rest }: CodeBlockProps) {
  return <pre className={cn(["code-block", nowrap && "code-block-nowrap"], className)} {...rest} />;
}
