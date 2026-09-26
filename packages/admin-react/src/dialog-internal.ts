import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type Ref,
} from "react";

export interface DialogContextValue {
  close: () => void;
  /** Publishes the rendered title's id for the dialog's `aria-labelledby`; `undefined` withdraws it. */
  setTitleId: (id: string | undefined) => void;
  /** Publishes the rendered description's id for the dialog's `aria-describedby`; `undefined` withdraws it. */
  setDescriptionId: (id: string | undefined) => void;
}

export const DialogContext = createContext<DialogContextValue | null>(null);

/**
 * Drives a native `<dialog>` from a controlled `open` prop, shared by `<Dialog>`
 * and `<Drawer>`: merges the consumer ref, calls `showModal()` / `close()` on
 * change, and reports closes (Esc, backdrop, form submit) via `onOpenChange`.
 * Returns `ref` for the portal container context, and the ids the mounted title
 * and description registered (`undefined` while none is mounted).
 */
export function useDialogElement(
  open: boolean | undefined,
  onOpenChange: ((open: boolean) => void) | undefined,
  consumerRef: Ref<HTMLDialogElement> | undefined,
) {
  const ref = useRef<HTMLDialogElement | null>(null);
  const onOpenChangeRef = useRef(onOpenChange);
  onOpenChangeRef.current = onOpenChange;
  const [titleId, setTitleId] = useState<string | undefined>(undefined);
  const [descriptionId, setDescriptionId] = useState<string | undefined>(undefined);

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

  const ctx: DialogContextValue = {
    close: () => ref.current?.close(),
    setTitleId,
    setDescriptionId,
  };
  return { setRef, ctx, ref, titleId, descriptionId };
}

/**
 * Resolves the id of a dialog title or description (the consumer's `id`, else a
 * generated one) and registers it with the enclosing dialog while mounted, so
 * the `<dialog>` is named and described by it. Outside a dialog it only
 * resolves the id.
 */
export function useDialogLabelId(kind: "title" | "description", id: string | undefined): string {
  const generated = useId();
  const resolved = id ?? generated;
  const ctx = useContext(DialogContext);
  const register =
    ctx === null ? undefined : kind === "title" ? ctx.setTitleId : ctx.setDescriptionId;
  useLayoutEffect(() => {
    if (register === undefined) return;
    register(resolved);
    return () => register(undefined);
  }, [register, resolved]);
  return resolved;
}
