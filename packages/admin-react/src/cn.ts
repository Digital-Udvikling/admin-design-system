import { clsx, type ClassValue } from "clsx";

/**
 * Class-name prefix hook. Currently empty — admin ships one CSS bundle with
 * bare class names (`.btn`, `.card`), and isolation from host CSS is the job
 * of `<AdminRoot isolated>` (shadow DOM), not selector-level namespacing.
 * The prefix mechanism is left in place so flipping it back on is a one-line
 * change if a future deployment shape requires it.
 */
const PREFIX = "";

function prefixTokens(value: string): string {
  if (!value) return "";
  return value
    .split(/\s+/)
    .filter(Boolean)
    .map((token) => `${PREFIX}${token}`)
    .join(" ");
}

function join(...parts: Array<string | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/**
 * className merger that preserves Base UI's render-prop className form.
 *
 * `base` carries admin's own classes (e.g. `["btn", "btn-primary"]`) and goes
 * through the prefix hook above (currently a no-op). `className` is the
 * consumer-supplied prop and passes through verbatim — it lives in the
 * caller's namespace either way.
 *
 * Base UI components accept `className: string | ((state) => string | undefined)`.
 * The function form has to be deferred until Base UI invokes it with the
 * component state.
 */
export function cn(base: ClassValue, className: string | undefined): string;
export function cn<TState>(
  base: ClassValue,
  className: (state: TState) => string | undefined,
): (state: TState) => string;
export function cn<TState>(
  base: ClassValue,
  className: string | ((state: TState) => string | undefined) | undefined,
): string | ((state: TState) => string);
export function cn<TState>(
  base: ClassValue,
  className: string | ((state: TState) => string | undefined) | undefined,
): string | ((state: TState) => string) {
  const baseClasses = prefixTokens(clsx(base));
  if (typeof className === "function") {
    return (state) => join(baseClasses, className(state) ?? undefined);
  }
  return join(baseClasses, className);
}
