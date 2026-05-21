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
  /** Shows a spinner in place of the leading icon and disables interaction.
   *  Sets `aria-busy="true"` and the native `disabled` attribute. */
  loading?: boolean;
  /** Leading icon. Pass a component (`icon={IconPlus}`) or an element. */
  icon?: IconProp;
  /** Trailing icon. Pass a component (`iconTrailing={IconArrowRight}`) or an element. */
  iconTrailing?: IconProp;
}

export function Button({
  variant = "primary",
  size = "md",
  block,
  loading,
  icon,
  iconTrailing,
  className,
  type = "button",
  disabled,
  children,
  ...rest
}: ButtonProps) {
  const iconOnly = children == null && (icon != null || iconTrailing != null);
  return (
    <BaseButton
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(
        [
          "btn",
          `btn-${variant}`,
          size !== "md" && `btn-${size}`,
          block && "btn-block",
          loading && "btn-loading",
          iconOnly && "btn-square",
        ],
        className,
      )}
      {...rest}
    >
      {loading ? null : renderIcon(icon)}
      {children}
      {renderIcon(iconTrailing)}
    </BaseButton>
  );
}
