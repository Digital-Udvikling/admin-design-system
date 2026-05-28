import { createElement, isValidElement } from "react";
import type { ComponentType, ReactElement, ReactNode } from "react";

/**
 * Props every icon component is expected to accept. Matches `@tabler/icons-react`
 * (size + standard SVG attributes), but loose enough to accept other libraries.
 */
export interface IconRenderProps {
  size?: number | string;
  "aria-hidden"?: boolean | "true" | "false";
}

export type IconComponent = ComponentType<IconRenderProps>;

/**
 * The value a component prop named `icon` will accept. Either:
 *   - a component reference (`icon={IconHome}`) — rendered with `size="1em" aria-hidden`,
 *   - or an already-instantiated React element (`icon={<IconHome size={20} />}`) — rendered as-is.
 */
export type IconProp = IconComponent | ReactElement | null | undefined;

/**
 * Render an `IconProp` to a React node, defaulting to `size="1em" aria-hidden`
 * when given a component reference. The `"1em"` default makes SVG icons inherit
 * the host's `font-size`, matching how the Tabler webfont (`<i class="ti …">`)
 * renders in the vanilla bundle — so both previews end up the same size.
 *
 * Anything that is not `null`/`undefined` and not already a React element is
 * treated as a component type — `createElement` accepts function components,
 * `forwardRef`s (e.g. `@tabler/icons-react`), `memo`, etc.
 */
export function renderIcon(icon: IconProp, size: number | string = "1em"): ReactNode {
  if (icon == null) return null;
  if (isValidElement(icon)) return icon;
  return createElement(icon as IconComponent, { size, "aria-hidden": true });
}
