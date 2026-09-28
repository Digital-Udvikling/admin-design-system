import type { RefCallback } from "react";

// Not `RefObject<T | null>`: it is invariant, and a `Ref<HTMLElement>` on an input must still fit.
type NodeRef<T> = RefCallback<T> | { current: unknown } | null | undefined;

/**
 * Combines refs into one callback ref. Its React 19 cleanup runs each callback ref's own cleanup
 * (or calls it with `null`) and resets object refs. Build it once per set of refs (`useMemo`), or
 * React detaches and reattaches every render.
 */
export function mergeRefs<T>(...refs: ReadonlyArray<NodeRef<T>>): RefCallback<T> {
  return (node) => {
    const cleanups = refs.map((ref) => {
      if (typeof ref === "function") {
        const cleanup = ref(node);
        return typeof cleanup === "function" ? cleanup : () => ref(null);
      }
      if (ref != null) {
        ref.current = node;
        return () => {
          ref.current = null;
        };
      }
      return undefined;
    });
    return () => {
      for (const cleanup of cleanups) cleanup?.();
    };
  };
}
