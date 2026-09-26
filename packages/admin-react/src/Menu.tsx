import { Menu as BaseMenu } from "@base-ui/react/menu";
import type { ComponentProps, MouseEvent, ReactNode } from "react";
import type { ButtonSize, ButtonVariant } from "./Button";
import { cn } from "./cn";
import { renderIcon, type IconProp } from "./icon";
import type { RenderElement } from "./render";
import { MenuItemBase, MenuPopup } from "./Menu.client";

export interface MenuProps extends ComponentProps<"div"> {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Lock page scroll and block pointer events outside while open. Default: `false`. */
  modal?: boolean;
}

// Base UI's Root renders no element; vanilla rules key off `.menu` (btn-group seams, navbar).
function MenuRoot({
  open,
  defaultOpen,
  onOpenChange,
  modal = false,
  className,
  ...rest
}: MenuProps) {
  return (
    <BaseMenu.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange} modal={modal}>
      <div className={cn("menu", className)} {...rest} />
    </BaseMenu.Root>
  );
}

export interface MenuTriggerProps extends Omit<ComponentProps<"button">, "className"> {
  className?: string;
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
    <BaseMenu.Trigger
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
    </BaseMenu.Trigger>
  );
}

type MenuPositionerProps = ComponentProps<typeof BaseMenu.Positioner>;

export interface MenuPopupProps extends Omit<ComponentProps<"div">, "className"> {
  className?: string;
  /** Side of the trigger the popup opens on. Default: `"bottom"`. */
  side?: MenuPositionerProps["side"];
  /** Edge of the trigger the popup lines up with; `"end"` adds `menu-popup-end`. Default: `"start"`. */
  align?: MenuPositionerProps["align"];
  /** Gap between trigger and popup, in px. Default: `4`. */
  sideOffset?: number;
  alignOffset?: MenuPositionerProps["alignOffset"];
}

interface MenuItemExtras {
  /** Keyboard shortcut (`useHotkey` syntax); clicks the item even while the menu is closed. */
  hotkey?: string | readonly string[];
  /** Leading icon. Replaced by the check indicator on a checkable item. */
  icon?: IconProp;
  /** Destructive action (`.menu-item-danger`): danger-colored label and icon. */
  danger?: boolean;
  /** Close the menu when the item is activated. Default: `true`, `false` for a checkable item. */
  closeOnClick?: boolean;
}

export type MenuItemAsButton = Omit<
  ComponentProps<"button">,
  "onClick" | "defaultChecked" | "className"
> &
  MenuItemExtras & {
    href?: undefined;
    render?: undefined;
    className?: string;
    onClick?: (event: MouseEvent<HTMLElement>) => void;
    /** Controlled checked state; makes the item checkable (`menuitemcheckbox`) with a leading check. */
    checked?: boolean;
    defaultChecked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
  };

/** A link item: set `href`, or `render` for a router link. */
export type MenuItemAsLink = Omit<ComponentProps<"a">, "className"> &
  MenuItemExtras & { href?: string; render?: RenderElement; className?: string };

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

function isCheckable(props: MenuItemProps): boolean {
  if (props.href !== undefined || props.render !== undefined) return false;
  const { checked, defaultChecked } = props as MenuItemAsButton;
  return checked !== undefined || defaultChecked !== undefined;
}

function MenuItem({ icon, ...rest }: MenuItemProps) {
  return (
    <MenuItemBase
      leading={isCheckable(rest) ? <MenuItemIndicator /> : renderIcon(icon)}
      {...rest}
    />
  );
}

export type MenuRadioGroupProps = Omit<ComponentProps<"div">, "defaultValue" | "className"> & {
  className?: string;
  value?: string;
  defaultValue?: string;
  /** Called with the picked item's `value`. */
  onValueChange?: (value: string) => void;
};

// Rendered as a Menu.Group so a Menu.GroupLabel inside names it.
function MenuRadioGroup({ className, ...rest }: MenuRadioGroupProps) {
  return (
    <BaseMenu.RadioGroup
      render={<BaseMenu.Group />}
      className={cn("menu-group", className)}
      {...rest}
    />
  );
}

export type MenuRadioItemProps = Omit<ComponentProps<"button">, "value" | "className"> & {
  className?: string;
  /** Value reported to the enclosing `Menu.RadioGroup`. */
  value: string;
  /** Close the menu when the item is picked. Default: `false`. */
  closeOnClick?: boolean;
};

function MenuRadioItem({
  value,
  disabled,
  closeOnClick,
  className,
  children,
  type = "button",
  ...rest
}: MenuRadioItemProps) {
  return (
    <BaseMenu.RadioItem
      render={<button type={type} {...rest} />}
      nativeButton
      value={value}
      disabled={disabled}
      closeOnClick={closeOnClick}
      className={cn("menu-item", className)}
    >
      <MenuItemIndicator />
      {children}
    </BaseMenu.RadioItem>
  );
}

export type MenuSeparatorProps = ComponentProps<"hr">;

function MenuSeparator({ className, ...rest }: MenuSeparatorProps) {
  return <hr className={cn("menu-separator", className)} {...rest} />;
}

export type MenuGroupProps = Omit<ComponentProps<"div">, "className"> & { className?: string };
export type MenuGroupLabelProps = Omit<ComponentProps<"div">, "className"> & { className?: string };

function MenuGroup({ className, ...rest }: MenuGroupProps) {
  return <BaseMenu.Group className={cn("menu-group", className)} {...rest} />;
}

function MenuGroupLabel({ className, ...rest }: MenuGroupLabelProps) {
  return <BaseMenu.GroupLabel className={cn("menu-group-label", className)} {...rest} />;
}

export type MenuActionsProps = ComponentProps<"div">;

function MenuActions({ className, ...rest }: MenuActionsProps) {
  return <div className={cn("menu-actions", className)} {...rest} />;
}

/** Whether `node` holds an element with `aria-current` set, e.g. the current page's `Menu.Item`. */
export function containsCurrent(node: ReactNode): boolean {
  if (Array.isArray(node)) return node.some(containsCurrent);
  if (node === null || typeof node !== "object" || !("props" in node)) return false;
  const props = node.props as { "aria-current"?: unknown; children?: ReactNode };
  const current = props["aria-current"];
  if (current !== undefined && current !== false && current !== "false") return true;
  return containsCurrent(props.children);
}

// Assembled outside the "use client" module, which a server import sees as an opaque reference.
export const Menu = Object.assign(MenuRoot, {
  Trigger: MenuTrigger,
  Popup: MenuPopup,
  Item: MenuItem,
  RadioGroup: MenuRadioGroup,
  RadioItem: MenuRadioItem,
  Separator: MenuSeparator,
  Group: MenuGroup,
  GroupLabel: MenuGroupLabel,
  Actions: MenuActions,
});
