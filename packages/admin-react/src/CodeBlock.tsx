import type { ComponentProps } from "react";
import { cn } from "./cn";

export interface CodeBlockProps extends ComponentProps<"pre"> {
  /** Don't wrap long lines — let them overflow horizontally instead. */
  nowrap?: boolean;
}

/**
 * Styled `<pre>` for logs, JSON dumps, terminal output, raw model output.
 * Theme-following surface via `--color-code-surface` / `--color-code-text`.
 * Sets the `--shiki-*` variables of Shiki's `css-variables` theme, so
 * highlighted children take the system's syntax colors.
 * Focusable (`tabIndex={0}`), so an overflowing block scrolls by keyboard.
 */
export function CodeBlock({ nowrap, className, ...rest }: CodeBlockProps) {
  return (
    <pre
      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- keyboard scrolling (WCAG 2.1.1)
      tabIndex={0}
      className={cn(["code-block", nowrap && "code-block-nowrap"], className)}
      {...rest}
    />
  );
}
