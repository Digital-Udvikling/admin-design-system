"use client";

import { useContext, type ComponentProps } from "react";
import { cn } from "./cn";
import type { DialogContainerProps, DialogDescriptionProps } from "./Dialog";
import { DialogContext, useDialogElement, useDialogLabelId } from "./dialog-internal";
import { PortalContainerContext } from "./portal-context";

/**
 * The bare `<dialog>` primitive — for layouts the default `<Dialog>` doesn't fit.
 * A `Dialog.Title` / `Dialog.Description` inside names and describes it unless
 * `aria-label`, `aria-labelledby` or `aria-describedby` is passed.
 */
export function DialogContainer({
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
    closedby,
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

/** `Dialog.Title` with its icon pre-rendered by Dialog.tsx, so Server Components can pass `icon={IconX}`. */
export function DialogTitleBase({ id, className, children, ...rest }: ComponentProps<"h2">) {
  const resolvedId = useDialogLabelId("title", id);
  return (
    <h2 id={resolvedId} className={cn("dialog-title", className)} {...rest}>
      {children}
    </h2>
  );
}

export function DialogDescription({ id, className, ...rest }: DialogDescriptionProps) {
  const resolvedId = useDialogLabelId("description", id);
  return <p id={resolvedId} className={cn("dialog-description", className)} {...rest} />;
}

/** `Dialog.CloseButton` with its content pre-rendered by Dialog.tsx, so Server Components can pass `icon={IconX}`. */
export function DialogCloseButtonBase({
  className,
  onClick,
  type = "button",
  "aria-label": ariaLabel = "Close",
  ...rest
}: ComponentProps<"button">) {
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
    />
  );
}
