import { forwardRef, type InputHTMLAttributes } from "react";
import { cx } from "./lib/cx";

export type InputVariant = "bordered" | "ghost" | "danger";
export type InputSize = "sm" | "md" | "lg";

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  variant?: InputVariant;
  inputSize?: InputSize;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { variant = "bordered", inputSize = "md", className, type = "text", ...rest },
  ref,
) {
  return (
    <input
      ref={ref}
      type={type}
      className={cx(
        "input",
        `input-${variant}`,
        inputSize !== "md" && `input-${inputSize}`,
        className,
      )}
      {...rest}
    />
  );
});
