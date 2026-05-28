import { Tooltip as BaseTooltip } from "@base-ui/react/tooltip";
import { useContext, type ComponentProps, type ReactElement, type ReactNode } from "react";
import { cn } from "./cn";
import { PortalContainerContext } from "./portal-context";

export type TooltipProviderProps = ComponentProps<typeof BaseTooltip.Provider>;

function TooltipProvider(props: TooltipProviderProps) {
  return <BaseTooltip.Provider {...props} />;
}

export type TooltipRootProps = ComponentProps<typeof BaseTooltip.Root>;

function TooltipRoot(props: TooltipRootProps) {
  return <BaseTooltip.Root {...props} />;
}

export type TooltipTriggerProps = ComponentProps<typeof BaseTooltip.Trigger>;

function TooltipTrigger(props: TooltipTriggerProps) {
  return <BaseTooltip.Trigger {...props} />;
}

export type TooltipSize = "sm" | "md";

type TooltipPositionerProps = ComponentProps<typeof BaseTooltip.Positioner>;

export interface TooltipPopupProps extends ComponentProps<typeof BaseTooltip.Popup> {
  size?: TooltipSize;
  side?: TooltipPositionerProps["side"];
  align?: TooltipPositionerProps["align"];
  sideOffset?: TooltipPositionerProps["sideOffset"];
}

function TooltipPopup({
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
      <BaseTooltip.Positioner sideOffset={sideOffset} side={side} align={align}>
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

export interface TooltipProps extends Omit<TooltipRootProps, "children"> {
  /** Tooltip body — string or rich node. */
  content: ReactNode;
  side?: TooltipPopupProps["side"];
  align?: TooltipPopupProps["align"];
  sideOffset?: TooltipPopupProps["sideOffset"];
  size?: TooltipSize;
  /** The trigger element. Must be a single React element so Base UI can merge trigger props/refs into it. */
  children: ReactElement;
}

function TooltipShorthand({
  content,
  side,
  align,
  sideOffset,
  size,
  children,
  ...rootProps
}: TooltipProps) {
  return (
    <TooltipRoot {...rootProps}>
      <BaseTooltip.Trigger render={children} />
      <TooltipPopup side={side} align={align} sideOffset={sideOffset} size={size}>
        {content}
      </TooltipPopup>
    </TooltipRoot>
  );
}

export const Tooltip = Object.assign(TooltipShorthand, {
  Provider: TooltipProvider,
  Root: TooltipRoot,
  Trigger: TooltipTrigger,
  Popup: TooltipPopup,
});
