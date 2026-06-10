import { clsx, type ClassValue } from "clsx";

/**
 * Every admin class is prefixed so the bundle coexists with host-page CSS
 * without colliding on common names like `.btn`. Must match the selector
 * prefix `wrap-scoped.mjs` bakes into `@aortl/admin-css/admin.scoped.css`.
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
 * className merger that preserves Base UI's render-prop className form —
 * a function `className` is deferred until Base UI invokes it with state.
 *
 * `base` carries admin's own classes and is always prefixed with `_ao-`.
 * `className` is the consumer-supplied prop and passes through verbatim —
 * it lives in the caller's namespace.
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
