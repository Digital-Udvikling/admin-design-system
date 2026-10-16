import type { Command, OpenOptions } from "./types";

// One palette per document: module state lets a trigger, `useCommands` on any page and the
// standalone global reach it without a provider around the app.

export interface OpenState {
  open: boolean;
  options: OpenOptions;
}

const listeners = new Set<() => void>();
const registrations = new Map<symbol, readonly Command[]>();
let pageCommands: readonly Command[] = [];
let openState: OpenState = { open: false, options: {} };

function emit() {
  for (const listener of listeners) listener();
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export const getPageCommands = (): readonly Command[] => pageCommands;
export const getOpenState = (): OpenState => openState;

export interface Registration {
  set: (commands: readonly Command[]) => void;
  remove: () => void;
}

/** A slot in the page-scoped commands; it keeps its position across `set` calls. */
export function createRegistration(): Registration {
  const token = Symbol();
  const sync = () => {
    pageCommands = [...registrations.values()].flat();
    emit();
  };
  return {
    set(commands) {
      registrations.set(token, commands);
      sync();
    },
    remove() {
      if (registrations.delete(token)) sync();
    },
  };
}

export function openPalette(options: OpenOptions = {}): void {
  openState = { open: true, options };
  emit();
}

export function closePalette(): void {
  if (!openState.open) return;
  openState = { open: false, options: {} };
  emit();
}

export function togglePalette(): void {
  if (openState.open) closePalette();
  else openPalette();
}
