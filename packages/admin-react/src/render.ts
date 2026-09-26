import {
  cloneElement,
  createElement,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
  type Ref,
} from "react";
import { mergeRefs } from "./merge-refs";

/**
 * An element that replaces a component's default tag, such as a router link:
 * `render={<NextLink href="/orders" />}`. Element only, so it works from a Server Component.
 */
export type RenderElement = ReactElement;

type OwnProps = {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  ref?: unknown;
  [prop: string]: unknown;
};

/**
 * Renders `props` as a `tag` element, or onto `render` when it is set. The element's own props
 * win, except that `className` is appended to ours, `style` merges (the element's keys win),
 * event handlers both run (the element's first), refs merge, and `props.children` replaces the
 * element's children unless it is empty.
 */
export function renderAs(
  tag: string,
  render: RenderElement | undefined,
  props: OwnProps,
): ReactElement {
  if (render === undefined) return createElement(tag, props);
  const merged: OwnProps = { ...props };
  for (const [key, value] of Object.entries(render.props as Record<string, unknown>)) {
    const ours = props[key];
    if (key === "className") {
      merged.className = [ours, value].filter(Boolean).join(" ") || undefined;
    } else if (key === "style") {
      merged.style = { ...(ours as CSSProperties), ...(value as CSSProperties) };
    } else if (key === "ref") {
      // A fresh merged ref each render reattaches; only happens when both sides pass a ref.
      merged.ref = ours == null ? value : mergeRefs(ours as Ref<unknown>, value as Ref<unknown>);
    } else if (key === "children") {
      if (props.children == null) merged.children = value as ReactNode;
    } else if (/^on[A-Z]/.test(key) && typeof value === "function" && typeof ours === "function") {
      merged[key] = (...args: unknown[]) => {
        value(...args);
        ours(...args);
      };
    } else {
      merged[key] = value;
    }
  }
  return cloneElement(render, merged);
}
