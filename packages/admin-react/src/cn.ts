import { clsx, type ClassValue } from "clsx";

/**
 * Every admin class name is prefixed so the bundle can coexist with a host
 * page's CSS without colliding on common names like `.btn` or `.card`. The
 * matching CSS lives in `@aortl/admin-css/admin.scoped.css` (built by
 * `wrap-scoped.mjs`), which carries the same prefix on every selector.
 */
const PREFIX = "_ao-";

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
 * `base` carries admin's own classes (e.g. `["btn", "btn-primary"]`) and is
 * always prefixed with `_ao-`. `className` is the consumer-supplied prop and
 * passes through verbatim — it lives in the caller's namespace.
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
