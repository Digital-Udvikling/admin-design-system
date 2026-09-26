import type { CSSProperties, ComponentProps, ReactNode } from "react";
import { cn, type SlotClasses } from "./cn";
import { renderIcon, type IconProp } from "./icon";
import { renderAs, type RenderElement } from "./render";
import { containsCurrent, Menu, type MenuPopupProps, type MenuProps } from "./Menu";
import { NavbarMobileToggle } from "./Navbar.client";

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
  /** Marks the current page: sets `aria-current="page"`. */
  current?: boolean;
  /** Element to render in place of the `<a>`, such as a router link: `render={<NextLink href="/orders" />}`. */
  render?: RenderElement;
  /** Leading icon. */
  icon?: IconProp;
}

function NavbarItem({ current, icon, render, className, children, ...rest }: NavbarItemProps) {
  return renderAs("a", render, {
    className: cn("navbar-item", className),
    "aria-current": current ? "page" : undefined,
    ...rest,
    children: (
      <>
        {renderIcon(icon)}
        {children}
      </>
    ),
  });
}

export interface NavbarDropdownProps extends Omit<MenuProps, "title"> {
  /** Text shown in the trigger. */
  label: ReactNode;
  /**
   * Marks the trigger as the current section (`data-active`). Default: whether an item among
   * the children has `aria-current` set; pass `true` for a page in the section that isn't one of them.
   */
  active?: boolean;
  /** Leading icon in the trigger. */
  icon?: IconProp;
  /** Edge of the trigger the popup lines up with; use `"end"` in `Navbar.Actions`. Default: `"start"`. */
  align?: MenuPopupProps["align"];
  /** Per-slot class overrides. `className` targets the root; these target inner slots. */
  classNames?: SlotClasses<"trigger" | "popup">;
}

function NavbarDropdown({
  label,
  active,
  icon,
  align,
  className,
  classNames,
  children,
  ...rest
}: NavbarDropdownProps) {
  return (
    <Menu className={className} {...rest}>
      <Menu.Trigger
        className={cn("navbar-item", classNames?.trigger)}
        data-active={(active ?? containsCurrent(children)) ? "" : undefined}
      >
        {renderIcon(icon)}
        {label}
      </Menu.Trigger>
      <Menu.Popup align={align} className={classNames?.popup}>
        {children}
      </Menu.Popup>
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
  /** Accessible name. Default: "Open menu". */
  "aria-label"?: string;
}

export const Navbar = Object.assign(NavbarRoot, {
  Brand: NavbarBrand,
  Items: NavbarItems,
  Item: NavbarItem,
  Dropdown: NavbarDropdown,
  Actions: NavbarActions,
  MobileToggle: NavbarMobileToggle,
});
