import { clsx, type ClassValue } from "clsx";

/**
 * className merger that preserves Base UI's render-prop className form.
 *
 * Base UI components accept `className: string | ((state) => string | undefined)`. The plain
 * `clsx()` path is correct for strings, but a function form has to be deferred
 * until Base UI invokes it with the component state.
 */
export function cn<TState>(
  base: ClassValue,
  className: string | ((state: TState) => string | undefined) | undefined,
): string | ((state: TState) => string) {
  if (typeof className === "function") {
    return (state) => clsx(base, className(state));
  }
  return clsx(base, className);
}
