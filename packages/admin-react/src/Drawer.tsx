import type { ComponentProps, ReactNode } from "react";
import { cn, type SlotClasses } from "./cn";
import { Dialog, type DialogClosedBy } from "./Dialog";
import { DialogContext, useDialogElement } from "./dialog-internal";
import { type IconProp } from "./icon";
import { PortalContainerContext } from "./portal-context";
import { hasNode } from "./slot";

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

/**
 * The bare edge-anchored `<dialog>` primitive — for layouts the default `<Drawer>`
 * doesn't fit. Named and described by its `Drawer.Title` / `Drawer.Description`
 * unless `aria-label`, `aria-labelledby` or `aria-describedby` is passed.
 */
function DrawerContainer({
  open,
  onOpenChange,
  side = "end",
  size = "md",
  closedby = "any",
  className,
  children,
  ref: consumerRef,
  "aria-labelledby": labelledBy,
  "aria-describedby": describedBy,
  ...rest
}: DrawerContainerProps) {
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

export interface DrawerProps extends Omit<DrawerContainerProps, "title" | "children"> {
  /** Leading icon for the title row; ignored without a `title`. */
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

/**
 * Edge-anchored panel with shorthand-driven header/body/footer; an empty slot
 * (`null`, `false`, `""`) renders nothing. For other shapes, compose `<Drawer.Container>`.
 */
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
  // An icon alone would be an empty heading naming the drawer, so the title row needs a title.
  const hasTitle = hasNode(title);
  const showHeader = hasTitle || dismissible;
  return (
    <DrawerContainer {...containerProps}>
      {showHeader ? (
        <Dialog.Header className={classNames?.header}>
          {hasTitle ? (
            <Dialog.Title icon={icon} className={classNames?.title}>
              {title}
            </Dialog.Title>
          ) : null}
          {dismissible ? (
            <Dialog.CloseButton aria-label={closeLabel} className={classNames?.close} />
          ) : null}
        </Dialog.Header>
      ) : null}
      {hasNode(description) ? (
        <Dialog.Description className={classNames?.description}>{description}</Dialog.Description>
      ) : null}
      {hasNode(children) ? (
        <Dialog.Body className={classNames?.body}>{children}</Dialog.Body>
      ) : null}
      {hasNode(actions) ? (
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
