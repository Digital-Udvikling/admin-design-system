import { useContext, type ComponentProps, type ReactNode } from "react";
import { cn, type SlotClasses } from "./cn";
import { DialogContext, hasSlot, useDialogElement, useDialogLabelId } from "./dialog-internal";
import { renderIcon, type IconProp } from "./icon";
import { PortalContainerContext } from "./portal-context";

export type DialogSize = "sm" | "md" | "lg" | "auto" | "metabase";
export type DialogClosedBy = "any" | "closerequest" | "none";

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
  /** Width preset. `"auto"` shrinks to content; `"metabase"` fits a 1048px embedded iframe (1138px modal). Default: `"md"`. */
  size?: DialogSize;
  /** Native `closedby` attribute. Default: `"any"`. */
  closedby?: DialogClosedBy;
}

/**
 * The bare `<dialog>` primitive — for layouts the default `<Dialog>` doesn't fit.
 * A `Dialog.Title` / `Dialog.Description` inside names and describes it unless
 * `aria-label`, `aria-labelledby` or `aria-describedby` is passed.
 */
function DialogContainer({
  open,
  onOpenChange,
  size = "md",
  closedby = "any",
  className,
  children,
  ref: consumerRef,
  "aria-labelledby": labelledBy,
  "aria-describedby": describedBy,
  ...rest
}: DialogContainerProps) {
  const { setRef, ctx, ref, titleId, descriptionId } = useDialogElement(
    open,
    onOpenChange,
    consumerRef,
  );

  return (
    <DialogContext.Provider value={ctx}>
      <PortalContainerContext.Provider value={ref}>
        <dialog
          ref={setRef}
          className={cn(["dialog", size !== "md" && `dialog-${size}`], className)}
          closedby={closedby}
          aria-labelledby={labelledBy ?? (rest["aria-label"] === undefined ? titleId : undefined)}
          aria-describedby={describedBy ?? descriptionId}
          {...rest}
        >
          {children}
        </dialog>
      </PortalContainerContext.Provider>
    </DialogContext.Provider>
  );
}

export type DialogHeaderProps = ComponentProps<"div">;

function DialogHeader({ className, ...rest }: DialogHeaderProps) {
  return <div className={cn("dialog-header", className)} {...rest} />;
}

export interface DialogTitleProps extends ComponentProps<"h2"> {
  /** Leading icon. */
  icon?: IconProp;
}

function DialogTitle({ icon, id, className, children, ...rest }: DialogTitleProps) {
  const resolvedId = useDialogLabelId("title", id);
  return (
    <h2 id={resolvedId} className={cn("dialog-title", className)} {...rest}>
      {renderIcon(icon)}
      {children}
    </h2>
  );
}

export type DialogDescriptionProps = ComponentProps<"p">;

function DialogDescription({ id, className, ...rest }: DialogDescriptionProps) {
  const resolvedId = useDialogLabelId("description", id);
  return <p id={resolvedId} className={cn("dialog-description", className)} {...rest} />;
}

export type DialogBodyProps = ComponentProps<"div">;

function DialogBody({ className, ...rest }: DialogBodyProps) {
  return <div className={cn("dialog-body", className)} {...rest} />;
}

export type DialogFooterProps = ComponentProps<"div">;

function DialogFooter({ className, ...rest }: DialogFooterProps) {
  return <div className={cn("dialog-footer", className)} {...rest} />;
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
      className={cn("dialog-close", className)}
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
  /** Per-slot class overrides. `className` targets the root; these target inner slots. */
  classNames?: SlotClasses<"header" | "title" | "close" | "description" | "body" | "footer">;
  children?: ReactNode;
}

/**
 * Standard modal with shorthand-driven header/body/footer; an empty slot
 * (`null`, `false`, `""`) renders nothing. The title names the dialog and the
 * description describes it. For other shapes, compose `<Dialog.Container>` by hand.
 */
function DialogRoot({
  icon,
  title,
  description,
  actions,
  dismissible = true,
  closeLabel = "Close",
  classNames,
  children,
  ...containerProps
}: DialogProps) {
  const hasTitle = hasSlot(title) || icon != null;
  const showHeader = hasTitle || dismissible;
  return (
    <DialogContainer {...containerProps}>
      {showHeader ? (
        <DialogHeader className={classNames?.header}>
          {hasTitle ? (
            <DialogTitle icon={icon} className={classNames?.title}>
              {title}
            </DialogTitle>
          ) : null}
          {dismissible ? (
            <DialogCloseButton aria-label={closeLabel} className={classNames?.close} />
          ) : null}
        </DialogHeader>
      ) : null}
      {hasSlot(description) ? (
        <DialogDescription className={classNames?.description}>{description}</DialogDescription>
      ) : null}
      {hasSlot(children) ? <DialogBody className={classNames?.body}>{children}</DialogBody> : null}
      {hasSlot(actions) ? (
        <DialogFooter className={classNames?.footer}>{actions}</DialogFooter>
      ) : null}
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
