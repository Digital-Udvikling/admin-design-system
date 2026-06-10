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
  /** Keyboard shortcut (`useHotkey` syntax) — synthesizes a click; shown right-pinned in the row. */
  hotkey?: string | readonly string[];
}

type MenuItemAsButton = ComponentProps<"button"> &
  MenuItemHotkeyProp & { href?: undefined; icon?: IconProp };
type MenuItemAsLink = ComponentProps<"a"> & MenuItemHotkeyProp & { href: string; icon?: IconProp };

export type MenuItemProps = MenuItemAsButton | MenuItemAsLink;

function MenuItem(props: MenuItemProps) {
  const ref = useRef<HTMLElement | null>(null);
  const hotkey = props.hotkey;

  // Anchors have no native `disabled`, hence the `aria-disabled` branch.
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
      // <a href> is natively keyboard-activable, so these a11y rules are false positives.
      // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
      <a
        ref={ref as Ref<HTMLAnchorElement>}
        role={role}
        aria-keyshortcuts={ariaKeyShortcuts}
        className={cn("menu-item", className)}
        onClick={(event) => {
          // Anchors ignore `aria-disabled` natively — without this, clicks would still navigate.
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
