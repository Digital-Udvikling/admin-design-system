import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cx } from "./lib/cx";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", block, className, type = "button", ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cx(
        "btn",
        `btn-${variant}`,
        size !== "md" && `btn-${size}`,
        block && "btn-block",
        className,
      )}
      {...rest}
    />
  );
});
