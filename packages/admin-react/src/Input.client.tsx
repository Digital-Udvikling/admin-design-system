"use client";

import { Input as BaseInput } from "@base-ui/react/input";
import { useCallback, useRef, useState, type ComponentProps, type ReactNode } from "react";
import { cn } from "./cn";
import type { InputProps, PasswordInputProps } from "./Input";
import { InputAction } from "./InputAction";
import { hasNode } from "./slot";

type BaseInputProps = Omit<ComponentProps<typeof BaseInput>, "size">;
// Base UI augments the native change event with `preventBaseUIHandler`; derive its
// exact type so the wrapper's handler and the consumer's `onChange` line up.
type InputChangeEvent = Parameters<NonNullable<BaseInputProps["onChange"]>>[0];

/** Icons arrive rendered: Input.tsx renders them so Server Components can pass `icon={IconSearch}`. */
interface RenderedIcons {
  iconNode?: ReactNode;
  iconTrailingNode?: ReactNode;
}

export type InputBaseProps = Omit<InputProps, "icon" | "iconTrailing"> & RenderedIcons;
export type PasswordInputBaseProps = Omit<PasswordInputProps, "icon" | "iconTrailing"> &
  RenderedIcons;

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

export function InputBase({
  variant = "bordered",
  inputSize = "md",
  iconNode,
  iconTrailingNode,
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
}: InputBaseProps) {
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
  const wrap = iconNode != null || iconTrailingNode != null || hasAction || clearable;
  if (!wrap) return inputEl;

  let trailing: ReactNode = iconTrailingNode;
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
      {iconNode}
      {inputEl}
      {trailing}
    </span>
  );
}

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

export function PasswordInputBase({
  revealLabel = "Show password",
  classNames,
  ...rest
}: PasswordInputBaseProps) {
  const [revealed, setRevealed] = useState(false);
  return (
    <InputBase
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
