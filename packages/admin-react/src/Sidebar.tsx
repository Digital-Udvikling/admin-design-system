import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { createContext, useContext, useState } from "react";
import type { ComponentProps, ReactNode } from "react";
import { useAppShell } from "./AppShell";
import { cn } from "./cn";
import { renderIcon, type IconProp } from "./icon";

interface SidebarContextValue {
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

export interface SidebarProps extends Omit<ComponentProps<"aside">, "onChange"> {
  /** Controlled collapsed state. Pair with `onCollapsedChange`. */
  collapsed?: boolean;
  /** Uncontrolled initial state. */
  defaultCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  /** Accessible label for the mobile drawer dialog. Default: "Navigation". */
  drawerLabel?: string;
}

function SidebarRoot({
  collapsed,
  defaultCollapsed,
  onCollapsedChange,
  drawerLabel = "Navigation",
  className,
  children,
  ...rest
}: SidebarProps) {
  const shell = useAppShell();
  const drawerOpen = shell?.mobileDrawerOpen ?? false;

  return (
    <SidebarContext.Provider value={{ collapsed, defaultCollapsed, onCollapsedChange }}>
      <aside className={cn("sidebar", className)} {...rest}>
        {drawerOpen ? null : children}
      </aside>
      {shell ? (
        <BaseDialog.Root open={drawerOpen} onOpenChange={(open) => shell.setMobileDrawerOpen(open)}>
          <BaseDialog.Portal>
            <BaseDialog.Backdrop className={cn("sidebar-drawer-backdrop", undefined)} />
            <BaseDialog.Popup
              className={cn("sidebar-drawer", undefined)}
              aria-label={drawerLabel}
              onClick={(event) => {
                const target = event.target as HTMLElement;
                if (target.closest("a, [data-drawer-close]")) {
                  shell.setMobileDrawerOpen(false);
                }
              }}
            >
              {children}
            </BaseDialog.Popup>
          </BaseDialog.Portal>
        </BaseDialog.Root>
      ) : null}
    </SidebarContext.Provider>
  );
}

export type SidebarHeaderProps = ComponentProps<"div">;

function SidebarHeader({ className, ...rest }: SidebarHeaderProps) {
  return <div className={cn("sidebar-header", className)} {...rest} />;
}

export type SidebarNavProps = ComponentProps<"nav">;

function SidebarNav({ className, ...rest }: SidebarNavProps) {
  return <nav className={cn("sidebar-nav", className)} {...rest} />;
}

export type SidebarGroupProps = ComponentProps<"div">;

function SidebarGroup({ className, ...rest }: SidebarGroupProps) {
  return <div className={cn("sidebar-group", className)} {...rest} />;
}

export type SidebarGroupLabelProps = ComponentProps<"div">;

function SidebarGroupLabel({ className, ...rest }: SidebarGroupLabelProps) {
  return <div className={cn("sidebar-group-label", className)} {...rest} />;
}

export interface SidebarItemProps extends ComponentProps<"a"> {
  active?: boolean;
  /** Leading icon. Rendered inside `<Sidebar.Icon>`. */
  icon?: IconProp;
  /** Trailing badge. Rendered inside `<Sidebar.Badge>`. */
  badge?: ReactNode;
}

function SidebarItem({ active, icon, badge, className, children, ...rest }: SidebarItemProps) {
  return (
    <a
      className={cn("sidebar-item", className)}
      aria-current={active ? "page" : undefined}
      {...rest}
    >
      {icon != null ? <SidebarIcon>{renderIcon(icon)}</SidebarIcon> : null}
      {children !== undefined ? <SidebarLabel>{children}</SidebarLabel> : null}
      {badge !== undefined ? <SidebarBadge>{badge}</SidebarBadge> : null}
    </a>
  );
}

export type SidebarIconProps = ComponentProps<"span">;

function SidebarIcon({ className, ...rest }: SidebarIconProps) {
  return <span aria-hidden className={cn("sidebar-icon", className)} {...rest} />;
}

export type SidebarLabelProps = ComponentProps<"span">;

function SidebarLabel({ className, ...rest }: SidebarLabelProps) {
  return <span className={cn("sidebar-label", className)} {...rest} />;
}

export type SidebarBadgeProps = ComponentProps<"span">;

function SidebarBadge({ className, ...rest }: SidebarBadgeProps) {
  return <span className={cn("sidebar-badge", className)} {...rest} />;
}

export interface SidebarCollapsibleProps extends Omit<
  ComponentProps<"details">,
  "onToggle" | "open"
> {
  /** Leading icon for the trigger. Rendered inside `<Sidebar.Icon>`. */
  icon?: IconProp;
  /** Label shown next to the icon. Rendered inside `<Sidebar.Label>`. */
  label?: ReactNode;
  /** Full trigger content. Overrides `icon` + `label`. */
  trigger?: ReactNode;
  /** Controlled open state. */
  open?: boolean;
  /** Uncontrolled initial open state. */
  defaultOpen?: boolean;
  /** Fires when the panel toggles open/closed. */
  onOpenChange?: (open: boolean) => void;
}

function SidebarCollapsible({
  icon,
  label,
  trigger,
  children,
  className,
  open,
  defaultOpen,
  onOpenChange,
  ...rest
}: SidebarCollapsibleProps) {
  const isControlled = open !== undefined;
  const [internalOpen, setInternalOpen] = useState(defaultOpen ?? false);
  const isOpen = isControlled ? open : internalOpen;

  const triggerContent = trigger ?? (
    <>
      {icon != null ? <SidebarIcon>{renderIcon(icon)}</SidebarIcon> : null}
      {label !== undefined ? <SidebarLabel>{label}</SidebarLabel> : null}
    </>
  );

  return (
    <details
      className={cn("sidebar-collapsible", className)}
      open={isOpen}
      onToggle={(event) => {
        const next = (event.currentTarget as HTMLDetailsElement).open;
        if (!isControlled) setInternalOpen(next);
        onOpenChange?.(next);
      }}
      {...rest}
    >
      <summary className={cn("sidebar-collapsible-trigger", undefined)}>{triggerContent}</summary>
      <div className={cn("sidebar-collapsible-panel", undefined)}>{children}</div>
    </details>
  );
}

export interface SidebarSubItemProps extends ComponentProps<"a"> {
  active?: boolean;
  /** Leading icon. */
  icon?: IconProp;
  badge?: ReactNode;
}

function SidebarSubItem({
  active,
  icon,
  badge,
  className,
  children,
  ...rest
}: SidebarSubItemProps) {
  return (
    <a
      className={cn("sidebar-subitem", className)}
      aria-current={active ? "page" : undefined}
      {...rest}
    >
      {icon != null ? <SidebarIcon>{renderIcon(icon)}</SidebarIcon> : null}
      {children}
      {badge !== undefined ? <SidebarBadge>{badge}</SidebarBadge> : null}
    </a>
  );
}

export type SidebarFooterProps = ComponentProps<"div">;

function SidebarFooter({ className, ...rest }: SidebarFooterProps) {
  return <div className={cn("sidebar-footer", className)} {...rest} />;
}

export interface SidebarCollapseToggleProps extends Omit<ComponentProps<"label">, "htmlFor"> {
  /** Accessible label for the checkbox. Default: "Toggle sidebar". */
  label?: string;
}

function SidebarCollapseToggle({
  label = "Toggle sidebar",
  className,
  children,
  ...rest
}: SidebarCollapseToggleProps) {
  const ctx = useContext(SidebarContext);
  const controlledChecked = ctx?.collapsed;
  const isControlled = controlledChecked !== undefined;

  return (
    <label className={cn("sidebar-collapse-toggle", className)} {...rest}>
      <input
        type="checkbox"
        className={cn("sidebar-toggle", undefined)}
        aria-label={label}
        {...(isControlled
          ? { checked: controlledChecked }
          : { defaultChecked: ctx?.defaultCollapsed })}
        onChange={(event) => ctx?.onCollapsedChange?.(event.currentTarget.checked)}
      />
      <span className={cn("sr-only", undefined)}>{label}</span>
      {children}
    </label>
  );
}

export const Sidebar = Object.assign(SidebarRoot, {
  Header: SidebarHeader,
  Nav: SidebarNav,
  Group: SidebarGroup,
  GroupLabel: SidebarGroupLabel,
  Item: SidebarItem,
  Icon: SidebarIcon,
  Label: SidebarLabel,
  Badge: SidebarBadge,
  Collapsible: SidebarCollapsible,
  SubItem: SidebarSubItem,
  Footer: SidebarFooter,
  CollapseToggle: SidebarCollapseToggle,
});
