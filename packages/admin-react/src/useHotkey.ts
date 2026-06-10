import { useEffect, useMemo, useRef } from "react";
import { canonicalize, parseKeys, toAriaKeyShortcuts } from "./hotkey-parse";
import { register, type HotkeyEntry, type HotkeyHandler } from "./hotkey-registry";

export interface HotkeyOptions {
  /** When false, the binding is not registered. Defaults to true. */
  enabled?: boolean;
}

export interface HotkeyInfo {
  /** `aria-keyshortcuts` attribute value; undefined when `keys` is nullish. */
  ariaKeyShortcuts: string | undefined;
  /** Canonical first alternative, for `<Kbd keys={primaryChord} />`; undefined when `keys` is nullish. */
  primaryChord: string | undefined;
  canonicalChords: readonly string[];
}

/**
 * Register a keyboard shortcut, e.g. `useHotkey("mod+s", save)`. The handler
 * is latched in a ref, so callers need not memoize it. Nullish `keys` is a
 * no-op, so the hook is safe to call unconditionally.
 */
export function useHotkey(
  keys: string | readonly string[] | null | undefined,
  handler: HotkeyHandler,
  options?: HotkeyOptions,
): HotkeyInfo {
  const enabled = options?.enabled ?? true;
  const handlerRef = useRef<HotkeyHandler>(handler);
  handlerRef.current = handler;

  // Stable string ID so a fresh array with the same bindings doesn't re-register; nullish → "".
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
