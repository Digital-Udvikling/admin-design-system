import { createElement, isValidElement } from "react";
import type { ComponentType, ReactElement, ReactNode } from "react";

/** Props an icon component must accept — matches `@tabler/icons-react`, loose enough for other libraries. */
export interface IconRenderProps {
  size?: number | string;
  "aria-hidden"?: boolean | "true" | "false";
}

export type IconComponent = ComponentType<IconRenderProps>;

/** Component reference (rendered with `size="1em" aria-hidden`) or pre-instantiated element (as-is). */
export type IconProp = IconComponent | ReactElement | null | undefined;

/**
 * Render an `IconProp`, defaulting component references to `size="1em"
 * aria-hidden`. `"1em"` makes SVG icons inherit the host `font-size`, matching
 * the Tabler webfont in the vanilla bundle.
 */
export function renderIcon(icon: IconProp, size: number | string = "1em"): ReactNode {
  if (icon == null) return null;
  if (isValidElement(icon)) return icon;
  return createElement(icon as IconComponent, { size, "aria-hidden": true });
}
