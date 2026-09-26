"use client";

import { createContext, useContext, useId, type MouseEvent, type ReactNode, type Ref } from "react";
import { cn } from "./cn";
import { Kbd } from "./Kbd";
import type {
  MenuGroupLabelProps,
  MenuGroupProps,
  MenuItemAsButton,
  MenuItemAsLink,
  MenuProps,
} from "./Menu";
import { useHotkeyClick } from "./useHotkey";

function focusTrigger(details: HTMLDetailsElement) {
  details.querySelector<HTMLElement>(":scope > summary")?.focus();
}

/** Close `details` if open; focus inside it moves to the trigger so keyboard users aren't dropped on `<body>`. */
function closeMenu(details: HTMLDetailsElement | null) {
  if (details === null || !details.open) return;
  const hadFocus = details.contains(document.activeElement);
  details.open = false;
  if (hadFocus) focusTrigger(details);
}

export function MenuRoot({ className, onKeyDown, ...rest }: MenuProps) {
  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- delegated Escape for the focusable trigger and items inside
    <details
      className={cn("menu", className)}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        // defaultPrevented: the consumer or a nested menu already handled this Escape.
        if (event.key !== "Escape" || event.defaultPrevented || !event.currentTarget.open) return;
        // An Escape inside a dialog that an item opened belongs to that dialog.
        const dialog = event.target instanceof Element ? event.target.closest("dialog") : null;
        if (dialog !== null && event.currentTarget.contains(dialog)) return;
        // Consumed, so an enclosing <dialog> or outer menu stays open.
        event.preventDefault();
        closeMenu(event.currentTarget);
      }}
      {...rest}
    />
  );
}

/** `Menu.Item` with its leading slot pre-rendered by Menu.tsx, so Server Components can pass `icon={IconCopy}`. */
export type MenuItemBaseProps =
  | (Omit<MenuItemAsButton, "icon"> & { leading?: ReactNode })
  | (Omit<MenuItemAsLink, "icon"> & { leading?: ReactNode });

export function MenuItemBase(props: MenuItemBaseProps) {
  const hotkey = props.hotkey;
  const checked = props.checked;

  // Anchors have no native `disabled`, hence the `aria-disabled` branch.
  const ariaDisabled = props["aria-disabled"];
  const isDisabled =
    ("disabled" in props && props.disabled === true) ||
    ariaDisabled === true ||
    ariaDisabled === "true";

  // React 19 passes `ref` as a prop; merge it so a consumer ref can't detach the hotkey target.
  const { ariaKeyShortcuts, primaryChord, setRef } = useHotkeyClick<HTMLElement>(
    hotkey,
    props.ref as Ref<HTMLElement> | undefined,
    { enabled: !isDisabled },
  );

  const defaultRole = checked !== undefined ? "menuitemcheckbox" : "menuitem";

  const activate = <E extends HTMLElement>(
    event: MouseEvent<E>,
    onClick: ((event: MouseEvent<E>) => void) | undefined,
  ) => {
    // `aria-disabled` elements still receive clicks — without this, an anchor would navigate.
    if (isDisabled) {
      event.preventDefault();
      return;
    }
    // Checkable items stay open so several toggles fit in one visit.
    const details = checked === undefined ? event.currentTarget.closest("details") : null;
    // Trigger first, so a dialog this click opens restores focus there, not to a hidden item.
    if (details?.contains(document.activeElement)) focusTrigger(details);
    onClick?.(event);
    if (details === null) return;
    // After React commits: a Dialog or Drawer rendered inside the menu would open hidden in a closed <details>.
    setTimeout(() => {
      if (details.querySelector("dialog[open]") === null) closeMenu(details);
    }, 0);
  };

  if (props.href !== undefined) {
    const {
      className,
      role,
      leading,
      checked: _checked,
      danger,
      children,
      hotkey: _hk,
      ref: _ref,
      onClick,
      ...rest
    } = props;
    return (
      // <a href> is natively keyboard-activable, so these a11y rules are false positives.
      // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
      <a
        ref={setRef}
        role={role ?? defaultRole}
        aria-checked={checked}
        aria-keyshortcuts={ariaKeyShortcuts}
        className={cn(["menu-item", danger && "menu-item-danger"], className)}
        onClick={(event) => activate(event, onClick)}
        {...rest}
      >
        {leading}
        {children}
        {primaryChord !== undefined ? <Kbd keys={primaryChord} /> : null}
      </a>
    );
  }
  const {
    className,
    type = "button",
    role,
    leading,
    checked: _checked,
    danger,
    children,
    hotkey: _hk,
    ref: _ref,
    onClick,
    ...rest
  } = props;
  return (
    <button
      ref={setRef}
      type={type}
      role={role ?? defaultRole}
      aria-checked={checked}
      aria-keyshortcuts={ariaKeyShortcuts}
      className={cn(["menu-item", danger && "menu-item-danger"], className)}
      onClick={(event) => activate(event, onClick)}
      {...rest}
    >
      {leading}
      {children}
      {primaryChord !== undefined ? <Kbd keys={primaryChord} /> : null}
    </button>
  );
}

// The enclosing group's label id, so Menu.GroupLabel names its Menu.Group.
const MenuGroupLabelIdContext = createContext<string | undefined>(undefined);

export function MenuGroup({ className, role = "group", ...rest }: MenuGroupProps) {
  const labelId = useId();
  return (
    <MenuGroupLabelIdContext.Provider value={labelId}>
      <div
        role={role}
        aria-labelledby={labelId}
        className={cn("menu-group", className)}
        {...rest}
      />
    </MenuGroupLabelIdContext.Provider>
  );
}

export function MenuGroupLabel({ className, id, ...rest }: MenuGroupLabelProps) {
  const groupLabelId = useContext(MenuGroupLabelIdContext);
  return <div id={id ?? groupLabelId} className={cn("menu-group-label", className)} {...rest} />;
}
