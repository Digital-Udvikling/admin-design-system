import type { ComponentProps } from "react";
import { cn } from "./cn";
import { renderIcon, type IconProp } from "./icon";

export interface MenuProps extends ComponentProps<"details"> {}

function MenuRoot({ className, ...rest }: MenuProps) {
  return <details className={cn("menu", className)} {...rest} />;
}

export type MenuTriggerProps = ComponentProps<"summary">;

function MenuTrigger({ className, ...rest }: MenuTriggerProps) {
  return <summary className={cn("menu-trigger", className)} {...rest} />;
}

export type MenuPopupProps = ComponentProps<"div">;

function MenuPopup({ className, role = "menu", ...rest }: MenuPopupProps) {
  return <div role={role} className={cn("menu-popup", className)} {...rest} />;
}

type MenuItemAsButton = ComponentProps<"button"> & { href?: undefined; icon?: IconProp };
type MenuItemAsLink = ComponentProps<"a"> & { href: string; icon?: IconProp };

export type MenuItemProps = MenuItemAsButton | MenuItemAsLink;

function MenuItem(props: MenuItemProps) {
  if (props.href !== undefined) {
    const { className, role = "menuitem", icon, children, ...rest } = props;
    return (
      <a role={role} className={cn("menu-item", className)} {...rest}>
        {renderIcon(icon)}
        {children}
      </a>
    );
  }
  const { className, type = "button", role = "menuitem", icon, children, ...rest } = props;
  return (
    <button type={type} role={role} className={cn("menu-item", className)} {...rest}>
      {renderIcon(icon)}
      {children}
    </button>
  );
}

export type MenuSeparatorProps = ComponentProps<"hr">;

function MenuSeparator({ className, ...rest }: MenuSeparatorProps) {
  return <hr className={cn("menu-separator", className)} {...rest} />;
}

export type MenuGroupProps = ComponentProps<"div">;

function MenuGroup({ className, role = "group", ...rest }: MenuGroupProps) {
  return <div role={role} className={cn("menu-group", className)} {...rest} />;
}

export type MenuGroupLabelProps = ComponentProps<"div">;

function MenuGroupLabel({ className, ...rest }: MenuGroupLabelProps) {
  return <div className={cn("menu-group-label", className)} {...rest} />;
}

export const Menu = Object.assign(MenuRoot, {
  Trigger: MenuTrigger,
  Popup: MenuPopup,
  Item: MenuItem,
  Separator: MenuSeparator,
  Group: MenuGroup,
  GroupLabel: MenuGroupLabel,
});
