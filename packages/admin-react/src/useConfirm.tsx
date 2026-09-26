import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Button } from "./Button";
import { Dialog } from "./Dialog";
import { hasNode } from "./slot";

export interface ConfirmOptions {
  /** Dialog heading. */
  title: ReactNode;
  /** Supporting text under the heading. */
  description?: ReactNode;
  /** Confirm button label. Default: `"Confirm"`. */
  confirmLabel?: ReactNode;
  /** Cancel button label. Default: `"Cancel"`. */
  cancelLabel?: ReactNode;
  /** `"danger"` renders a danger confirm button and focuses Cancel instead of Confirm. Default: `"default"`. */
  variant?: "default" | "danger";
}

type ConfirmFn = (options: ConfirmOptions) => Promise<boolean>;

interface PendingConfirm {
  id: number;
  options: ConfirmOptions;
  resolve: (confirmed: boolean) => void;
}

const ConfirmContext = createContext<ConfirmFn | null>(null);

/**
 * Returns `confirm(options)`, an async `window.confirm`: it opens a confirmation
 * dialog and resolves `true` on Confirm, `false` on Cancel, Esc, or when the
 * hosting `<AdminRoot>` unmounts. Calls made while a dialog is open queue and
 * open in call order. The function identity is stable.
 *
 * @throws When called outside `<AdminRoot>`, which hosts the dialog.
 */
export function useConfirm(): ConfirmFn {
  const confirm = useContext(ConfirmContext);
  if (confirm === null) {
    throw new Error("useConfirm() must be called inside <AdminRoot>, which hosts the dialog.");
  }
  return confirm;
}

/**
 * Hosts `useConfirm()` for its subtree: queues requests FIFO and renders the
 * head of the queue as a dialog, nothing while idle. Rendered by `<AdminRoot>`.
 */
export function ConfirmHost({ children }: { children?: ReactNode }) {
  const [queue, setQueue] = useState<readonly PendingConfirm[]>([]);
  // Unsettled requests, mutated only from callbacks so the unmount cleanup can resolve them.
  const pending = useRef(new Set<PendingConfirm>());
  const nextId = useRef(0);

  const confirm = useCallback<ConfirmFn>(
    (options) =>
      new Promise<boolean>((resolve) => {
        const entry: PendingConfirm = { id: nextId.current++, options, resolve };
        pending.current.add(entry);
        setQueue((q) => [...q, entry]);
      }),
    [],
  );

  const settle = useCallback((entry: PendingConfirm, confirmed: boolean) => {
    if (pending.current.delete(entry)) entry.resolve(confirmed);
    setQueue((q) => q.filter((e) => e !== entry));
  }, []);

  useEffect(() => {
    const set = pending.current;
    return () => {
      for (const entry of set) entry.resolve(false);
      set.clear();
      // A no-op on a real unmount; keeps state consistent when StrictMode or
      // <Activity> re-runs effects on a live instance.
      setQueue([]);
    };
  }, []);

  const current = queue[0];
  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {current !== undefined ? (
        <ConfirmDialog
          key={current.id}
          options={current.options}
          onSettle={(confirmed) => settle(current, confirmed)}
        />
      ) : null}
    </ConfirmContext.Provider>
  );
}

function ConfirmDialog({
  options,
  onSettle,
}: {
  options: ConfirmOptions;
  onSettle: (confirmed: boolean) => void;
}) {
  const {
    title,
    description,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    variant = "default",
  } = options;
  const danger = variant === "danger";
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const initialFocusRef = useRef<HTMLElement | null>(null);
  const confirmed = useRef(false);

  // Child effects run first, so the dialog is already open via showModal(),
  // which focused the first button; move focus to the intended one.
  useEffect(() => {
    initialFocusRef.current?.focus();
  }, []);

  // Closing through the element (not unmounting) lets the browser restore focus
  // to the invoker; the native `close` event then settles with the chosen answer.
  const answer = (value: boolean) => {
    confirmed.current = value;
    dialogRef.current?.close();
  };

  return (
    <Dialog.Container
      ref={dialogRef}
      open
      onOpenChange={(open) => {
        if (!open) onSettle(confirmed.current);
      }}
      size="sm"
      closedby="closerequest"
      role="alertdialog"
    >
      <Dialog.Header>
        <Dialog.Title>{title}</Dialog.Title>
      </Dialog.Header>
      {hasNode(description) ? <Dialog.Description>{description}</Dialog.Description> : null}
      <Dialog.Footer>
        <Button
          ref={danger ? initialFocusRef : undefined}
          variant="ghost"
          onClick={() => answer(false)}
        >
          {cancelLabel}
        </Button>
        <Button
          ref={danger ? undefined : initialFocusRef}
          variant={danger ? "danger" : "primary"}
          onClick={() => answer(true)}
        >
          {confirmLabel}
        </Button>
      </Dialog.Footer>
    </Dialog.Container>
  );
}
