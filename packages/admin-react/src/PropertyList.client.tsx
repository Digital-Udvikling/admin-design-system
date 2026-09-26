"use client";

import { useMemo, useRef, type MouseEvent } from "react";
import { cn } from "./cn";
import { CheckGlyph, CopyGlyph } from "./copy-glyphs";
import { mergeRefs } from "./merge-refs";
import type { PropertyListValueProps } from "./PropertyList";
import { CopyStatus, useCopy } from "./useCopy";

export function PropertyListValue({
  numeric,
  copyable,
  empty,
  copyValue,
  className,
  classNames,
  children,
  onClick,
  ref,
  ...rest
}: PropertyListValueProps) {
  // Merged, not overridden by `rest`: copy reads the cell's text through ddRef.
  const ddRef = useRef<HTMLElement | null>(null);
  const setRef = useMemo(() => mergeRefs<HTMLElement>(ddRef, ref), [ref]);
  const copyButtonRef = useRef<HTMLButtonElement | null>(null);
  const { copied, copy } = useCopy();

  // The button has no handler (its keyboard click bubbles here), so nothing double-fires.
  function handleCellClick(event: MouseEvent<HTMLElement>) {
    onClick?.(event);
    if (event.defaultPrevented) return;
    if (window.getSelection()?.toString()) return;
    const interactive = (event.target as HTMLElement).closest("a, button, input, select, textarea");
    if (interactive && interactive !== copyButtonRef.current) return;
    void copy(copyValue ?? ddRef.current?.textContent?.trim() ?? "");
  }

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions -- the nested copy button is the keyboard path; the cell click is a pointer-only convenience
    <dd
      ref={setRef}
      className={cn(
        [
          "property-list-value",
          numeric && "property-list-value-numeric",
          copyable && "property-list-value-copyable",
          empty && "property-list-value-empty",
        ],
        className,
      )}
      onClick={copyable ? handleCellClick : onClick}
      {...rest}
    >
      {children}
      <button
        ref={copyButtonRef}
        type="button"
        aria-label="Copy"
        className={cn("property-list-copy", classNames?.copy)}
        data-copied={copied ? "true" : undefined}
      >
        <CopyGlyph size={14} className={cn("property-list-copy-icon", undefined)} />
        <CheckGlyph size={14} className={cn("property-list-copy-icon-copied", undefined)} />
      </button>
      {copyable ? <CopyStatus copied={copied} label="Copied" /> : null}
    </dd>
  );
}
