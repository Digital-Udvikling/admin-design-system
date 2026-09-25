import {
  createContext,
  useContext,
  useId,
  type ComponentProps,
  type MouseEvent,
  type Ref,
} from "react";
import type { ButtonSize, ButtonVariant } from "./Button";
import { cn } from "./cn";
import { renderIcon, type IconProp } from "./icon";
import { Kbd } from "./Kbd";
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

export type MenuProps = ComponentProps<"details">;

function MenuRoot({ className, onKeyDown, ...rest }: MenuProps) {
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

export interface MenuTriggerProps extends ComponentProps<"summary"> {
  /** Styles the trigger as a `<Button>` of this variant (`.btn`). Omit for the plain trigger. */
  variant?: ButtonVariant;
  /** Button size; applies only with `variant`. Without children the button is square. */
  size?: ButtonSize;
  /** Leading icon. With `variant` and no children, the trigger is a square icon button with no chevron. */
  icon?: IconProp;
}

function MenuTrigger({
  variant,
  size = "md",
  icon,
  className,
  children,
  ...rest
}: MenuTriggerProps) {
  return (
    <summary
      className={cn(
        [
          "menu-trigger",
          variant !== undefined && [
            "btn",
            variant !== "default" && `btn-${variant}`,
            size !== "md" && `btn-${size}`,
            children == null && "btn-square",
          ],
        ],
        className,
      )}
      {...rest}
    >
      {renderIcon(icon)}
      {children}
    </summary>
  );
}

export type MenuPopupProps = ComponentProps<"div">;

function MenuPopup({ className, role = "menu", ...rest }: MenuPopupProps) {
  return <div role={role} className={cn("menu-popup", className)} {...rest} />;
}

interface MenuItemExtras {
  /** Keyboard shortcut (`useHotkey` syntax) — synthesizes a click; shown right-pinned in the row. */
  hotkey?: string | readonly string[];
  /** Leading icon. Replaced by the check indicator when `checked` is set. */
  icon?: IconProp;
  /** Render as a checkable item: shows a leading check when `true`, reserves the gutter when `false`. Set `role="menuitemradio"` for single-select groups. */
  checked?: boolean;
  /** Destructive action (`.menu-item-danger`): danger-colored label and icon. */
  danger?: boolean;
}

type MenuItemAsButton = ComponentProps<"button"> & MenuItemExtras & { href?: undefined };
type MenuItemAsLink = ComponentProps<"a"> & MenuItemExtras & { href: string };

export type MenuItemProps = MenuItemAsButton | MenuItemAsLink;

function CheckIcon() {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12l5 5l10 -10" />
    </svg>
  );
}

// The check is revealed by CSS only when the item is aria-checked; the gutter is
// always reserved so labels align across a checkable group.
function MenuItemIndicator() {
  return (
    <span className={cn("menu-item-indicator", undefined)}>
      <CheckIcon />
    </span>
  );
}

function MenuItem(props: MenuItemProps) {
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

  const leading = checked !== undefined ? <MenuItemIndicator /> : renderIcon(props.icon);
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
      icon: _icon,
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
    icon: _icon,
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

export type MenuSeparatorProps = ComponentProps<"hr">;

function MenuSeparator({ className, ...rest }: MenuSeparatorProps) {
  return <hr className={cn("menu-separator", className)} {...rest} />;
}

// The enclosing group's label id, so Menu.GroupLabel names its Menu.Group.
const MenuGroupLabelIdContext = createContext<string | undefined>(undefined);

export type MenuGroupProps = ComponentProps<"div">;

function MenuGroup({ className, role = "group", ...rest }: MenuGroupProps) {
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

export type MenuGroupLabelProps = ComponentProps<"div">;

function MenuGroupLabel({ className, id, ...rest }: MenuGroupLabelProps) {
  const groupLabelId = useContext(MenuGroupLabelIdContext);
  return <div id={id ?? groupLabelId} className={cn("menu-group-label", className)} {...rest} />;
}

export const Menu = Object.assign(MenuRoot, {
  Trigger: MenuTrigger,
  Popup: MenuPopup,
  Item: MenuItem,
  Separator: MenuSeparator,
  Group: MenuGroup,
  GroupLabel: MenuGroupLabel,
});
