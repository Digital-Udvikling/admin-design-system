"use client";

import { Tooltip as BaseTooltip } from "@base-ui/react/tooltip";
import { useContext } from "react";
import { cn } from "./cn";
import { PortalContainerContext } from "./portal-context";
import type { TooltipPopupProps } from "./Tooltip";

export function TooltipPopup({
  size = "md",
  side = "top",
  align = "center",
  sideOffset = 6,
  role = "tooltip",
  className,
  children,
  ...rest
}: TooltipPopupProps) {
  const portalContainer = useContext(PortalContainerContext);
  return (
    <BaseTooltip.Portal container={portalContainer ?? undefined}>
      <BaseTooltip.Positioner
        className={cn("popup-layer", undefined)}
        sideOffset={sideOffset}
        side={side}
        align={align}
      >
        <BaseTooltip.Popup
          role={role}
          className={cn(["tooltip", size !== "md" && `tooltip-${size}`], className)}
          {...rest}
        >
          {children}
        </BaseTooltip.Popup>
      </BaseTooltip.Positioner>
    </BaseTooltip.Portal>
  );
}
