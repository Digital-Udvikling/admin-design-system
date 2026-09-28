import { Children, Fragment, isValidElement, type ComponentProps, type ReactNode } from "react";
import { cn } from "./cn";
import { renderIcon, type IconProp } from "./icon";
import { renderAs, type RenderElement } from "./render";

export interface BreadcrumbsProps extends ComponentProps<"nav"> {
  /** Custom separator between items. Defaults to "/" from CSS. */
  separator?: ReactNode;
  "aria-label"?: string;
}

function BreadcrumbsRoot({
  separator,
  className,
  children,
  "aria-label": ariaLabel = "Breadcrumb",
  ...rest
}: BreadcrumbsProps) {
  const items = Children.toArray(children).filter(isValidElement);
  return (
    <nav aria-label={ariaLabel} className={cn("breadcrumbs", className)} {...rest}>
      <ol>
        {items.map((child, i) => (
          <Fragment key={child.key ?? i}>
            {child}
            {i < items.length - 1 ? <BreadcrumbSeparator>{separator}</BreadcrumbSeparator> : null}
          </Fragment>
        ))}
      </ol>
    </nav>
  );
}

type BreadcrumbItemAsLink = ComponentProps<"a"> & {
  href: string;
  current?: boolean;
  icon?: IconProp;
  render?: undefined;
};
type BreadcrumbItemAsRender = ComponentProps<"a"> & {
  current?: boolean;
  icon?: IconProp;
  /** Element to render in place of the `<a>`. */
  render: RenderElement;
};
type BreadcrumbItemAsSpan = ComponentProps<"span"> & {
  href?: undefined;
  current?: boolean;
  icon?: IconProp;
  render?: undefined;
};

export type BreadcrumbItemProps =
  | BreadcrumbItemAsLink
  | BreadcrumbItemAsRender
  | BreadcrumbItemAsSpan;

function BreadcrumbItem(props: BreadcrumbItemProps) {
  if (props.href !== undefined || props.render !== undefined) {
    const { className, current, icon, render, children, ...rest } = props;
    return (
      <li>
        {renderAs("a", render, {
          className: cn("breadcrumb-item", className),
          "aria-current": current ? "page" : undefined,
          ...rest,
          children: (
            <>
              {renderIcon(icon)}
              {children}
            </>
          ),
        })}
      </li>
    );
  }
  const { className, current, icon, render: _render, children, ...rest } = props;
  return (
    <li>
      <span
        className={cn("breadcrumb-item", className)}
        aria-current={current ? "page" : undefined}
        {...rest}
      >
        {renderIcon(icon)}
        {children}
      </span>
    </li>
  );
}

export type BreadcrumbSeparatorProps = ComponentProps<"li">;

// `role="presentation"` keeps it out of the list semantics; `<li>` keeps the `<ol>` valid.
function BreadcrumbSeparator({ className, children, ...rest }: BreadcrumbSeparatorProps) {
  return (
    <li
      role="presentation"
      aria-hidden="true"
      className={cn("breadcrumb-separator", className)}
      {...rest}
    >
      {children}
    </li>
  );
}

export const Breadcrumbs = Object.assign(BreadcrumbsRoot, {
  Item: BreadcrumbItem,
  Separator: BreadcrumbSeparator,
});
