"use client";

import { Combobox as BaseCombobox } from "@base-ui/react/combobox";
import { useContext } from "react";
import { cn } from "./cn";
import type { ComboboxPopupProps } from "./Combobox";
import { PortalContainerContext } from "./portal-context";

export function ComboboxPopup({
  className,
  side,
  align = "start",
  sideOffset = 4,
  alignOffset,
  children,
  ...rest
}: ComboboxPopupProps) {
  const portalContainer = useContext(PortalContainerContext);
  return (
    <BaseCombobox.Portal container={portalContainer ?? undefined}>
      <BaseCombobox.Positioner
        className={cn("popup-layer", undefined)}
        side={side}
        align={align}
        sideOffset={sideOffset}
        alignOffset={alignOffset}
      >
        <BaseCombobox.Popup className={cn("combobox-popup", className)} {...rest}>
          {children}
        </BaseCombobox.Popup>
      </BaseCombobox.Positioner>
    </BaseCombobox.Portal>
  );
}
