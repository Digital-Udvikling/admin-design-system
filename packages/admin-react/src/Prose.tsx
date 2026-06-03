import type { ComponentProps } from "react";
import { cn } from "./cn";

export type ProseProps = ComponentProps<"div">;

/**
 * A styled container for HTML the system can't annotate with its semantic class
 * names — backend-rendered markdown, CMS bodies, model output. Styles its
 * descendant flow elements (`p`, `ul`, `a`, `code`, `blockquote`, `table`, …)
 * from the design tokens, scoped to this wrapper so the rest of the admin UI
 * keeps the global element reset.
 *
 * ```tsx
 * <Prose dangerouslySetInnerHTML={{ __html: renderedMarkdown }} />
 * ```
 *
 * Accepts children too — `<Prose><h2>…</h2><p>…</p></Prose>` — for content
 * authored directly in JSX.
 */
export function Prose({ className, ...rest }: ProseProps) {
  return <div className={cn("prose", className)} {...rest} />;
}
