import { clsx } from "clsx";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  type ComponentProps,
  type ReactNode,
} from "react";
import { renderIcon, type IconProp } from "./icon";

export type DialogSize = "sm" | "md" | "lg";
export type DialogClosedBy = "any" | "closerequest" | "none";

interface DialogContextValue {
  close: () => void;
}

const DialogContext = createContext<DialogContextValue | null>(null);

function DefaultCloseIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

export interface DialogContainerProps extends Omit<ComponentProps<"dialog">, "open"> {
  /** Controlled open state. Omit for uncontrolled (e.g. driven by Invoker Commands). */
  open?: boolean;
  /** Fires when the dialog closes (Esc, backdrop, close button, form method="dialog"). */
  onOpenChange?: (open: boolean) => void;
  /** Width preset. Default: `"md"`. */
  size?: DialogSize;
  /**
   * Native `closedby` attribute. `"any"` allows Esc + backdrop click,
   * `"closerequest"` only Esc, `"none"` neither. Default: `"any"`.
   */
  closedby?: DialogClosedBy;
}

/**
 * The bare `<dialog>` primitive — no opinions about header, body, or footer.
 * Use this when the default `<Dialog>` layout doesn't fit (custom header,
 * media block, multi-step content).
 */
function DialogContainer({
  open,
  onOpenChange,
  size = "md",
  closedby = "any",
  className,
  children,
  ...rest
}: DialogContainerProps) {
  const ref = useRef<HTMLDialogElement | null>(null);
  const onOpenChangeRef = useRef(onOpenChange);
  onOpenChangeRef.current = onOpenChange;

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
  };

  return (
    <DialogContext.Provider value={ctx}>
      <dialog
        ref={ref}
        className={clsx("dialog", size !== "md" && `dialog-${size}`, className)}
        closedby={closedby}
        {...rest}
      >
        {children}
      </dialog>
    </DialogContext.Provider>
  );
}

export type DialogHeaderProps = ComponentProps<"div">;

function DialogHeader({ className, ...rest }: DialogHeaderProps) {
  return <div className={clsx("dialog-header", className)} {...rest} />;
}

export interface DialogTitleProps extends ComponentProps<"h2"> {
  /** Leading icon. */
  icon?: IconProp;
}

function DialogTitle({ icon, className, children, ...rest }: DialogTitleProps) {
  return (
    <h2 className={clsx("dialog-title", className)} {...rest}>
      {renderIcon(icon)}
      {children}
    </h2>
  );
}

export type DialogDescriptionProps = ComponentProps<"p">;

function DialogDescription({ className, ...rest }: DialogDescriptionProps) {
  return <p className={clsx("dialog-description", className)} {...rest} />;
}

export type DialogBodyProps = ComponentProps<"div">;

function DialogBody({ className, ...rest }: DialogBodyProps) {
  return <div className={clsx("dialog-body", className)} {...rest} />;
}

export type DialogFooterProps = ComponentProps<"div">;

function DialogFooter({ className, ...rest }: DialogFooterProps) {
  return <div className={clsx("dialog-footer", className)} {...rest} />;
}

export interface DialogCloseButtonProps extends ComponentProps<"button"> {
  /** Override the default X icon. */
  icon?: IconProp;
}

function DialogCloseButton({
  icon,
  className,
  children,
  onClick,
  type = "button",
  "aria-label": ariaLabel = "Close",
  ...rest
}: DialogCloseButtonProps) {
  const ctx = useContext(DialogContext);
  return (
    <button
      type={type}
      className={clsx("dialog-close", className)}
      aria-label={ariaLabel}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) ctx?.close();
      }}
      {...rest}
    >
      {children ?? (icon !== undefined ? renderIcon(icon) : <DefaultCloseIcon />)}
    </button>
  );
}

export interface DialogProps extends Omit<DialogContainerProps, "title" | "children"> {
  /** Leading icon for the title row. */
  icon?: IconProp;
  /** Renders as `<Dialog.Title>`. */
  title?: ReactNode;
  /** Renders as `<Dialog.Description>`. */
  description?: ReactNode;
  /** Renders as `<Dialog.Footer>`. */
  actions?: ReactNode;
  /** Show the X close button in the header. Default: `true`. */
  dismissible?: boolean;
  /** aria-label for the close button. Default: `"Close"`. */
  closeLabel?: string;
  children?: ReactNode;
}

/**
 * Standard modal: a `<dialog>` with an opinionated header / body / footer
 * layout driven by shorthand props. For anything outside that shape, use
 * `<Dialog.Container>` and compose by hand.
 */
function DialogRoot({
  icon,
  title,
  description,
  actions,
  dismissible = true,
  closeLabel = "Close",
  children,
  ...containerProps
}: DialogProps) {
  const hasTitle = title !== undefined || icon !== undefined;
  const showHeader = hasTitle || dismissible;
  return (
    <DialogContainer {...containerProps}>
      {showHeader ? (
        <DialogHeader>
          {hasTitle ? <DialogTitle icon={icon}>{title}</DialogTitle> : <span className="flex-1" />}
          {dismissible ? <DialogCloseButton aria-label={closeLabel} /> : null}
        </DialogHeader>
      ) : null}
      {description !== undefined ? <DialogDescription>{description}</DialogDescription> : null}
      {children !== undefined ? <DialogBody>{children}</DialogBody> : null}
      {actions !== undefined ? <DialogFooter>{actions}</DialogFooter> : null}
    </DialogContainer>
  );
}

export const Dialog = Object.assign(DialogRoot, {
  Container: DialogContainer,
  Header: DialogHeader,
  Title: DialogTitle,
  Description: DialogDescription,
  Body: DialogBody,
  Footer: DialogFooter,
  CloseButton: DialogCloseButton,
});
