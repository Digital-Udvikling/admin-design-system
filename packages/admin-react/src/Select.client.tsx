"use client";

import { Select as BaseSelect } from "@base-ui/react/select";
import { useContext } from "react";
import { cn } from "./cn";
import { PortalContainerContext } from "./portal-context";
import type { SelectPopupProps } from "./Select";

export function SelectPopup({
  className,
  side,
  align = "start",
  sideOffset = 4,
  alignOffset,
  children,
  ...rest
}: SelectPopupProps) {
  const portalContainer = useContext(PortalContainerContext);
  return (
    <BaseSelect.Portal container={portalContainer ?? undefined}>
      {/* Opt out of Base UI's macOS-style alignment (selected item overlaid on
          the trigger): admin surfaces expect below-the-trigger placement, and
          the macOS mode collapses the parent dialog's flex layout in <Dialog>. */}
      <BaseSelect.Positioner
        className={cn("popup-layer", undefined)}
        side={side}
        align={align}
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        alignItemWithTrigger={false}
      >
        <BaseSelect.Popup className={cn("select-popup", className)} {...rest}>
          {children}
        </BaseSelect.Popup>
      </BaseSelect.Positioner>
    </BaseSelect.Portal>
  );
}
