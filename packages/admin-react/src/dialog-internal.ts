import { createContext, useCallback, useEffect, useRef, type Ref } from "react";

export interface DialogContextValue {
  close: () => void;
}

export const DialogContext = createContext<DialogContextValue | null>(null);

/**
 * Drives a native `<dialog>` from a controlled `open` prop, shared by `<Dialog>`
 * and `<Drawer>`: merges the consumer ref, calls `showModal()` / `close()` on
 * change, and reports closes (Esc, backdrop, form submit) via `onOpenChange`.
 * Returns `ref` for the portal container context.
 */
export function useDialogElement(
  open: boolean | undefined,
  onOpenChange: ((open: boolean) => void) | undefined,
  consumerRef: Ref<HTMLDialogElement> | undefined,
) {
  const ref = useRef<HTMLDialogElement | null>(null);
  const onOpenChangeRef = useRef(onOpenChange);
  onOpenChangeRef.current = onOpenChange;

  // Without this merge, a consumer `ref` would flow through `...rest`, override
  // `ref={ref}`, and silently break open/close.
  const setRef = useCallback(
    (node: HTMLDialogElement | null) => {
      ref.current = node;
      if (typeof consumerRef === "function") consumerRef(node);
      else if (consumerRef) consumerRef.current = node;
    },
    [consumerRef],
  );

  useEffect(() => {
    const el = ref.current;
    if (!el || open === undefined) return;
    if (open && !el.open) el.showModal();
    else if (!open && el.open) el.close();
  }, [open]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handleClose = () => onOpenChangeRef.current?.(false);
    el.addEventListener("close", handleClose);
    return () => el.removeEventListener("close", handleClose);
  }, []);

  const ctx: DialogContextValue = { close: () => ref.current?.close() };
  return { setRef, ctx, ref };
}
