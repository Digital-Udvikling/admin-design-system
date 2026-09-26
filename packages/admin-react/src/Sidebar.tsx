import type { ComponentProps, ReactNode } from "react";
import { cn, type SlotClasses } from "./cn";
import { renderIcon, type IconProp } from "./icon";
import { renderAs, type RenderElement } from "./render";
import { SidebarCollapseToggle, SidebarCollapsibleBase, SidebarRoot } from "./Sidebar.client";
import { hasNode } from "./slot";

export interface SidebarProps extends Omit<ComponentProps<"aside">, "onChange"> {
  /** Controlled collapsed state, set as `data-collapsed` on the root. Pair with `onCollapsedChange`. */
  collapsed?: boolean;
  /** Uncontrolled initial state. */
  defaultCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  /** Accessible label for the mobile drawer dialog. Default: "Navigation". */
  drawerLabel?: string;
  /** Per-slot class overrides. `className` targets the root; these target inner slots. */
  classNames?: SlotClasses<"drawer" | "drawerBackdrop">;
}

export type SidebarHeaderProps = ComponentProps<"div">;

function SidebarHeader({ className, ...rest }: SidebarHeaderProps) {
  return <div className={cn("sidebar-header", className)} {...rest} />;
}

export type SidebarNavProps = ComponentProps<"nav">;

function SidebarNav({ className, ...rest }: SidebarNavProps) {
  return <nav className={cn("sidebar-nav", className)} {...rest} />;
}

export type SidebarGroupProps = ComponentProps<"div">;

function SidebarGroup({ className, ...rest }: SidebarGroupProps) {
  return <div className={cn("sidebar-group", className)} {...rest} />;
}

export type SidebarGroupLabelProps = ComponentProps<"div">;

function SidebarGroupLabel({ className, ...rest }: SidebarGroupLabelProps) {
  return <div className={cn("sidebar-group-label", className)} {...rest} />;
}

export interface SidebarItemProps extends ComponentProps<"a"> {
  /** Marks the current page: sets `aria-current="page"`. */
  current?: boolean;
  /** Element to render in place of the `<a>`, such as a router link: `render={<NextLink href="/orders" />}`. */
  render?: RenderElement;
  /** Leading icon. Rendered inside `<Sidebar.Icon>`. */
  icon?: IconProp;
  /** Trailing badge. Rendered inside `<Sidebar.Badge>`. */
  badge?: ReactNode;
  /** Per-slot class overrides. `className` targets the root; these target inner slots. */
  classNames?: SlotClasses<"icon" | "label" | "badge">;
}

function SidebarItem({
  current,
  icon,
  badge,
  render,
  className,
  classNames,
  children,
  ...rest
}: SidebarItemProps) {
  return renderAs("a", render, {
    className: cn("sidebar-item", className),
    "aria-current": current ? "page" : undefined,
    ...rest,
    children: (
      <>
        {icon != null ? (
          <SidebarIcon className={classNames?.icon}>{renderIcon(icon)}</SidebarIcon>
        ) : null}
        {hasNode(children) ? (
          <SidebarLabel className={classNames?.label}>{children}</SidebarLabel>
        ) : null}
        {hasNode(badge) ? <SidebarBadge className={classNames?.badge}>{badge}</SidebarBadge> : null}
      </>
    ),
  });
}

export type SidebarIconProps = ComponentProps<"span">;

function SidebarIcon({ className, ...rest }: SidebarIconProps) {
  return <span aria-hidden className={cn("sidebar-icon", className)} {...rest} />;
}

export type SidebarLabelProps = ComponentProps<"span">;

function SidebarLabel({ className, ...rest }: SidebarLabelProps) {
  return <span className={cn("sidebar-label", className)} {...rest} />;
}

export type SidebarBadgeProps = ComponentProps<"span">;

function SidebarBadge({ className, ...rest }: SidebarBadgeProps) {
  return <span className={cn("sidebar-badge", className)} {...rest} />;
}

export interface SidebarCollapsibleProps extends Omit<
  ComponentProps<"details">,
  "onToggle" | "open"
> {
  /** Leading icon for the trigger. Rendered inside `<Sidebar.Icon>`. */
  icon?: IconProp;
  /** Label shown next to the icon. Rendered inside `<Sidebar.Label>`. */
  label?: ReactNode;
  /** Full trigger content. Overrides `icon` + `label`. */
  trigger?: ReactNode;
  /** Controlled open state. */
  open?: boolean;
  /** Uncontrolled initial open state. */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Per-slot class overrides. `className` targets the root; these target inner slots. */
  classNames?: SlotClasses<"icon" | "label" | "trigger" | "panel">;
}

function SidebarCollapsible({
  icon,
  label,
  trigger,
  classNames,
  ...rest
}: SidebarCollapsibleProps) {
  return (
    <SidebarCollapsibleBase
      trigger={
        trigger ?? (
          <>
            {icon != null ? (
              <SidebarIcon className={classNames?.icon}>{renderIcon(icon)}</SidebarIcon>
            ) : null}
            {hasNode(label) ? (
              <SidebarLabel className={classNames?.label}>{label}</SidebarLabel>
            ) : null}
          </>
        )
      }
      classNames={classNames}
      {...rest}
    />
  );
}

export interface SidebarSubItemProps extends ComponentProps<"a"> {
  /** Marks the current page: sets `aria-current="page"`. */
  current?: boolean;
  /** Element to render in place of the `<a>`, such as a router link: `render={<NextLink href="/orders" />}`. */
  render?: RenderElement;
  icon?: IconProp;
  badge?: ReactNode;
  /** Per-slot class overrides. `className` targets the root; these target inner slots. */
  classNames?: SlotClasses<"icon" | "label" | "badge">;
}

function SidebarSubItem({
  current,
  icon,
  badge,
  render,
  className,
  classNames,
  children,
  ...rest
}: SidebarSubItemProps) {
  return renderAs("a", render, {
    className: cn("sidebar-subitem", className),
    "aria-current": current ? "page" : undefined,
    ...rest,
    children: (
      <>
        {icon != null ? (
          <SidebarIcon className={classNames?.icon}>{renderIcon(icon)}</SidebarIcon>
        ) : null}
        {hasNode(children) ? (
          <SidebarLabel className={classNames?.label}>{children}</SidebarLabel>
        ) : null}
        {hasNode(badge) ? <SidebarBadge className={classNames?.badge}>{badge}</SidebarBadge> : null}
      </>
    ),
  });
}

export type SidebarFooterProps = ComponentProps<"div">;

function SidebarFooter({ className, ...rest }: SidebarFooterProps) {
  return <div className={cn("sidebar-footer", className)} {...rest} />;
}

export interface SidebarCollapseToggleProps extends Omit<ComponentProps<"label">, "htmlFor"> {
  /** Accessible name of the checkbox (not the `<label>`). Default: "Toggle sidebar". */
  "aria-label"?: string;
  /** Per-slot class overrides. `className` targets the root; these target inner slots. */
  classNames?: SlotClasses<"input">;
}

// Assembled here, not in the "use client" module: a Server Component importing from there
// gets an opaque reference without the dot-notation parts.
export const Sidebar = Object.assign(SidebarRoot, {
  Header: SidebarHeader,
  Nav: SidebarNav,
  Group: SidebarGroup,
  GroupLabel: SidebarGroupLabel,
  Item: SidebarItem,
  Icon: SidebarIcon,
  Label: SidebarLabel,
  Badge: SidebarBadge,
  Collapsible: SidebarCollapsible,
  SubItem: SidebarSubItem,
  Footer: SidebarFooter,
  CollapseToggle: SidebarCollapseToggle,
});
