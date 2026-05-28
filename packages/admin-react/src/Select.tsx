import { Select as BaseSelect } from "@base-ui/react/select";
import { useContext, type ComponentProps } from "react";
import { cn } from "./cn";
import { PortalContainerContext } from "./portal-context";

export type SelectProps = ComponentProps<typeof BaseSelect.Root>;

function SelectRoot(props: SelectProps) {
  return <BaseSelect.Root {...props} />;
}

export type SelectTriggerVariant = "bordered" | "ghost" | "danger";
export type SelectTriggerSize = "sm" | "md" | "lg";

type BaseSelectTriggerProps = Omit<ComponentProps<typeof BaseSelect.Trigger>, "size">;

export interface SelectTriggerProps extends BaseSelectTriggerProps {
  variant?: SelectTriggerVariant;
  triggerSize?: SelectTriggerSize;
}

function SelectTrigger({
  variant = "bordered",
  triggerSize = "md",
  className,
  ...rest
}: SelectTriggerProps) {
  return (
    <BaseSelect.Trigger
      className={cn(
        [
          "select",
          variant !== "bordered" && `select-${variant}`,
          triggerSize !== "md" && `select-${triggerSize}`,
        ],
        className,
      )}
      {...rest}
    />
  );
}

export type SelectValueProps = ComponentProps<typeof BaseSelect.Value>;

function SelectValue(props: SelectValueProps) {
  return <BaseSelect.Value {...props} />;
}

export type SelectIconProps = ComponentProps<typeof BaseSelect.Icon>;

function SelectIcon({ className, children, ...rest }: SelectIconProps) {
  return (
    <BaseSelect.Icon className={cn("select-icon", className)} {...rest}>
      {children ?? <ChevronDownIcon />}
    </BaseSelect.Icon>
  );
}

export interface SelectPopupProps extends ComponentProps<typeof BaseSelect.Popup> {
  sideOffset?: number;
}

function SelectPopup({ className, sideOffset = 4, children, ...rest }: SelectPopupProps) {
  const portalContainer = useContext(PortalContainerContext);
  return (
    <BaseSelect.Portal container={portalContainer ?? undefined}>
      {/*
       * `alignItemWithTrigger={false}` opts out of Base UI's macOS-style
       * alignment (selected item overlaid on the trigger, popup expanding
       * both directions). Standard web dropdown placement — below the
       * trigger — is what readers expect on admin surfaces, and the macOS
       * mode collapses the parent dialog's flex layout when used inside
       * `<Dialog>`.
       */}
      <BaseSelect.Positioner sideOffset={sideOffset} alignItemWithTrigger={false}>
        <BaseSelect.Popup className={cn("select-popup", className)} {...rest}>
          {children}
        </BaseSelect.Popup>
      </BaseSelect.Positioner>
    </BaseSelect.Portal>
  );
}

export type SelectItemProps = ComponentProps<typeof BaseSelect.Item>;

function SelectItem({ className, ...rest }: SelectItemProps) {
  return <BaseSelect.Item className={cn("select-item", className)} {...rest} />;
}

export type SelectItemTextProps = ComponentProps<typeof BaseSelect.ItemText>;

function SelectItemText(props: SelectItemTextProps) {
  return <BaseSelect.ItemText {...props} />;
}

export type SelectItemIndicatorProps = ComponentProps<typeof BaseSelect.ItemIndicator>;

function SelectItemIndicator({ className, children, ...rest }: SelectItemIndicatorProps) {
  return (
    <BaseSelect.ItemIndicator className={cn("select-item-indicator", className)} {...rest}>
      {children ?? <CheckIcon />}
    </BaseSelect.ItemIndicator>
  );
}

export type SelectGroupProps = ComponentProps<typeof BaseSelect.Group>;

function SelectGroup(props: SelectGroupProps) {
  return <BaseSelect.Group {...props} />;
}

export type SelectGroupLabelProps = ComponentProps<typeof BaseSelect.GroupLabel>;

function SelectGroupLabel({ className, ...rest }: SelectGroupLabelProps) {
  return <BaseSelect.GroupLabel className={cn("select-group-label", className)} {...rest} />;
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      width="100%"
      height="100%"
      aria-hidden
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      width="100%"
      height="100%"
      aria-hidden
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

export const Select = Object.assign(SelectRoot, {
  Trigger: SelectTrigger,
  Value: SelectValue,
  Icon: SelectIcon,
  Popup: SelectPopup,
  Item: SelectItem,
  ItemText: SelectItemText,
  ItemIndicator: SelectItemIndicator,
  Group: SelectGroup,
  GroupLabel: SelectGroupLabel,
});
