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
      {/* No macOS-style overlay alignment: it collapses the flex layout of a parent <Dialog>. */}
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
