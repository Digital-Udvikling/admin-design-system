import { clsx } from "clsx";
import type { ComponentProps, ReactNode } from "react";
import { useAppShell } from "./AppShell";
import { renderIcon, type IconProp } from "./icon";
import { Menu } from "./Menu";

export type NavbarProps = ComponentProps<"header">;

function NavbarRoot({ className, ...rest }: NavbarProps) {
  return <header className={clsx("navbar", className)} {...rest} />;
}

export type NavbarBrandProps = ComponentProps<"div">;

function NavbarBrand({ className, ...rest }: NavbarBrandProps) {
  return <div className={clsx("navbar-brand", className)} {...rest} />;
}

export type NavbarItemsProps = ComponentProps<"nav">;

function NavbarItems({ className, ...rest }: NavbarItemsProps) {
  return <nav className={clsx("navbar-items", className)} {...rest} />;
}

export interface NavbarItemProps extends ComponentProps<"a"> {
  active?: boolean;
  /** Leading icon. */
  icon?: IconProp;
}

function NavbarItem({ active, icon, className, children, ...rest }: NavbarItemProps) {
  return (
    <a
      className={clsx("navbar-item", className)}
      aria-current={active ? "page" : undefined}
      {...rest}
    >
      {renderIcon(icon)}
      {children}
    </a>
  );
}

export interface NavbarDropdownProps extends Omit<ComponentProps<"details">, "title"> {
  /** Text shown in the trigger. */
  label: ReactNode;
}

function NavbarDropdown({ label, className, children, ...rest }: NavbarDropdownProps) {
  return (
    <Menu className={className} {...rest}>
      <Menu.Trigger className="navbar-item">{label}</Menu.Trigger>
      <Menu.Popup>{children}</Menu.Popup>
    </Menu>
  );
}

export type NavbarActionsProps = ComponentProps<"div">;

function NavbarActions({ className, ...rest }: NavbarActionsProps) {
  return <div className={clsx("navbar-actions", className)} {...rest} />;
}

export interface NavbarMobileToggleProps extends Omit<
  ComponentProps<"button">,
  "onClick" | "children"
> {
  /** Accessible label for the toggle. Default: "Open menu". */
  label?: string;
}

function NavbarMobileToggle({
  label = "Open menu",
  className,
  type = "button",
  ...rest
}: NavbarMobileToggleProps) {
  const shell = useAppShell();
  const open = shell?.mobileDrawerOpen ?? false;

  return (
    <button
      type={type}
      aria-label={label}
      aria-expanded={open}
      onClick={() => shell?.setMobileDrawerOpen(!open)}
      className={clsx("navbar-mobile-toggle", className)}
      {...rest}
    />
  );
}

export const Navbar = Object.assign(NavbarRoot, {
  Brand: NavbarBrand,
  Items: NavbarItems,
  Item: NavbarItem,
  Dropdown: NavbarDropdown,
  Actions: NavbarActions,
  MobileToggle: NavbarMobileToggle,
});
