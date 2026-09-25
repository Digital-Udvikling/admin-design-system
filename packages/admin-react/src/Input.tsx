import { Input as BaseInput } from "@base-ui/react/input";
import { useCallback, useRef, useState, type ComponentProps, type ReactNode } from "react";
import { cn, type SlotClasses } from "./cn";
import { renderIcon, type IconProp } from "./icon";
import { hasNode } from "./slot";

export type InputVariant = "bordered" | "ghost" | "danger" | "info" | "success" | "warning";
export type InputSize = "sm" | "md" | "lg";

type BaseInputProps = Omit<ComponentProps<typeof BaseInput>, "size">;
// Base UI augments the native change event with `preventBaseUIHandler`; derive its
// exact type so the wrapper's handler and the consumer's `onChange` line up.
type InputChangeEvent = Parameters<NonNullable<BaseInputProps["onChange"]>>[0];

export interface InputProps extends BaseInputProps {
  variant?: InputVariant;
  inputSize?: InputSize;
  /** Leading icon, floated inside the field. Pass a component (`icon={IconSearch}`) or an element. */
  icon?: IconProp;
  /** Trailing icon, floated inside the field. Pass a component (`iconTrailing={IconX}`) or an element. */
  iconTrailing?: IconProp;
  /** Show a trailing clear (×) button while the field holds a value. */
  clearable?: boolean;
  /** aria-label for the clear button. Default `"Clear"`. */
  clearLabel?: string;
  /** Called after the clear button empties the field. */
  onClear?: () => void;
  /** Custom interactive trailing control, usually an `Input.Action`. Replaces the clear button and `iconTrailing`. */
  action?: ReactNode;
  /** Per-slot class overrides. `className` and `style` target the `<input>` even when wrapped; size a wrapped field with `wrapper`. */
  classNames?: SlotClasses<"wrapper" | "action">;
}

function ClearIcon() {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

export interface InputActionProps extends ComponentProps<"button"> {
  /** Glyph for the control. Pass a component (`icon={IconCopy}`) or an element. */
  icon?: IconProp;
}

/** `.input-action` button for `Input`'s `action` slot; `type` defaults to `"button"`. Needs an `aria-label`. */
function InputAction({ icon, type = "button", className, children, ...rest }: InputActionProps) {
  return (
    <button type={type} className={cn("input-action", className)} {...rest}>
      {renderIcon(icon)}
      {children}
    </button>
  );
}

function InputRoot({
  variant = "bordered",
  inputSize = "md",
  icon,
  iconTrailing,
  clearable = false,
  clearLabel = "Clear",
  onClear,
  action,
  className,
  classNames,
  type = "text",
  value,
  defaultValue,
  onChange,
  disabled,
  readOnly,
  ref: consumerRef,
  ...rest
}: InputProps) {
  const innerRef = useRef<HTMLInputElement | null>(null);
  const isControlled = value !== undefined;
  const [uncontrolledHasValue, setUncontrolledHasValue] = useState(
    () => defaultValue != null && String(defaultValue).length > 0,
  );
  const hasValue = isControlled ? value != null && String(value).length > 0 : uncontrolledHasValue;

  const setRef = useCallback(
    (node: HTMLInputElement | null) => {
      innerRef.current = node;
      if (typeof consumerRef === "function") consumerRef(node);
      else if (consumerRef) consumerRef.current = node;
    },
    [consumerRef],
  );

  function handleChange(event: InputChangeEvent) {
    if (!isControlled) setUncontrolledHasValue(event.target.value.length > 0);
    onChange?.(event);
  }

  function handleClear() {
    const input = innerRef.current;
    if (!input) return;
    // Native value setter + a dispatched input event so React (and form libraries) see a real change.
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
    setter?.call(input, "");
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.focus();
    if (!isControlled) setUncontrolledHasValue(false);
    onClear?.();
  }

  const showClear = clearable && hasValue && !disabled && !readOnly;

  const inputEl = (
    <BaseInput
      ref={setRef}
      type={type}
      value={value}
      defaultValue={defaultValue}
      onChange={handleChange}
      disabled={disabled}
      readOnly={readOnly}
      className={cn(
        [
          "input",
          variant !== "bordered" && `input-${variant}`,
          inputSize !== "md" && `input-${inputSize}`,
        ],
        className,
      )}
      {...rest}
    />
  );

  const hasAction = hasNode(action);

  // Clearable inputs always wrap (a stable tree) so the field doesn't remount —
  // and lose focus — when the clear button appears on the first keystroke.
  const wrap = icon != null || iconTrailing != null || hasAction || clearable;
  if (!wrap) return inputEl;

  let trailing: ReactNode = renderIcon(iconTrailing);
  if (hasAction) trailing = action;
  else if (showClear) {
    trailing = (
      <InputAction
        className={classNames?.action}
        aria-label={clearLabel}
        onClick={handleClear}
        icon={<ClearIcon />}
      />
    );
  }

  return (
    <span className={cn("input-icon", classNames?.wrapper)}>
      {renderIcon(icon)}
      {inputEl}
      {trailing}
    </span>
  );
}

export const Input = Object.assign(InputRoot, {
  Action: InputAction,
});

function EyeIcon() {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
      <path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M10.585 10.587a2 2 0 0 0 2.829 2.828" />
      <path d="M16.681 16.673a8.717 8.717 0 0 1 -4.681 1.327c-3.6 0 -6.6 -2 -9 -6c1.272 -2.12 2.712 -3.678 4.32 -4.674m2.86 -1.146a9.055 9.055 0 0 1 1.82 -.18c3.6 0 6.6 2 9 6c-.666 1.11 -1.379 2.067 -2.138 2.87" />
      <path d="M3 3l18 18" />
    </svg>
  );
}

export interface PasswordInputProps extends Omit<
  InputProps,
  "type" | "action" | "clearable" | "onClear" | "clearLabel"
> {
  /** aria-label for the reveal toggle. Default `"Show password"`. */
  revealLabel?: string;
}

/** Password field with a trailing reveal toggle. Emits the same `.input` / `.input-action` classes. */
export function PasswordInput({
  revealLabel = "Show password",
  classNames,
  ...rest
}: PasswordInputProps) {
  const [revealed, setRevealed] = useState(false);
  return (
    <Input
      type={revealed ? "text" : "password"}
      action={
        <InputAction
          className={classNames?.action}
          aria-label={revealLabel}
          aria-pressed={revealed}
          onClick={() => setRevealed((v) => !v)}
          icon={revealed ? <EyeOffIcon /> : <EyeIcon />}
        />
      }
      classNames={classNames}
      {...rest}
    />
  );
}
