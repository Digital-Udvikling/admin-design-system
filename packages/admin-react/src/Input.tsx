import { Input as BaseInput } from "@base-ui/react/input";
import { clsx } from "clsx";
import type { ComponentProps } from "react";

export type InputVariant = "bordered" | "ghost" | "danger";
export type InputSize = "sm" | "md" | "lg";

type BaseInputProps = Omit<ComponentProps<typeof BaseInput>, "size">;

export interface InputProps extends BaseInputProps {
  variant?: InputVariant;
  inputSize?: InputSize;
}

export function Input({
  variant = "bordered",
  inputSize = "md",
  className,
  type = "text",
  ...rest
}: InputProps) {
  return (
    <BaseInput
      type={type}
      className={clsx(
        "input",
        `input-${variant}`,
        inputSize !== "md" && `input-${inputSize}`,
        typeof className === "string" ? className : undefined,
      )}
      {...rest}
    />
  );
}
