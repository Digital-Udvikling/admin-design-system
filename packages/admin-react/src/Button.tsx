import { Button as BaseButton } from "@base-ui/react/button";
import { clsx } from "clsx";
import { type ComponentPropsWithoutRef, forwardRef } from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ComponentPropsWithoutRef<typeof BaseButton> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", block, className, type = "button", ...rest },
  ref,
) {
  return (
    <BaseButton
      ref={ref}
      type={type}
      className={clsx(
        "btn",
        `btn-${variant}`,
        size !== "md" && `btn-${size}`,
        block && "btn-block",
        typeof className === "string" ? className : undefined,
      )}
      {...rest}
    />
  );
});
