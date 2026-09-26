"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Button } from "./Button";
import { Dialog } from "./Dialog";
import { Field } from "./Field";
import { Input } from "./Input";
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

export interface PromptOptions {
  /** Dialog heading. */
  title: ReactNode;
  /** Supporting text under the heading. */
  description?: ReactNode;
  /** Label of the text input. */
  label: ReactNode;
  /** Initial input value. Default: `""`. */
  defaultValue?: string;
  /** Input placeholder. */
  placeholder?: string;
  /** Native `required`: an empty input blocks Confirm and shows the invalid state. */
  required?: boolean;
  /** Confirm button label. Default: `"Confirm"`. */
  confirmLabel?: ReactNode;
  /** Cancel button label. Default: `"Cancel"`. */
  cancelLabel?: ReactNode;
  /** `"danger"` renders a danger confirm button. Default: `"default"`. */
  variant?: "default" | "danger";
}

type PromptFn = (options: PromptOptions) => Promise<string | null>;

type Request =
  | { kind: "confirm"; options: ConfirmOptions; resolve: (confirmed: boolean) => void }
  | { kind: "prompt"; options: PromptOptions; resolve: (value: string | null) => void };

type Pending = Request & { id: number };

// The answer a request settles with when it is dismissed or its host unmounts.
function dismiss(entry: Pending) {
  if (entry.kind === "confirm") entry.resolve(false);
  else entry.resolve(null);
}

const ConfirmContext = createContext<{ confirm: ConfirmFn; prompt: PromptFn } | null>(null);

/**
 * Returns `confirm(options)`, an async `window.confirm`: it opens a confirmation
 * dialog and resolves `true` on Confirm, `false` on Cancel, Esc, or when the
 * hosting `<AdminRoot>` unmounts. Calls made while a dialog is open queue and
 * open in call order. The function identity is stable.
 *
 * @throws When called outside `<AdminRoot>`, which hosts the dialog.
 */
export function useConfirm(): ConfirmFn {
  const host = useContext(ConfirmContext);
  if (host === null) {
    throw new Error("useConfirm() must be called inside <AdminRoot>, which hosts the dialog.");
  }
  return host.confirm;
}

/**
 * Returns `prompt(options)`, an async `window.prompt`: it opens a dialog with one
 * labelled text input and resolves the entered string on Confirm (Enter submits),
 * or `null` on Cancel, Esc, or when the hosting `<AdminRoot>` unmounts. Shares
 * `useConfirm()`'s queue, so the two open one at a time in call order. The
 * function identity is stable.
 *
 * @throws When called outside `<AdminRoot>`, which hosts the dialog.
 */
export function usePrompt(): PromptFn {
  const host = useContext(ConfirmContext);
  if (host === null) {
    throw new Error("usePrompt() must be called inside <AdminRoot>, which hosts the dialog.");
  }
  return host.prompt;
}

/**
 * Hosts `useConfirm()` and `usePrompt()` for its subtree: queues requests FIFO and
 * renders the head of the queue as a dialog, nothing while idle. Rendered by `<AdminRoot>`.
 */
export function ConfirmHost({ children }: { children?: ReactNode }) {
  const [queue, setQueue] = useState<readonly Pending[]>([]);
  // Unsettled requests, mutated only from callbacks so the unmount cleanup can resolve them.
  const pending = useRef(new Set<Pending>());
  const nextId = useRef(0);

  const enqueue = useCallback((request: Request) => {
    const entry: Pending = { ...request, id: nextId.current++ };
    pending.current.add(entry);
    setQueue((q) => [...q, entry]);
  }, []);

  const host = useMemo(
    () => ({
      confirm: (options: ConfirmOptions) =>
        new Promise<boolean>((resolve) => enqueue({ kind: "confirm", options, resolve })),
      prompt: (options: PromptOptions) =>
        new Promise<string | null>((resolve) => enqueue({ kind: "prompt", options, resolve })),
    }),
    [enqueue],
  );

  const remove = useCallback((entry: Pending) => {
    setQueue((q) => q.filter((e) => e !== entry));
    return pending.current.delete(entry);
  }, []);

  useEffect(() => {
    const set = pending.current;
    return () => {
      for (const entry of set) dismiss(entry);
      set.clear();
      // A no-op on a real unmount; keeps state consistent when StrictMode or
      // <Activity> re-runs effects on a live instance.
      setQueue([]);
    };
  }, []);

  const current = queue[0];
  return (
    <ConfirmContext.Provider value={host}>
      {children}
      {current?.kind === "confirm" ? (
        <ConfirmDialog
          key={current.id}
          options={current.options}
          onSettle={(confirmed) => {
            if (remove(current)) current.resolve(confirmed);
          }}
        />
      ) : current?.kind === "prompt" ? (
        <PromptDialog
          key={current.id}
          options={current.options}
          onSettle={(value) => {
            if (remove(current)) current.resolve(value);
          }}
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

function PromptDialog({
  options,
  onSettle,
}: {
  options: PromptOptions;
  onSettle: (value: string | null) => void;
}) {
  const {
    title,
    description,
    label,
    defaultValue = "",
    placeholder,
    required,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    variant = "default",
  } = options;
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const value = useRef<string | null>(null);

  // showModal() focused the first focusable element; the input is the one to type in.
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const close = (result: string | null) => {
    value.current = result;
    dialogRef.current?.close();
  };

  return (
    <Dialog.Container
      ref={dialogRef}
      open
      onOpenChange={(open) => {
        if (!open) onSettle(value.current);
      }}
      size="sm"
      closedby="closerequest"
    >
      {/* Submit runs only once native validation passes, so `required` blocks it. */}
      <form
        onSubmit={(event) => {
          event.preventDefault();
          close(inputRef.current?.value ?? "");
        }}
      >
        <Dialog.Header>
          <Dialog.Title>{title}</Dialog.Title>
        </Dialog.Header>
        {hasNode(description) ? <Dialog.Description>{description}</Dialog.Description> : null}
        <Dialog.Body>
          <Field label={label}>
            <Input
              ref={inputRef}
              defaultValue={defaultValue}
              placeholder={placeholder}
              required={required}
              autoComplete="off"
            />
          </Field>
        </Dialog.Body>
        <Dialog.Footer>
          <Button variant="ghost" onClick={() => close(null)}>
            {cancelLabel}
          </Button>
          <Button type="submit" variant={variant === "danger" ? "danger" : "primary"}>
            {confirmLabel}
          </Button>
        </Dialog.Footer>
      </form>
    </Dialog.Container>
  );
}
