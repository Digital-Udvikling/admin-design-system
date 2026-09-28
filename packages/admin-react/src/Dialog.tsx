import type { ComponentProps, ReactNode } from "react";
import { cn, type SlotClasses } from "./cn";
import {
  DialogCloseButtonBase,
  DialogContainer,
  DialogDescription,
  DialogTitleBase,
} from "./Dialog.client";
import { renderIcon, type IconProp } from "./icon";
import { hasNode } from "./slot";

export type DialogSize = "sm" | "md" | "lg" | "auto" | "metabase";
export type DialogClosedBy = "any" | "closerequest" | "none";

function DefaultCloseIcon() {
  return (
    <svg
      width="1em"
      height="1em"
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

export type DialogHeaderProps = ComponentProps<"div">;

function DialogHeader({ className, ...rest }: DialogHeaderProps) {
  return <div className={cn("dialog-header", className)} {...rest} />;
}

export interface DialogTitleProps extends ComponentProps<"h2"> {
  /** Leading icon. */
  icon?: IconProp;
}

function DialogTitle({ icon, children, ...rest }: DialogTitleProps) {
  return (
    <DialogTitleBase {...rest}>
      {renderIcon(icon)}
      {children}
    </DialogTitleBase>
  );
}

export type DialogDescriptionProps = ComponentProps<"p">;

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

function DialogCloseButton({ icon, children, ...rest }: DialogCloseButtonProps) {
  return (
    <DialogCloseButtonBase {...rest}>
      {children ?? (icon !== undefined ? renderIcon(icon) : <DefaultCloseIcon />)}
    </DialogCloseButtonBase>
  );
}

export interface DialogProps extends Omit<DialogContainerProps, "title" | "children"> {
  /** Leading icon for the title row; ignored without a `title`. */
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
 * (`null`, `false`, `""`) renders nothing. For other shapes, compose `<Dialog.Container>` by hand.
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
  // An icon alone would be an empty heading naming the dialog, so the title row needs a title.
  const hasTitle = hasNode(title);
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
      {hasNode(description) ? (
        <DialogDescription className={classNames?.description}>{description}</DialogDescription>
      ) : null}
      {hasNode(children) ? <DialogBody className={classNames?.body}>{children}</DialogBody> : null}
      {hasNode(actions) ? (
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
