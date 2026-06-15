import { Input as BaseInput } from "@base-ui/react/input";
import type { ComponentProps } from "react";
import { cn } from "./cn";
import { renderIcon, type IconProp } from "./icon";

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
}

export function Input({
  variant = "bordered",
  inputSize = "md",
  icon,
  iconTrailing,
  className,
  type = "text",
  ...rest
}: InputProps) {
  const input = (
    <BaseInput
      type={type}
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

  if (icon == null && iconTrailing == null) return input;

  return (
    <span className={cn("input-icon", undefined)}>
      {renderIcon(icon)}
      {input}
      {renderIcon(iconTrailing)}
    </span>
  );
}
