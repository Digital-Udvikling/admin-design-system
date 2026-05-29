/**
 * Pure helpers for the hotkey system. Chord syntax: `<mod>+<mod>+…+<key>`
 *
 * Examples: `mod+s`, `?`, `escape`, `mod+shift+k`, `arrowup`.
 *
 * Modifiers are case-insensitive. `mod` resolves to the platform's primary
 * command modifier — ⌘ (`meta`) on Apple platforms, `Ctrl` elsewhere — so
 * `mod+s` fires on the OS-native gesture (Cmd+S on macOS, Ctrl+S otherwise)
 * and the `<Kbd>` chip follows suit. The key is whatever
 * `KeyboardEvent.key` produces, lowercased. A shifted printable symbol already
 * encodes Shift in the character it produces, so bind `"?"` (not `"shift+?"`)
 * to catch `shift+/`; `shift` stays explicit for letters and named keys, so
 * `shift+a` and `shift+tab` remain distinct chords.
 */

export type Modifier = "ctrl" | "shift" | "alt" | "meta";

export interface ParsedChord {
  mods: ReadonlySet<Modifier>;
  key: string;
}

const MOD_ORDER: readonly Modifier[] = ["ctrl", "shift", "alt", "meta"];

/**
 * Resolve the modifier `mod` aliases to. Apple platforms use ⌘ (`meta`) as the
 * primary command modifier; everywhere else it's Ctrl. Detected once at module
 * load (SSR-safe — the registry never dispatches server-side) and shared by the
 * parse and display layers so the binding and its `<Kbd>` chip always agree.
 */
function detectApplePlatform(): boolean {
  if (typeof navigator === "undefined") return false;
  const uaData = (navigator as Navigator & { userAgentData?: { platform?: string } }).userAgentData;
  const platform = uaData?.platform || navigator.platform || "";
  return /^(mac|iphone|ipad|ipod)/i.test(platform);
}

const IS_APPLE = detectApplePlatform();
const MOD_TARGET: Modifier = IS_APPLE ? "meta" : "ctrl";

function tokenToMod(token: string): Modifier | null {
  switch (token) {
    case "mod":
      return MOD_TARGET;
    case "ctrl":
    case "control":
      return "ctrl";
    case "shift":
      return "shift";
    case "alt":
      return "alt";
    case "meta":
      return "meta";
    default:
      return null;
  }
}

export function parseChord(input: string): ParsedChord {
  const tokens = input
    .trim()
    .toLowerCase()
    .split("+")
    .map((t) => t.trim())
    .filter(Boolean);
  if (tokens.length === 0) {
    throw new Error(`Invalid hotkey: empty string`);
  }
  const mods = new Set<Modifier>();
  let key: string | null = null;
  for (const token of tokens) {
    const mod = tokenToMod(token);
    if (mod !== null) {
      mods.add(mod);
      continue;
    }
    if (key !== null) {
      throw new Error(`Invalid hotkey "${input}": multiple non-modifier keys`);
    }
    key = token;
  }
  if (key === null) {
    throw new Error(`Invalid hotkey "${input}": missing key`);
  }
  return { mods, key };
}

export function parseKeys(keys: string | readonly string[]): ParsedChord[] {
  const list = typeof keys === "string" ? [keys] : keys;
  return list.map(parseChord);
}

/** Canonical wire form used as a map key in the registry. */
export function canonicalize(chord: ParsedChord): string {
  const parts: string[] = [];
  for (const mod of MOD_ORDER) {
    if (chord.mods.has(mod)) parts.push(mod);
  }
  parts.push(chord.key);
  return parts.join("+");
}

/**
 * Normalize a keyboard event to its canonical chord string. Returns `null`
 * if the event is a bare modifier press (`Shift` by itself, etc.) so callers
 * can short-circuit before a map lookup.
 */
export function normalizeEvent(e: KeyboardEvent): string | null {
  const key = e.key.toLowerCase();
  if (key === "control" || key === "shift" || key === "alt" || key === "meta") {
    return null;
  }
  const mods = new Set<Modifier>();
  if (e.ctrlKey) mods.add("ctrl");
  // A shifted printable symbol (`?`, `:`, `+`, `~`, …) already encodes Shift in
  // the character it produces, so a bare `useHotkey("?")` should match without
  // the caller also writing `shift+?`. Fold Shift into single non-alphanumeric
  // keys; letters and named keys (arrows, `tab`) keep it, so `shift+a` and
  // `shift+tab` stay distinct chords.
  if (e.shiftKey && !isShiftedSymbol(key)) mods.add("shift");
  if (e.altKey) mods.add("alt");
  if (e.metaKey) mods.add("meta");
  return canonicalize({ mods, key });
}

/** A single printable symbol (`?`, `+`, `:`, …) — not a letter, digit, or named key. */
function isShiftedSymbol(key: string): boolean {
  return key.length === 1 && !/[a-z0-9]/.test(key);
}

const SPECIAL_KEY_LABELS: Record<string, string> = {
  escape: "Esc",
  esc: "Esc",
  enter: "Enter",
  return: "Enter",
  tab: "Tab",
  " ": "Space",
  space: "Space",
  arrowup: "↑",
  arrowdown: "↓",
  arrowleft: "←",
  arrowright: "→",
  backspace: "Backspace",
  delete: "Del",
};

// Apple renders chords as glyphs (⌃⇧⌥⌘); other platforms spell them out.
const MOD_LABELS: Record<Modifier, string> = IS_APPLE
  ? { ctrl: "⌃", shift: "⇧", alt: "⌥", meta: "⌘" }
  : { ctrl: "Ctrl", shift: "Shift", alt: "Alt", meta: "Meta" };

/** Visual chips for a chord — one entry per modifier and the final key. */
export function formatChord(chord: ParsedChord): string[] {
  const parts: string[] = [];
  for (const mod of MOD_ORDER) {
    if (chord.mods.has(mod)) parts.push(MOD_LABELS[mod]);
  }
  const special = SPECIAL_KEY_LABELS[chord.key];
  if (special !== undefined) {
    parts.push(special);
  } else if (chord.key.length === 1) {
    parts.push(chord.key.toUpperCase());
  } else {
    parts.push(chord.key.charAt(0).toUpperCase() + chord.key.slice(1));
  }
  return parts;
}

const ARIA_MOD_LABELS: Record<Modifier, string> = {
  ctrl: "Control",
  shift: "Shift",
  alt: "Alt",
  meta: "Meta",
};

function toAriaPart(chord: ParsedChord): string {
  const parts: string[] = [];
  for (const mod of MOD_ORDER) {
    if (chord.mods.has(mod)) parts.push(ARIA_MOD_LABELS[mod]);
  }
  parts.push(chord.key.length === 1 ? chord.key.toUpperCase() : chord.key);
  return parts.join("+");
}

/**
 * Serialize one or more chords to the `aria-keyshortcuts` format
 * (space-separated alternatives, modifiers as `Control`/`Shift`/etc.).
 */
export function toAriaKeyShortcuts(chords: readonly ParsedChord[]): string {
  return chords.map(toAriaPart).join(" ");
}
