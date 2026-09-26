"use client";

import { cn } from "./cn";
import { DialogContext, useDialogElement } from "./dialog-internal";
import type { DrawerContainerProps } from "./Drawer";
import { PortalContainerContext } from "./portal-context";

/**
 * The bare edge-anchored `<dialog>` primitive — for layouts the default `<Drawer>`
 * doesn't fit. Named and described by its `Drawer.Title` / `Drawer.Description`
 * unless `aria-label`, `aria-labelledby` or `aria-describedby` is passed.
 */
export function DrawerContainer({
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
