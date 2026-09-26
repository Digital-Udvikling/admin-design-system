import type { ComponentProps } from "react";
import type { ButtonSize, ButtonVariant } from "./Button";
import { cn } from "./cn";
import { renderIcon, type IconProp } from "./icon";
import { MenuGroup, MenuGroupLabel, MenuItemBase, MenuRoot } from "./Menu.client";

export type MenuProps = ComponentProps<"details">;

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

export type MenuItemAsButton = ComponentProps<"button"> & MenuItemExtras & { href?: undefined };
export type MenuItemAsLink = ComponentProps<"a"> & MenuItemExtras & { href: string };

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

export type MenuSeparatorProps = ComponentProps<"hr">;

function MenuSeparator({ className, ...rest }: MenuSeparatorProps) {
  return <hr className={cn("menu-separator", className)} {...rest} />;
}

export type MenuGroupProps = ComponentProps<"div">;
export type MenuGroupLabelProps = ComponentProps<"div">;

function MenuItem({ icon, ...rest }: MenuItemProps) {
  return (
    <MenuItemBase
      leading={rest.checked !== undefined ? <MenuItemIndicator /> : renderIcon(icon)}
      {...rest}
    />
  );
}

// Assembled here, not in the "use client" module: a Server Component importing from there
// gets an opaque reference without the dot-notation parts.
export const Menu = Object.assign(MenuRoot, {
  Trigger: MenuTrigger,
  Popup: MenuPopup,
  Item: MenuItem,
  Separator: MenuSeparator,
  Group: MenuGroup,
  GroupLabel: MenuGroupLabel,
});
