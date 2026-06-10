import type { ComponentProps } from "react";
import { cn } from "./cn";
import { renderIcon, type IconProp } from "./icon";

export interface LinkProps extends ComponentProps<"a"> {
  /**
   * Renders a trailing ↗ and defaults `target="_blank"` +
   * `rel="noopener noreferrer"`; explicit `target`/`rel` props win.
   */
  external?: boolean;
  /** Leading icon. */
  icon?: IconProp;
  /** Trailing icon. Independent of `external`'s ↗ — combining both renders two trailing markers. */
  iconTrailing?: IconProp;
}

/** A plain `<a>` with the design system's link styling. */
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
