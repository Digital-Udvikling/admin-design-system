import type { ComponentProps, ReactNode } from "react";
import { cn, type SlotClasses } from "./cn";
import { Dialog, type DialogClosedBy } from "./Dialog";
import { DialogContext, useDialogElement } from "./dialog-internal";
import { type IconProp } from "./icon";
import { PortalContainerContext } from "./portal-context";

export type DrawerSide = "start" | "end" | "bottom";
export type DrawerSize = "sm" | "md" | "lg";

export interface DrawerContainerProps extends Omit<ComponentProps<"dialog">, "open"> {
  /** Controlled open state. Omit for uncontrolled (e.g. Invoker Commands). */
  open?: boolean;
  /** Fires when the drawer closes (Esc, backdrop, close button, form method="dialog"). */
  onOpenChange?: (open: boolean) => void;
  /** Which edge the panel anchors to. Default `"end"`. */
  side?: DrawerSide;
  /** Cross-axis extent. Default `"md"`. */
  size?: DrawerSize;
  /** Native `closedby` attribute. Default `"any"`. */
  closedby?: DialogClosedBy;
}

/** The bare edge-anchored `<dialog>` primitive — for layouts the default `<Drawer>` doesn't fit. */
function DrawerContainer({
  open,
  onOpenChange,
  side = "end",
  size = "md",
  closedby = "any",
  className,
  children,
  ref: consumerRef,
  ...rest
}: DrawerContainerProps) {
  const { setRef, ctx, ref } = useDialogElement(open, onOpenChange, consumerRef);
  return (
    <DialogContext.Provider value={ctx}>
      <PortalContainerContext.Provider value={ref}>
        <dialog
          ref={setRef}
          className={cn(
            [
              "dialog",
              "drawer",
              side !== "end" && `drawer-${side}`,
              size !== "md" && `drawer-${size}`,
            ],
            className,
          )}
          closedby={closedby}
          {...rest}
        >
          {children}
        </dialog>
      </PortalContainerContext.Provider>
    </DialogContext.Provider>
  );
}

export interface DrawerProps extends Omit<DrawerContainerProps, "title" | "children"> {
  /** Leading icon for the title row. */
  icon?: IconProp;
  /** Renders as `<Drawer.Title>`. */
  title?: ReactNode;
  /** Renders as `<Drawer.Description>`. */
  description?: ReactNode;
  /** Renders as `<Drawer.Footer>`. */
  actions?: ReactNode;
  /** Show the X close button in the header. Default `true`. */
  dismissible?: boolean;
  /** aria-label for the close button. Default `"Close"`. */
  closeLabel?: string;
  /** Per-slot class overrides. `className` targets the root; these target inner slots. */
  classNames?: SlotClasses<"header" | "title" | "close" | "description" | "body" | "footer">;
  children?: ReactNode;
}

/** Edge-anchored panel with shorthand-driven header/body/footer. For other shapes, compose `<Drawer.Container>`. */
function DrawerRoot({
  icon,
  title,
  description,
  actions,
  dismissible = true,
  closeLabel = "Close",
  classNames,
  children,
  ...containerProps
}: DrawerProps) {
  const hasTitle = title !== undefined || icon !== undefined;
  const showHeader = hasTitle || dismissible;
  return (
    <DrawerContainer {...containerProps}>
      {showHeader ? (
        <Dialog.Header className={classNames?.header}>
          {hasTitle ? (
            <Dialog.Title icon={icon} className={classNames?.title}>
              {title}
            </Dialog.Title>
          ) : (
            <span className={cn("flex-1", undefined)} />
          )}
          {dismissible ? (
            <Dialog.CloseButton aria-label={closeLabel} className={classNames?.close} />
          ) : null}
        </Dialog.Header>
      ) : null}
      {description !== undefined ? (
        <Dialog.Description className={classNames?.description}>{description}</Dialog.Description>
      ) : null}
      {children !== undefined ? (
        <Dialog.Body className={classNames?.body}>{children}</Dialog.Body>
      ) : null}
      {actions !== undefined ? (
        <Dialog.Footer className={classNames?.footer}>{actions}</Dialog.Footer>
      ) : null}
    </DrawerContainer>
  );
}

/** Shares the Dialog header/body/footer subparts; only the container differs. */
export const Drawer = Object.assign(DrawerRoot, {
  Container: DrawerContainer,
  Header: Dialog.Header,
  Title: Dialog.Title,
  Description: Dialog.Description,
  Body: Dialog.Body,
  Footer: Dialog.Footer,
  CloseButton: Dialog.CloseButton,
});
