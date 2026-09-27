import type { ComponentProps } from "react";
import { cn } from "./cn";

export type ProseProps = ComponentProps<"div">;

/**
 * Styled container for HTML the system can't annotate with its class names —
 * backend-rendered markdown, CMS bodies, model output. Element styles are
 * scoped to this wrapper; the rest of the admin UI keeps the global reset.
 */
function ProseRoot({ className, ...rest }: ProseProps) {
  return <div className={cn("prose", className)} {...rest} />;
}

export type ProseExcludeProps = ComponentProps<"div">;

/**
 * A subtree `Prose` leaves unstyled, for components embedded in rendered HTML
 * (a table, a card, a code block) so they keep their own look. A `Prose`
 * inside it styles its own content again.
 */
function ProseExclude({ className, ...rest }: ProseExcludeProps) {
  return <div className={cn("prose-exclude", className)} {...rest} />;
}

export const Prose = Object.assign(ProseRoot, { Exclude: ProseExclude });
