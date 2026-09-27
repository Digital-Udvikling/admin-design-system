import type { ComponentProps } from "react";
import { cn } from "./cn";

export type ProseSize = "md" | "lg";

export interface ProseProps extends ComponentProps<"div"> {
  /** `lg` is the reading size for long-form text (help, changelog, policy); tables, code and `Prose.Exclude` keep UI size. */
  size?: ProseSize;
}

/**
 * Styled container for HTML the system can't annotate with its class names —
 * backend-rendered markdown, CMS bodies, model output. Element styles are
 * scoped to this wrapper; the rest of the admin UI keeps the global reset.
 * A nested `Prose` renders at its own `size`.
 */
function ProseRoot({ size = "md", className, ...rest }: ProseProps) {
  return <div className={cn(["prose", size === "lg" && "prose-lg"], className)} {...rest} />;
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
