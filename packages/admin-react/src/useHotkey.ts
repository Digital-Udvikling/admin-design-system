import { useEffect, useMemo, useRef } from "react";
import { canonicalize, parseKeys, toAriaKeyShortcuts } from "./hotkey-parse";
import { register, type HotkeyEntry, type HotkeyHandler } from "./hotkey-registry";

export interface HotkeyOptions {
  /** When false, the binding is not registered. Defaults to true. */
  enabled?: boolean;
}

export interface HotkeyInfo {
  /**
   * Pre-serialized `aria-keyshortcuts` attribute value (e.g. `"Control+S"`).
   * Undefined when `keys` is nullish. Apply to the element that owns the
   * binding so screen readers announce the shortcut alongside the name.
   */
  ariaKeyShortcuts: string | undefined;
  /**
   * Canonical form of the first alternative — feed to `<Kbd keys={primaryChord} />`
   * to render the matching visual chip. Undefined when `keys` is nullish.
   */
  primaryChord: string | undefined;
  /** All canonical chord strings, used internally for registration. */
  canonicalChords: readonly string[];
}

/**
 * Register a keyboard shortcut. The handler is latched in a ref internally so
 * callers don't need to memoize it. Passing nullish `keys` is a no-op, so
 * the hook is safe to call unconditionally from components that may or may
 * not have a binding (e.g. the `hotkey` prop on `<Button>`).
 *
 * @example
 *   useHotkey("mod+s", save);
 *   useHotkey(["mod+s", "mod+enter"], save, { enabled: !isLoading });
 *
 * Returns derived strings for rendering — see {@link HotkeyInfo}.
 */
export function useHotkey(
  keys: string | readonly string[] | null | undefined,
  handler: HotkeyHandler,
  options?: HotkeyOptions,
): HotkeyInfo {
  const enabled = options?.enabled ?? true;
  const handlerRef = useRef<HotkeyHandler>(handler);
  handlerRef.current = handler;

  // Reduce `keys` to a stable string ID; downstream deps key off this so
  // re-renders with the same logical bindings don't re-register. Nullish
  // collapses to `""` which downstream treats as "no binding".
  const keyId = keys == null ? "" : Array.isArray(keys) ? keys.join("|") : (keys as string);

  const derived = useMemo<HotkeyInfo>(() => {
    if (keyId === "") {
      return { canonicalChords: [], ariaKeyShortcuts: undefined, primaryChord: undefined };
    }
    const parsed = parseKeys(keys as string | readonly string[]);
    const cans = parsed.map(canonicalize);
    return {
      canonicalChords: cans,
      ariaKeyShortcuts: toAriaKeyShortcuts(parsed),
      primaryChord: cans[0],
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyId]);

  useEffect(() => {
    if (!enabled || derived.canonicalChords.length === 0) return;
    const entry: HotkeyEntry = { handlerRef };
    return register(derived.canonicalChords, entry);
  }, [derived, enabled]);

  return derived;
}
