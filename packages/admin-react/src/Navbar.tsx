import type { CSSProperties, ComponentProps, ReactNode } from "react";
import { useAppShell } from "./AppShell";
import { cn, type SlotClasses } from "./cn";
import { renderIcon, type IconProp } from "./icon";
import { Menu } from "./Menu";

export interface NavbarProps extends ComponentProps<"header"> {
  /**
   * CSS color applied as `--color-system-accent` to the navbar, retinting its stripe
   * and any solid `<BrandTile>` inside. Pair a light and a dark tone (e.g.
   * `light-dark(var(--color-purple-600), var(--color-purple-400))`) so the tile glyph
   * keeps its contrast in dark mode. See
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
  /**
   * Marks the trigger as the current section (`data-active`) when the current page isn't one
   * of the menu's items. A `Menu.Item` with `aria-current="page"` marks it without this.
   */
  active?: boolean;
  /** Leading icon in the trigger. */
  icon?: IconProp;
  /** Per-slot class overrides. `className` targets the root; these target inner slots. */
  classNames?: SlotClasses<"trigger" | "popup">;
}

function NavbarDropdown({
  label,
  active,
  icon,
  className,
  classNames,
  children,
  ...rest
}: NavbarDropdownProps) {
  return (
    <Menu className={className} {...rest}>
      <Menu.Trigger
        className={cn("navbar-item", classNames?.trigger)}
        data-active={active ? "" : undefined}
      >
        {renderIcon(icon)}
        {label}
      </Menu.Trigger>
      <Menu.Popup className={classNames?.popup}>{children}</Menu.Popup>
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
