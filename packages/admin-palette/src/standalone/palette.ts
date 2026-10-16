// The standalone entry: binds the hotkey and triggers without React, and loads the palette
// (React and all) on first open.

import { IS_APPLE, canonicalize, normalizeEvent, parseKeys } from "@aortl/admin-react/internal";
import { closePalette, createRegistration, getOpenState, openPalette } from "../store";
import type { Command, OpenOptions } from "../types";
import type { StandaloneOptions } from "./app";

export type { StandaloneOptions } from "./app";
export type { Command, CommandIcon, OpenOptions, Source, SourceContext } from "../types";

let options: StandaloneOptions | undefined;
let mounted: Promise<void> | undefined;

function mount(): Promise<void> {
  mounted ??= import("./app").then((app) => app.mount(options ?? {}));
  return mounted;
}

function isEditable(target: EventTarget | null): boolean {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable || target.tagName === "INPUT" || target.tagName === "TEXTAREA")
  );
}

/**
 * Sets up the palette: binds `hotkey` and clicks on `[data-admin-palette]`. The palette itself
 * loads on first open. Call once.
 */
export function init(standalone: StandaloneOptions = {}): void {
  if (options) throw new Error("AdminPalette.init() was already called");
  options = standalone;
  const { hotkey = "mod+k" } = standalone;
  const chords = hotkey === false ? [] : parseKeys(hotkey, IS_APPLE).map(canonicalize);
  window.addEventListener("keydown", (event) => {
    if (event.repeat || event.defaultPrevented) return;
    const chord = normalizeEvent(event);
    if (chord === null || !chords.includes(chord)) return;
    // A bare-key binding (`/`) stays quiet while the user types.
    if (!chord.includes("+") && isEditable(event.composedPath()[0] ?? null)) return;
    event.preventDefault();
    if (getOpenState().open) closePalette();
    else open();
  });
  document.addEventListener("click", (event) => {
    const trigger = (event.target as Element | null)?.closest?.("[data-admin-palette]");
    if (!trigger) return;
    event.preventDefault();
    const page = trigger.getAttribute("data-admin-palette");
    open(page ? { page } : {});
  });
}

/** Opens the palette, at the root or inside the page `options.page` names. */
export function open(openOptions: OpenOptions = {}): void {
  openPalette(openOptions);
  void mount();
}

export function close(): void {
  closePalette();
}

/** Adds commands under "This page" until the returned function is called. */
export function register(commands: readonly Command[]): () => void {
  const registration = createRegistration();
  registration.set(commands);
  return registration.remove;
}

const AdminPalette = { init, open, close, register };

declare global {
  interface Window {
    AdminPalette?: typeof AdminPalette;
  }
}

// For inline handlers and templates that can't import a module.
window.AdminPalette = AdminPalette;
