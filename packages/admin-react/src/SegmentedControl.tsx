import {
  createContext,
  useContext,
  useId,
  useState,
  type ChangeEvent,
  type ComponentProps,
  type ReactNode,
} from "react";
import { cn } from "./cn";
import { renderIcon, type IconProp } from "./icon";

export type SegmentedControlSize = "sm" | "md";
export type SegmentedControlType = "single" | "multiple";

interface SegmentedControlContextValue {
  type: SegmentedControlType;
  name: string;
  isChecked: (value: string) => boolean;
  onItemChange: (value: string, checked: boolean) => void;
}

const SegmentedControlContext = createContext<SegmentedControlContextValue | null>(null);

function useSegmentedControl(): SegmentedControlContextValue {
  const ctx = useContext(SegmentedControlContext);
  if (ctx === null) {
    throw new Error("<SegmentedControl.Item> must be rendered inside <SegmentedControl>");
  }
  return ctx;
}

type FieldsetProps = Omit<
  ComponentProps<"fieldset">,
  "onChange" | "defaultValue" | "children" | "className"
>;

interface SegmentedControlBaseProps extends FieldsetProps {
  /** Renders as the fieldset's `<legend>` — the group's accessible name. */
  label: ReactNode;
  /**
   * Native form name. Required for radios to be mutually exclusive when the
   * surrounding form is submitted; if omitted, a generated id keeps grouping
   * working inside the component but the inputs won't carry a stable name.
   */
  name?: string;
  /** `md` is the default; `sm` is for dense filter bars. */
  size?: SegmentedControlSize;
  /** Stretch the track to fill its container; segments get equal share. */
  fullWidth?: boolean;
  /** Disables every segment via the native `disabled` on the fieldset. */
  disabled?: boolean;
  className?: string;
  children?: ReactNode;
}

export interface SingleSegmentedControlProps extends SegmentedControlBaseProps {
  type: "single";
  /** Controlled value. */
  value?: string;
  /** Initial value for uncontrolled use. */
  defaultValue?: string;
  /** Called with the newly-selected value. */
  onValueChange?: (value: string) => void;
}

export interface MultipleSegmentedControlProps extends SegmentedControlBaseProps {
  type: "multiple";
  /** Controlled value. */
  value?: string[];
  /** Initial value for uncontrolled use. */
  defaultValue?: string[];
  /** Called with the new set of selected values. */
  onValueChange?: (value: string[]) => void;
}

export type SegmentedControlProps = SingleSegmentedControlProps | MultipleSegmentedControlProps;

function SegmentedControlRoot(props: SegmentedControlProps) {
  const {
    label,
    name: nameProp,
    size = "md",
    fullWidth = false,
    disabled,
    className,
    children,
    ...rest
  } = props;

  const generatedName = useId();
  const name = nameProp ?? generatedName;

  const isControlled = props.value !== undefined;
  const [internalValue, setInternalValue] = useState<string | string[] | undefined>(
    props.defaultValue,
  );
  const currentValue = isControlled ? props.value : internalValue;

  const isChecked = (itemValue: string): boolean => {
    if (props.type === "single") {
      return currentValue === itemValue;
    }
    return Array.isArray(currentValue) && currentValue.includes(itemValue);
  };

  const onItemChange = (itemValue: string, checked: boolean): void => {
    if (props.type === "single") {
      if (!isControlled) setInternalValue(itemValue);
      props.onValueChange?.(itemValue);
    } else {
      const list = Array.isArray(currentValue) ? currentValue : [];
      const next = checked ? [...list, itemValue] : list.filter((v) => v !== itemValue);
      if (!isControlled) setInternalValue(next);
      props.onValueChange?.(next);
    }
  };

  return (
    <fieldset
      disabled={disabled}
      className={cn(
        [
          "segmented-control",
          size !== "md" && `segmented-control-${size}`,
          fullWidth && "segmented-control-full-width",
        ],
        className,
      )}
      {...rest}
    >
      <legend>{label}</legend>
      <SegmentedControlContext.Provider value={{ type: props.type, name, isChecked, onItemChange }}>
        <div className={cn("segmented-control-track", undefined)}>{children}</div>
      </SegmentedControlContext.Provider>
    </fieldset>
  );
}

type LabelProps = Omit<ComponentProps<"label">, "onChange" | "children">;

export interface SegmentedControlItemProps extends LabelProps {
  /** Submitted value when this segment is selected. */
  value: string;
  /** Leading icon. Pass a component (`icon={IconThumbUp}`) or an element. */
  icon?: IconProp;
  /** Disables just this segment. */
  disabled?: boolean;
  children?: ReactNode;
}

function SegmentedControlItem({
  value,
  icon,
  disabled,
  children,
  className,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  ...rest
}: SegmentedControlItemProps) {
  const { type, name, isChecked, onItemChange } = useSegmentedControl();
  const checked = isChecked(value);

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    onItemChange(value, event.target.checked);
  };

  return (
    <label className={cn("segmented-control-item", className)} {...rest}>
      <input
        type={type === "single" ? "radio" : "checkbox"}
        name={name}
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={handleChange}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
      />
      {renderIcon(icon)}
      {children !== undefined && children !== null && <span>{children}</span>}
    </label>
  );
}

export const SegmentedControl = Object.assign(SegmentedControlRoot, {
  Item: SegmentedControlItem,
});
