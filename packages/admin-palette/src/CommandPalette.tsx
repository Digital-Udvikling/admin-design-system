import { Kbd } from "@aortl/admin-react";
import { cn } from "@aortl/admin-react/internal";
import type { ComponentProps, ReactNode } from "react";
import { CommandPaletteRoot } from "./CommandPalette.client";

export type { CommandPaletteProps } from "./CommandPalette.client";

export interface CommandPaletteTriggerProps extends Omit<ComponentProps<"button">, "children"> {
  /** Opens straight into this command's page. */
  page?: string;
  /** Chord shown as the hint, in `useHotkey` syntax; `null` hides it. Match the palette's `hotkey`. Default: `"mod+k"`. */
  keys?: string | null;
  /** Default: `"Search"`. */
  children?: ReactNode;
}

/** A search-field-shaped button that opens the palette; no handler, so it renders on the server. */
function CommandPaletteTrigger({
  page,
  keys = "mod+k",
  className,
  type = "button",
  children = "Search",
  ...rest
}: CommandPaletteTriggerProps) {
  return (
    <button
      type={type}
      className={cn("palette-trigger", className)}
      data-admin-palette={page ?? ""}
      aria-haspopup="dialog"
      {...rest}
    >
      <svg
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="10" cy="10" r="7" />
        <path d="m21 21-6-6" />
      </svg>
      <span className={cn("palette-trigger-label", undefined)}>{children}</span>
      {keys !== null ? <Kbd keys={keys} /> : null}
    </button>
  );
}

export const CommandPalette = Object.assign(CommandPaletteRoot, {
  Trigger: CommandPaletteTrigger,
});
