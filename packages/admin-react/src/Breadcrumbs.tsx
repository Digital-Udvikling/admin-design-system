import { Children, Fragment, isValidElement, type ComponentProps, type ReactNode } from "react";
import { cn } from "./cn";
import { renderIcon, type IconProp } from "./icon";

export interface BreadcrumbsProps extends ComponentProps<"nav"> {
  /** Custom separator between items. Defaults to "/" from CSS. */
  separator?: ReactNode;
  /** Accessible label for the nav landmark. */
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
};
type BreadcrumbItemAsSpan = ComponentProps<"span"> & {
  href?: undefined;
  current?: boolean;
  icon?: IconProp;
};

export type BreadcrumbItemProps = BreadcrumbItemAsLink | BreadcrumbItemAsSpan;

function BreadcrumbItem(props: BreadcrumbItemProps) {
  if (props.href !== undefined) {
    const { className, current, icon, children, ...rest } = props;
    return (
      <li>
        <a
          className={cn("breadcrumb-item", className)}
          aria-current={current ? "page" : undefined}
          {...rest}
        >
          {renderIcon(icon, 14)}
          {children}
        </a>
      </li>
    );
  }
  const { className, current, icon, children, ...rest } = props;
  return (
    <li>
      <span
        className={cn("breadcrumb-item", className)}
        aria-current={current ? "page" : undefined}
        {...rest}
      >
        {renderIcon(icon, 14)}
        {children}
      </span>
    </li>
  );
}

export type BreadcrumbSeparatorProps = ComponentProps<"span">;

function BreadcrumbSeparator({ className, children, ...rest }: BreadcrumbSeparatorProps) {
  return (
    <span aria-hidden="true" className={cn("breadcrumb-separator", className)} {...rest}>
      {children}
    </span>
  );
}

export const Breadcrumbs = Object.assign(BreadcrumbsRoot, {
  Item: BreadcrumbItem,
  Separator: BreadcrumbSeparator,
});
