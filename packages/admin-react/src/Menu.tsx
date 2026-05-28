import { useRef, type ComponentProps, type Ref } from "react";
import { cn } from "./cn";
import { renderIcon, type IconProp } from "./icon";
import { Kbd } from "./Kbd";
import { useHotkey } from "./useHotkey";

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

interface MenuItemHotkeyProp {
  /**
   * Keyboard shortcut bound to this item. Pressing the chord synthesizes a
   * click on this item. Right-pinned visually inside the menu row. Same
   * syntax as `useHotkey`.
   */
  hotkey?: string | readonly string[];
}

type MenuItemAsButton = ComponentProps<"button"> &
  MenuItemHotkeyProp & { href?: undefined; icon?: IconProp };
type MenuItemAsLink = ComponentProps<"a"> & MenuItemHotkeyProp & { href: string; icon?: IconProp };

export type MenuItemProps = MenuItemAsButton | MenuItemAsLink;

function MenuItem(props: MenuItemProps) {
  const ref = useRef<HTMLElement | null>(null);
  const hotkey = props.hotkey;

  const { ariaKeyShortcuts, primaryChord } = useHotkey(hotkey, () => ref.current?.click(), {
    enabled: !("disabled" in props && props.disabled),
  });

  if (props.href !== undefined) {
    const { className, role = "menuitem", icon, children, hotkey: _hk, ...rest } = props;
    return (
      <a
        ref={ref as Ref<HTMLAnchorElement>}
        role={role}
        aria-keyshortcuts={ariaKeyShortcuts}
        className={cn("menu-item", className)}
        {...rest}
      >
        {renderIcon(icon)}
        {children}
        {primaryChord !== undefined ? <Kbd keys={primaryChord} /> : null}
      </a>
    );
  }
  const {
    className,
    type = "button",
    role = "menuitem",
    icon,
    children,
    hotkey: _hk,
    ...rest
  } = props;
  return (
    <button
      ref={ref as Ref<HTMLButtonElement>}
      type={type}
      role={role}
      aria-keyshortcuts={ariaKeyShortcuts}
      className={cn("menu-item", className)}
      {...rest}
    >
      {renderIcon(icon)}
      {children}
      {primaryChord !== undefined ? <Kbd keys={primaryChord} /> : null}
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
