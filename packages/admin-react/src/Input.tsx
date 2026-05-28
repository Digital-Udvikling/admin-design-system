import { Input as BaseInput } from "@base-ui/react/input";
import type { ComponentProps } from "react";
import { cn } from "./cn";

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
}
