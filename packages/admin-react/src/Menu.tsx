import { clsx } from "clsx";
import type { ComponentProps } from "react";

export interface MenuProps extends ComponentProps<"details"> {}

function MenuRoot({ className, ...rest }: MenuProps) {
  return <details className={clsx("menu", className)} {...rest} />;
}

export type MenuTriggerProps = ComponentProps<"summary">;

function MenuTrigger({ className, ...rest }: MenuTriggerProps) {
  return <summary className={clsx("menu-trigger", className)} {...rest} />;
}

export type MenuPopupProps = ComponentProps<"div">;

function MenuPopup({ className, role = "menu", ...rest }: MenuPopupProps) {
  return <div role={role} className={clsx("menu-popup", className)} {...rest} />;
}

export type MenuItemProps = ComponentProps<"button">;

function MenuItem({ className, type = "button", role = "menuitem", ...rest }: MenuItemProps) {
  return <button type={type} role={role} className={clsx("menu-item", className)} {...rest} />;
}

export type MenuLinkItemProps = ComponentProps<"a">;

function MenuLinkItem({ className, role = "menuitem", children, ...rest }: MenuLinkItemProps) {
  return (
    <a role={role} className={clsx("menu-item", className)} {...rest}>
      {children}
    </a>
  );
}

export type MenuSeparatorProps = ComponentProps<"hr">;

function MenuSeparator({ className, ...rest }: MenuSeparatorProps) {
  return <hr className={clsx("menu-separator", className)} {...rest} />;
}

export type MenuGroupProps = ComponentProps<"div">;

function MenuGroup({ className, role = "group", ...rest }: MenuGroupProps) {
  return <div role={role} className={clsx("menu-group", className)} {...rest} />;
}

export type MenuGroupLabelProps = ComponentProps<"div">;

function MenuGroupLabel({ className, ...rest }: MenuGroupLabelProps) {
  return <div className={clsx("menu-group-label", className)} {...rest} />;
}

export const Menu = Object.assign(MenuRoot, {
  Trigger: MenuTrigger,
  Popup: MenuPopup,
  Item: MenuItem,
  LinkItem: MenuLinkItem,
  Separator: MenuSeparator,
  Group: MenuGroup,
  GroupLabel: MenuGroupLabel,
});
