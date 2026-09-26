import type { RefCallback } from "react";

// `{ current: unknown }` rather than `RefObject<T | null>`: object refs are invariant, and a ref typed
// for a supertype (`Ref<HTMLElement>` on an input) must still be accepted.
type NodeRef<T> = RefCallback<T> | { current: unknown } | null | undefined;

/**
 * Combines refs into one callback ref that sets each object ref and calls each callback ref with
 * the node. It returns a React 19 ref cleanup, so on detach React calls that instead of passing
 * `null`: a callback ref's own cleanup runs if it returned one, otherwise it is called with `null`,
 * and object refs are reset to `null`. Build it once per set of refs (`useMemo`), or React
 * detaches and reattaches every render.
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
