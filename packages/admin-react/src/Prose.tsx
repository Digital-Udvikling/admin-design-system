import type { ComponentProps } from "react";
import { cn } from "./cn";

export type ProseProps = ComponentProps<"div">;

/**
 * Styled container for HTML the system can't annotate with its class names —
 * backend-rendered markdown, CMS bodies, model output. Element styles are
 * scoped to this wrapper; the rest of the admin UI keeps the global reset.
 */
export function Prose({ className, ...rest }: ProseProps) {
  return <div className={cn("prose", className)} {...rest} />;
}
