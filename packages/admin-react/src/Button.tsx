import { Button as BaseButton } from "@base-ui/react/button";
import type { ComponentProps } from "react";
import { cn } from "./cn";
import { renderIcon, type IconProp } from "./icon";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ComponentProps<typeof BaseButton> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: boolean;
  /** Leading icon. Pass a component (`icon={IconPlus}`) or an element. */
  icon?: IconProp;
  /** Trailing icon. Pass a component (`iconTrailing={IconArrowRight}`) or an element. */
  iconTrailing?: IconProp;
}

export function Button({
  variant = "primary",
  size = "md",
  block,
  icon,
  iconTrailing,
  className,
  type = "button",
  children,
  ...rest
}: ButtonProps) {
  return (
    <BaseButton
      type={type}
      className={cn(
        ["btn", `btn-${variant}`, size !== "md" && `btn-${size}`, block && "btn-block"],
        className,
      )}
      {...rest}
    >
      {renderIcon(icon)}
      {children}
      {renderIcon(iconTrailing)}
    </BaseButton>
  );
}
