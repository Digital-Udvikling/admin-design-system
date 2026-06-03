import { useRef, type ComponentProps, type Ref } from "react";
import { cn } from "./cn";
import { renderIcon, type IconProp } from "./icon";
import { Kbd } from "./Kbd";
import { useHotkey } from "./useHotkey";

export type MenuProps = ComponentProps<"details">;

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

  // An item is inert when it carries the native `disabled` (button branch) or
  // an `aria-disabled` (anchor branch — links have no `disabled` attribute).
  // `aria-disabled` may arrive as the boolean `true` or the string `"true"`.
  const ariaDisabled = props["aria-disabled"];
  const isDisabled =
    ("disabled" in props && props.disabled === true) ||
    ariaDisabled === true ||
    ariaDisabled === "true";

  const { ariaKeyShortcuts, primaryChord } = useHotkey(hotkey, () => ref.current?.click(), {
    enabled: !isDisabled,
  });

  if (props.href !== undefined) {
    const { className, role = "menuitem", icon, children, hotkey: _hk, onClick, ...rest } = props;
    return (
      // An <a href> with role="menuitem" is natively keyboard-activable (Enter);
      // this onClick only intercepts clicks on a disabled item, so the static-
      // element / key-events a11y rules are false positives here.
      // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
      <a
        ref={ref as Ref<HTMLAnchorElement>}
        role={role}
        aria-keyshortcuts={ariaKeyShortcuts}
        className={cn("menu-item", className)}
        onClick={(event) => {
          // Anchors ignore `aria-disabled` natively, so a real click (or a
          // hotkey-synthesized one) would still navigate and fire onClick.
          if (isDisabled) {
            event.preventDefault();
            return;
          }
          onClick?.(event);
        }}
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
