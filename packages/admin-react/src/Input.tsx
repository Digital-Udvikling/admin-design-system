import type { Input as BaseInput } from "@base-ui/react/input";
import type { ComponentProps, ReactNode } from "react";
import type { SlotClasses } from "./cn";
import { renderIcon, type IconProp } from "./icon";
import { InputAction } from "./InputAction";
import { InputBase, PasswordInputBase } from "./Input.client";

export type { InputActionProps } from "./InputAction";

export type InputVariant = "bordered" | "ghost" | "danger" | "info" | "success" | "warning";
export type InputSize = "sm" | "md" | "lg";

type BaseInputProps = Omit<ComponentProps<typeof BaseInput>, "size">;

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

function InputRoot({ icon, iconTrailing, ...rest }: InputProps) {
  return (
    <InputBase iconNode={renderIcon(icon)} iconTrailingNode={renderIcon(iconTrailing)} {...rest} />
  );
}

export const Input = Object.assign(InputRoot, {
  Action: InputAction,
});

export interface PasswordInputProps extends Omit<
  InputProps,
  "type" | "action" | "clearable" | "onClear" | "clearLabel"
> {
  /** aria-label for the reveal toggle. Default `"Show password"`. */
  revealLabel?: string;
}

/** Password field with a trailing reveal toggle. Emits the same `.input` / `.input-action` classes. */
export function PasswordInput({ icon, iconTrailing, ...rest }: PasswordInputProps) {
  return (
    <PasswordInputBase
      iconNode={renderIcon(icon)}
      iconTrailingNode={renderIcon(iconTrailing)}
      {...rest}
    />
  );
}
