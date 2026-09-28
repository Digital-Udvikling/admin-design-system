import {
  createContext,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type Ref,
} from "react";
import { mergeRefs } from "./merge-refs";

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
 * change, reports closes and outside opens (invoker command, `showModal()`) via
 * `onOpenChange`, focuses `[data-autofocus]` on every open, and emulates
 * `closedby="any"` where unsupported (Safari). Returns `ref` for the portal
 * container context and the registered title and description ids.
 */
export function useDialogElement(
  open: boolean | undefined,
  onOpenChange: ((open: boolean) => void) | undefined,
  consumerRef: Ref<HTMLDialogElement> | undefined,
  closedby: "any" | "closerequest" | "none",
) {
  const ref = useRef<HTMLDialogElement | null>(null);
  const onOpenChangeRef = useRef(onOpenChange);
  onOpenChangeRef.current = onOpenChange;
  const openRef = useRef(open);
  openRef.current = open;
  const [titleId, setTitleId] = useState<string | undefined>(undefined);
  const [descriptionId, setDescriptionId] = useState<string | undefined>(undefined);

  // Without this merge, a consumer `ref` would flow through `...rest`, override
  // `ref={ref}`, and silently break open/close.
  const setRef = useMemo(() => mergeRefs<HTMLDialogElement>(ref, consumerRef), [consumerRef]);

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
    const handleToggle = (event: Event) => {
      if (event.target !== el || (event as ToggleEvent).newState !== "open") return;
      // Stands in for `autoFocus`, which React focuses at mount, while the dialog is still closed.
      el.querySelector<HTMLElement>("[data-autofocus]")?.focus();
      if (openRef.current !== true) onOpenChangeRef.current?.(true);
    };
    el.addEventListener("close", handleClose);
    el.addEventListener("toggle", handleToggle);
    return () => {
      el.removeEventListener("close", handleClose);
      el.removeEventListener("toggle", handleToggle);
    };
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || closedby !== "any" || "closedBy" in HTMLDialogElement.prototype) return;
    // A backdrop click targets the <dialog> itself, outside its box. Both ends must be on
    // the backdrop, so a drag that starts inside (selecting text) doesn't close it.
    const onBackdrop = (event: MouseEvent) => {
      if (event.target !== el) return false;
      const box = el.getBoundingClientRect();
      return (
        event.clientX < box.left ||
        event.clientX > box.right ||
        event.clientY < box.top ||
        event.clientY > box.bottom
      );
    };
    let pressedOnBackdrop = false;
    const handlePointerDown = (event: PointerEvent) => {
      pressedOnBackdrop = onBackdrop(event);
    };
    const handleClick = (event: MouseEvent) => {
      if (el.open && pressedOnBackdrop && onBackdrop(event)) el.close();
      pressedOnBackdrop = false;
    };
    el.addEventListener("pointerdown", handlePointerDown);
    el.addEventListener("click", handleClick);
    return () => {
      el.removeEventListener("pointerdown", handlePointerDown);
      el.removeEventListener("click", handleClick);
    };
  }, [closedby]);

  const ctx: DialogContextValue = {
    close: () => ref.current?.close(),
    setTitleId,
    setDescriptionId,
  };
  return { setRef, ctx, ref, titleId, descriptionId };
}

/**
 * Resolves a title or description id (the consumer's `id`, else a generated one) and registers
 * it with the enclosing dialog while mounted.
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
