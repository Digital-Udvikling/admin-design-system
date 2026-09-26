import type { ComponentProps } from "react";
import { cn } from "./cn";
import { renderIcon, type IconProp } from "./icon";

export interface InputActionProps extends ComponentProps<"button"> {
  /** Glyph for the control. Pass a component (`icon={IconCopy}`) or an element. */
  icon?: IconProp;
}

/** `.input-action` button for `Input`'s `action` slot; `type` defaults to `"button"`. Needs an `aria-label`. */
export function InputAction({
  icon,
  type = "button",
  className,
  children,
  ...rest
}: InputActionProps) {
  return (
    <button type={type} className={cn("input-action", className)} {...rest}>
      {renderIcon(icon)}
      {children}
    </button>
  );
}
