"use client";

import { useEffect, useRef } from "react";
import { closePalette, createRegistration, openPalette, type Registration } from "./store";
import type { Command, OpenOptions } from "./types";

/**
 * Adds commands to the palette while the calling component is mounted, listed under "This page"
 * before anything is typed. Pass a fresh array each render to keep `perform` closures current.
 */
export function useCommands(commands: readonly Command[]): void {
  const registration = useRef<Registration | null>(null);
  useEffect(() => {
    const created = createRegistration();
    registration.current = created;
    return () => {
      created.remove();
      registration.current = null;
    };
  }, []);
  useEffect(() => {
    registration.current?.set(commands);
  }, [commands]);
}

export interface CommandPaletteControls {
  open: (options?: OpenOptions) => void;
  close: () => void;
}

const controls: CommandPaletteControls = { open: openPalette, close: closePalette };

/** Opens or closes the palette from your own UI. */
export function useCommandPalette(): CommandPaletteControls {
  return controls;
}
