import type { RefObject } from "react";
import { normalizeEvent } from "./hotkey-parse";

/**
 * Module-level keyboard shortcut registry. One window keydown listener,
 * attached on first registration and detached when the registry empties.
 *
 * On keydown:
 *   1. Ignore OS autorepeat (`e.repeat`) so a held chord fires once, not per tick.
 *   2. Normalize the event to a canonical chord string.
 *   3. Look up the bucket. Skip if empty.
 *   4. Apply input suppression — bare-key chords are skipped while focus is
 *      in an editable element, except for `escape`.
 *   5. `preventDefault()`, then invoke every surviving handler (bag semantics).
 */

export type HotkeyHandler = (e: KeyboardEvent) => void;

export interface HotkeyEntry {
  handlerRef: RefObject<HotkeyHandler>;
}

const registry = new Map<string, Set<HotkeyEntry>>();
let listenerAttached = false;

function ensureListener(): void {
  if (listenerAttached || typeof window === "undefined") return;
  window.addEventListener("keydown", dispatch);
  listenerAttached = true;
}

function maybeDetachListener(): void {
  if (!listenerAttached || typeof window === "undefined") return;
  if (registry.size > 0) return;
  window.removeEventListener("keydown", dispatch);
  listenerAttached = false;
}

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  const tag = target.tagName;
  return tag === "INPUT" || tag === "TEXTAREA";
}

function dispatch(e: KeyboardEvent): void {
  // Edge-triggered: a held chord autorepeats keydown, but the bound action
  // (save, open a dialog, navigate) should fire once per press.
  if (e.repeat) return;
  const chord = normalizeEvent(e);
  if (chord === null) return;
  const bucket = registry.get(chord);
  if (!bucket || bucket.size === 0) return;

  // Input suppression: bare-key chords (no `+`) are silent while focused in
  // an editable element. `escape` is always allowed to fire so dialogs can
  // close even from a focused input.
  if (isEditableTarget(e.target) && !chord.includes("+") && chord !== "escape") return;

  e.preventDefault();
  for (const entry of bucket) {
    entry.handlerRef.current?.(e);
  }
}

/**
 * Register a hotkey entry under each of its canonical chord strings.
 * Returns an unregister function that removes the entry from every bucket
 * and detaches the listener if the registry is empty.
 */
export function register(canonicalChords: readonly string[], entry: HotkeyEntry): () => void {
  for (const chord of canonicalChords) {
    let bucket = registry.get(chord);
    if (!bucket) {
      bucket = new Set();
      registry.set(chord, bucket);
    }
    bucket.add(entry);
  }
  ensureListener();
  return () => {
    for (const chord of canonicalChords) {
      const bucket = registry.get(chord);
      if (!bucket) continue;
      bucket.delete(entry);
      if (bucket.size === 0) registry.delete(chord);
    }
    maybeDetachListener();
  };
}

/** Test-only: empty the registry and detach the listener. */
export function __resetRegistry(): void {
  registry.clear();
  maybeDetachListener();
}
