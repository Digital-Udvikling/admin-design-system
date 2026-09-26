import type { ReactNode } from "react";

/** Whether a shorthand slot has content: `null`, `undefined`, `false` and `""` render no wrapper; `0` does. */
export function hasNode(node: ReactNode): boolean {
  return node != null && node !== false && node !== "";
}
