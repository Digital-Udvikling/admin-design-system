import type { RefObject } from "react";
import { normalizeEvent } from "./hotkey-parse";

/**
 * Module-level keyboard shortcut registry: one window keydown listener,
 * attached on first registration and detached when the registry empties.
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
  // A held chord autorepeats keydown; the bound action should fire once per press.
  if (e.repeat) return;
  const chord = normalizeEvent(e);
  if (chord === null) return;
  const bucket = registry.get(chord);
  if (!bucket || bucket.size === 0) return;

  // Bare-key chords are silent in editable elements; `escape` stays live so dialogs can close.
  if (isEditableTarget(e.target) && !chord.includes("+") && chord !== "escape") return;

  e.preventDefault();
  for (const entry of bucket) {
    entry.handlerRef.current?.(e);
  }
}

/** Returns an unregister function. */
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
