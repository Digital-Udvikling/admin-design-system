import { Select as BaseSelect } from "@base-ui/react/select";
import type { ComponentProps } from "react";
import { cn } from "./cn";
import { renderIcon, type IconProp } from "./icon";
import { SelectPopup } from "./Select.client";

/**
 * `Value` is inferred from `value`, `defaultValue` or `onValueChange`, so the handler receives the
 * item type (`Value[]` with `multiple`). Pass it explicitly (`<Select<Status>>`) when nothing infers it.
 */
export type SelectProps<
  Value = unknown,
  Multiple extends boolean | undefined = false,
> = BaseSelect.Root.Props<Value, Multiple>;

function SelectRoot<Value, Multiple extends boolean | undefined = false>(
  props: SelectProps<Value, Multiple>,
) {
  return <BaseSelect.Root {...props} />;
}

export type SelectTriggerVariant = "bordered" | "ghost" | "danger";
export type SelectTriggerSize = "sm" | "md" | "lg";

type BaseSelectTriggerProps = Omit<ComponentProps<typeof BaseSelect.Trigger>, "size">;

export interface SelectTriggerProps extends BaseSelectTriggerProps {
  variant?: SelectTriggerVariant;
  /** Default `"md"`. */
  size?: SelectTriggerSize;
  /** Leading icon, rendered before `children`. */
  icon?: IconProp;
}

function SelectTrigger({
  variant = "bordered",
  size = "md",
  icon,
  className,
  children,
  ...rest
}: SelectTriggerProps) {
  return (
    <BaseSelect.Trigger
      className={cn(
        [
          "select",
          variant !== "bordered" && `select-${variant}`,
          size !== "md" && `select-${size}`,
        ],
        className,
      )}
      {...rest}
    >
      {renderIcon(icon)}
      {children}
    </BaseSelect.Trigger>
  );
}

export type SelectValueProps = ComponentProps<typeof BaseSelect.Value>;

function SelectValue({ className, ...rest }: SelectValueProps) {
  return <BaseSelect.Value className={cn("select-value", className)} {...rest} />;
}

export type SelectIconProps = ComponentProps<typeof BaseSelect.Icon>;

function SelectIcon({ className, children, ...rest }: SelectIconProps) {
  return (
    <BaseSelect.Icon className={cn("select-icon", className)} {...rest}>
      {children ?? <ChevronDownIcon />}
    </BaseSelect.Icon>
  );
}

type SelectPositionerProps = ComponentProps<typeof BaseSelect.Positioner>;

export interface SelectPopupProps extends ComponentProps<typeof BaseSelect.Popup> {
  side?: SelectPositionerProps["side"];
  align?: SelectPositionerProps["align"];
  sideOffset?: number;
  alignOffset?: SelectPositionerProps["alignOffset"];
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
