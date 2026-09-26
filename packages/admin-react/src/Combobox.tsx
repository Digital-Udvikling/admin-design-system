import { Combobox as BaseCombobox } from "@base-ui/react/combobox";
import type { ComponentProps } from "react";
import { cn } from "./cn";
import { ComboboxPopup } from "./Combobox.client";

/**
 * `Value` is inferred from `value`, `defaultValue` or `onValueChange` (`Value[]` with `multiple`).
 * `items` doesn't carry the type, so pass it explicitly (`<Combobox<Supplier>>`) when nothing else does.
 */
export type ComboboxProps<
  Value = unknown,
  Multiple extends boolean | undefined = false,
> = BaseCombobox.Root.Props<Value, Multiple>;

function ComboboxRoot<Value, Multiple extends boolean | undefined = false>(
  props: ComboboxProps<Value, Multiple>,
) {
  return <BaseCombobox.Root {...props} />;
}

export type ComboboxControlVariant = "bordered" | "ghost";
export type ComboboxControlSize = "sm" | "md" | "lg";

export interface ComboboxControlProps extends ComponentProps<typeof BaseCombobox.InputGroup> {
  variant?: ComboboxControlVariant;
  /** Default `"md"`. */
  size?: ComboboxControlSize;
}

/** The bordered box around the input, chips and buttons; the popup anchors to it. */
function ComboboxControl({
  variant = "bordered",
  size = "md",
  className,
  ...rest
}: ComboboxControlProps) {
  return (
    <BaseCombobox.InputGroup
      className={cn(
        [
          "combobox",
          variant !== "bordered" && `combobox-${variant}`,
          size !== "md" && `combobox-${size}`,
        ],
        className,
      )}
      {...rest}
    />
  );
}

export type ComboboxInputProps = ComponentProps<typeof BaseCombobox.Input>;

function ComboboxInput({ className, ...rest }: ComboboxInputProps) {
  return <BaseCombobox.Input className={cn("combobox-input", className)} {...rest} />;
}

export type ComboboxTriggerProps = ComponentProps<typeof BaseCombobox.Trigger>;

/** Named by a surrounding Field's label; `aria-label` (default `"Show options"`) names it without one. */
function ComboboxTrigger({
  className,
  children,
  "aria-label": ariaLabel = "Show options",
  ...rest
}: ComboboxTriggerProps) {
  return (
    <BaseCombobox.Trigger
      className={cn("combobox-trigger", className)}
      aria-label={ariaLabel}
      {...rest}
    >
      {children ?? <ChevronDownIcon />}
    </BaseCombobox.Trigger>
  );
}

export type ComboboxClearProps = ComponentProps<typeof BaseCombobox.Clear>;

function ComboboxClear({
  className,
  children,
  "aria-label": ariaLabel = "Clear",
  ...rest
}: ComboboxClearProps) {
  return (
    <BaseCombobox.Clear
      className={cn("combobox-clear", className)}
      aria-label={ariaLabel}
      {...rest}
    >
      {children ?? <XIcon />}
    </BaseCombobox.Clear>
  );
}

export type ComboboxValueProps = ComponentProps<typeof BaseCombobox.Value>;

function ComboboxValue(props: ComboboxValueProps) {
  return <BaseCombobox.Value {...props} />;
}

export type ComboboxChipsProps = ComponentProps<typeof BaseCombobox.Chips>;

function ComboboxChips({ className, ...rest }: ComboboxChipsProps) {
  return <BaseCombobox.Chips className={cn("combobox-chips", className)} {...rest} />;
}

export type ComboboxChipProps = ComponentProps<typeof BaseCombobox.Chip>;

/** A selected value in a `multiple` combobox, drawn as a neutral `.badge`. */
function ComboboxChip({ className, ...rest }: ComboboxChipProps) {
  return <BaseCombobox.Chip className={cn(["badge", "combobox-chip"], className)} {...rest} />;
}

export type ComboboxChipRemoveProps = ComponentProps<typeof BaseCombobox.ChipRemove>;

/** Name it after the value (`aria-label="Remove Oslo"`); the default `"Remove"` doesn't say which. */
function ComboboxChipRemove({
  className,
  children,
  "aria-label": ariaLabel = "Remove",
  ...rest
}: ComboboxChipRemoveProps) {
  return (
    <BaseCombobox.ChipRemove
      className={cn("badge-remove", className)}
      aria-label={ariaLabel}
      {...rest}
    >
      {children ?? <XIcon />}
    </BaseCombobox.ChipRemove>
  );
}

type ComboboxPositionerProps = ComponentProps<typeof BaseCombobox.Positioner>;

export interface ComboboxPopupProps extends ComponentProps<typeof BaseCombobox.Popup> {
  side?: ComboboxPositionerProps["side"];
  align?: ComboboxPositionerProps["align"];
  sideOffset?: number;
  alignOffset?: ComboboxPositionerProps["alignOffset"];
}

export type ComboboxListProps = ComponentProps<typeof BaseCombobox.List>;

function ComboboxList(props: ComboboxListProps) {
  return <BaseCombobox.List {...props} />;
}

export type ComboboxItemProps = ComponentProps<typeof BaseCombobox.Item>;

function ComboboxItem({ className, ...rest }: ComboboxItemProps) {
  return <BaseCombobox.Item className={cn("combobox-item", className)} {...rest} />;
}

export type ComboboxItemIndicatorProps = ComponentProps<typeof BaseCombobox.ItemIndicator>;

function ComboboxItemIndicator({ className, children, ...rest }: ComboboxItemIndicatorProps) {
  return (
    <BaseCombobox.ItemIndicator className={cn("combobox-item-indicator", className)} {...rest}>
      {children ?? <CheckIcon />}
    </BaseCombobox.ItemIndicator>
  );
}

export type ComboboxEmptyProps = ComponentProps<typeof BaseCombobox.Empty>;

/** Renders its children only while no item matches. */
function ComboboxEmpty({ className, ...rest }: ComboboxEmptyProps) {
  return <BaseCombobox.Empty className={cn("combobox-empty", className)} {...rest} />;
}

export type ComboboxStatusProps = ComponentProps<typeof BaseCombobox.Status>;

/** A polite live region for async states ("Searching…", "3 results"). */
function ComboboxStatus({ className, ...rest }: ComboboxStatusProps) {
  return <BaseCombobox.Status className={cn("combobox-status", className)} {...rest} />;
}

export type ComboboxGroupProps = ComponentProps<typeof BaseCombobox.Group>;

function ComboboxGroup(props: ComboboxGroupProps) {
  return <BaseCombobox.Group {...props} />;
}

export type ComboboxGroupLabelProps = ComponentProps<typeof BaseCombobox.GroupLabel>;

function ComboboxGroupLabel({ className, ...rest }: ComboboxGroupLabelProps) {
  return <BaseCombobox.GroupLabel className={cn("combobox-group-label", className)} {...rest} />;
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

function XIcon() {
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
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

export const Combobox = Object.assign(ComboboxRoot, {
  Control: ComboboxControl,
  Input: ComboboxInput,
  Trigger: ComboboxTrigger,
  Clear: ComboboxClear,
  Value: ComboboxValue,
  Chips: ComboboxChips,
  Chip: ComboboxChip,
  ChipRemove: ComboboxChipRemove,
  Popup: ComboboxPopup,
  List: ComboboxList,
  Item: ComboboxItem,
  ItemIndicator: ComboboxItemIndicator,
  Empty: ComboboxEmpty,
  Status: ComboboxStatus,
  Group: ComboboxGroup,
  GroupLabel: ComboboxGroupLabel,
});
