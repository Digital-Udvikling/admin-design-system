import type { ComponentProps } from "react";
import { cn } from "./cn";
import { renderIcon, type IconProp } from "./icon";

export interface LinkProps extends ComponentProps<"a"> {
  /**
   * Marks the link as leaving the app: renders a trailing ↗ affordance and
   * defaults `target="_blank"` + `rel="noopener noreferrer"`. Explicit
   * `target`/`rel` props win, so you can keep the icon while overriding either.
   */
  external?: boolean;
  /** Leading icon. Pass a component (`icon={IconHome}`) or an element. */
  icon?: IconProp;
  /**
   * Trailing icon. Independent of `external`'s ↗ affordance — combining both
   * stacks two trailing affordances (the new-tab ↗ marker plus this icon).
   */
  iconTrailing?: IconProp;
}

/**
 * A text link — a plain `<a>` with the design system's link styling: primary
 * color, hover shift, underline, and a focus-visible ring. Pass `external` for
 * the new-tab affordance.
 */
export function Link({
  external,
  icon,
  iconTrailing,
  className,
  target,
  rel,
  children,
  ...rest
}: LinkProps) {
  return (
    <a
      target={target ?? (external ? "_blank" : undefined)}
      rel={rel ?? (external ? "noopener noreferrer" : undefined)}
      className={cn(["link", external && "link-external"], className)}
      {...rest}
    >
      {renderIcon(icon)}
      {children}
      {renderIcon(iconTrailing)}
    </a>
  );
}
