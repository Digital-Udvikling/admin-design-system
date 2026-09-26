"use client";

import { useCallback, useContext, useEffect, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { PortalContainerContext } from "./portal-context";

export interface UseCopyOptions {
  /** How long `copied` stays `true` after a successful copy, in ms. Default: `1200`. */
  timeout?: number;
}

export interface UseCopyResult {
  /** `true` for `timeout` ms after the last successful copy. */
  copied: boolean;
  /**
   * Writes `text` to the clipboard. Resolves `true` on success and `false` when `text`
   * is empty or the Clipboard API rejects (permission denied, insecure context).
   * A copy during the `copied` window restarts it.
   */
  copy: (text: string) => Promise<boolean>;
}

/** Clipboard write with a timed `copied` flag for swapping an icon or label. */
export function useCopy({ timeout = 1200 }: UseCopyOptions = {}): UseCopyResult {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = useCallback(
    async (text: string) => {
      if (!text) return false;
      try {
        await navigator.clipboard.writeText(text);
      } catch {
        return false;
      }
      clearTimeout(timer.current);
      setCopied(true);
      timer.current = setTimeout(() => setCopied(false), timeout);
      return true;
    },
    [timeout],
  );

  return { copied, copy };
}

// Inline, not a class: without an <AdminRoot> the region portals to <body>, outside the `_ao-` scope.
const visuallyHidden: CSSProperties = {
  position: "absolute",
  width: 1,
  height: 1,
  margin: -1,
  padding: 0,
  overflow: "hidden",
  clip: "rect(0 0 0 0)",
  whiteSpace: "nowrap",
  border: 0,
};

/**
 * Polite live region that reads `label` while `copied` is set. A button's children are
 * presentational, so the region can't live inside it, and a sibling would join `btn-group`
 * layout; it portals into the enclosing `<Dialog>` or `<AdminRoot>` instead, which a modal
 * dialog doesn't make inert. Mounted empty so the first announcement registers.
 */
export function CopyStatus({ copied, label }: { copied: boolean; label: string }) {
  const portalContainer = useContext(PortalContainerContext);
  const [container, setContainer] = useState<HTMLElement | null>(null);
  useEffect(() => setContainer(portalContainer?.current ?? document.body), [portalContainer]);
  if (container === null) return null;
  return createPortal(<output style={visuallyHidden}>{copied ? label : ""}</output>, container);
}
