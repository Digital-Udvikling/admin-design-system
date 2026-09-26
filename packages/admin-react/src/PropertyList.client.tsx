"use client";

import { useCallback, useRef, useState, type MouseEvent } from "react";
import { cn } from "./cn";
import type { PropertyListValueProps } from "./PropertyList";

// Hand-rolled to Tabler's stroke conventions so admin-react stays icon-library-agnostic.
function CopyGlyph({ className }: { className: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M7 7m0 2a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2z" />
      <path d="M15 7v-2a2 2 0 0 0 -2 -2h-8a2 2 0 0 0 -2 2v8a2 2 0 0 0 2 2h2" />
    </svg>
  );
}

function CheckGlyph({ className }: { className: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M5 12l5 5l10 -10" />
    </svg>
  );
}

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
  const setRef = useCallback(
    (node: HTMLElement | null) => {
      ddRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );
  const copyButtonRef = useRef<HTMLButtonElement | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const text = copyValue ?? ddRef.current?.textContent?.trim() ?? "";
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // Permission denied or unsupported — fail silently.
    }
  }

  // The whole cell is the click target; the button carries no handler of its
  // own — its keyboard activation click bubbles here — so a button press and
  // a cell click can't double-fire.
  function handleCellClick(event: MouseEvent<HTMLElement>) {
    onClick?.(event);
    if (event.defaultPrevented) return;
    if (window.getSelection()?.toString()) return;
    const interactive = (event.target as HTMLElement).closest("a, button, input, select, textarea");
    if (interactive && interactive !== copyButtonRef.current) return;
    void handleCopy();
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
        <CopyGlyph className={cn("property-list-copy-icon", undefined)} />
        <CheckGlyph className={cn("property-list-copy-icon-copied", undefined)} />
      </button>
    </dd>
  );
}
