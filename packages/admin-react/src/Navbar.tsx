import type { CSSProperties, ComponentProps, ReactNode } from "react";
import { useAppShell } from "./AppShell";
import { cn } from "./cn";
import { renderIcon, type IconProp } from "./icon";
import { Menu } from "./Menu";

export interface NavbarProps extends ComponentProps<"header"> {
  /**
   * CSS color (e.g. `var(--color-purple-600)`) applied as `--color-system-accent`
   * to the navbar, retinting its stripe and any solid `<BrandTile>` inside. See
   * [Theming › System accent](https://digital-udvikling.github.io/admin-design-system/basics/theming/#system-accent).
   */
  systemAccent?: string;
}

function NavbarRoot({ systemAccent, className, style, ...rest }: NavbarProps) {
  const rootStyle =
    systemAccent !== undefined
      ? ({ ...style, "--color-system-accent": systemAccent } as CSSProperties)
      : style;

  return <header className={cn("navbar", className)} style={rootStyle} {...rest} />;
}

export type NavbarBrandProps = ComponentProps<"div">;

function NavbarBrand({ className, ...rest }: NavbarBrandProps) {
  return <div className={cn("navbar-brand", className)} {...rest} />;
}

export type NavbarItemsProps = ComponentProps<"nav">;

function NavbarItems({ className, ...rest }: NavbarItemsProps) {
  return <nav className={cn("navbar-items", className)} {...rest} />;
}

export interface NavbarItemProps extends ComponentProps<"a"> {
  active?: boolean;
  /** Leading icon. */
  icon?: IconProp;
}

function NavbarItem({ active, icon, className, children, ...rest }: NavbarItemProps) {
  return (
    <a
      className={cn("navbar-item", className)}
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
      <Menu.Trigger className={cn("navbar-item", undefined)}>{label}</Menu.Trigger>
      <Menu.Popup>{children}</Menu.Popup>
    </Menu>
  );
}

export type NavbarActionsProps = ComponentProps<"div">;

function NavbarActions({ className, ...rest }: NavbarActionsProps) {
  return <div className={cn("navbar-actions", className)} {...rest} />;
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
      className={cn("navbar-mobile-toggle", className)}
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
