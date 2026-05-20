import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { clsx } from "clsx";
import { createContext, useContext, useState } from "react";
import type { ChangeEvent, ComponentProps, ReactNode } from "react";
import { useAppShell } from "./AppShell";

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
      <aside className={clsx("sidebar", className)} {...rest}>
        {children}
      </aside>
      {shell ? (
        <BaseDialog.Root open={drawerOpen} onOpenChange={(open) => shell.setMobileDrawerOpen(open)}>
          <BaseDialog.Portal>
            <BaseDialog.Backdrop className="sidebar-drawer-backdrop" />
            <BaseDialog.Popup
              className="sidebar-drawer"
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
  return <div className={clsx("sidebar-header", className)} {...rest} />;
}

export type SidebarNavProps = ComponentProps<"nav">;

function SidebarNav({ className, ...rest }: SidebarNavProps) {
  return <nav className={clsx("sidebar-nav", className)} {...rest} />;
}

export type SidebarGroupProps = ComponentProps<"div">;

function SidebarGroup({ className, ...rest }: SidebarGroupProps) {
  return <div className={clsx("sidebar-group", className)} {...rest} />;
}

export type SidebarGroupLabelProps = ComponentProps<"div">;

function SidebarGroupLabel({ className, ...rest }: SidebarGroupLabelProps) {
  return <div className={clsx("sidebar-group-label", className)} {...rest} />;
}

export interface SidebarItemProps extends ComponentProps<"a"> {
  active?: boolean;
}

function SidebarItem({ active, className, children, ...rest }: SidebarItemProps) {
  return (
    <a
      className={clsx("sidebar-item", className)}
      aria-current={active ? "page" : undefined}
      {...rest}
    >
      {children}
    </a>
  );
}

export type SidebarIconProps = ComponentProps<"span">;

function SidebarIcon({ className, ...rest }: SidebarIconProps) {
  return <span aria-hidden className={clsx("sidebar-icon", className)} {...rest} />;
}

export type SidebarLabelProps = ComponentProps<"span">;

function SidebarLabel({ className, ...rest }: SidebarLabelProps) {
  return <span className={clsx("sidebar-label", className)} {...rest} />;
}

export type SidebarBadgeProps = ComponentProps<"span">;

function SidebarBadge({ className, ...rest }: SidebarBadgeProps) {
  return <span className={clsx("sidebar-badge", className)} {...rest} />;
}

export interface SidebarCollapsibleProps extends Omit<
  ComponentProps<"details">,
  "onToggle" | "open"
> {
  /** The trigger button content (icon + label). */
  trigger: ReactNode;
  /** Controlled open state. */
  open?: boolean;
  /** Uncontrolled initial open state. */
  defaultOpen?: boolean;
  /** Fires when the panel toggles open/closed. */
  onOpenChange?: (open: boolean) => void;
}

function SidebarCollapsible({
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

  return (
    <details
      className={clsx("sidebar-collapsible", className)}
      open={isOpen}
      onToggle={(event) => {
        const next = (event.currentTarget as HTMLDetailsElement).open;
        if (!isControlled) setInternalOpen(next);
        onOpenChange?.(next);
      }}
      {...rest}
    >
      <summary className="sidebar-collapsible-trigger">{trigger}</summary>
      <div className="sidebar-collapsible-panel">{children}</div>
    </details>
  );
}

export interface SidebarSubItemProps extends ComponentProps<"a"> {
  active?: boolean;
}

function SidebarSubItem({ active, className, children, ...rest }: SidebarSubItemProps) {
  return (
    <a
      className={clsx("sidebar-subitem", className)}
      aria-current={active ? "page" : undefined}
      {...rest}
    >
      {children}
    </a>
  );
}

export type SidebarFooterProps = ComponentProps<"div">;

function SidebarFooter({ className, ...rest }: SidebarFooterProps) {
  return <div className={clsx("sidebar-footer", className)} {...rest} />;
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
  const isControlled = ctx?.collapsed !== undefined;
  const onChange = (event: ChangeEvent<HTMLInputElement>) =>
    ctx?.onCollapsedChange?.(event.currentTarget.checked);

  return (
    <label className={clsx("sidebar-collapse-toggle", className)} {...rest}>
      {isControlled ? (
        <input
          type="checkbox"
          className="sidebar-toggle"
          aria-label={label}
          checked={ctx.collapsed}
          onChange={onChange}
        />
      ) : (
        <input
          type="checkbox"
          className="sidebar-toggle"
          aria-label={label}
          defaultChecked={ctx?.defaultCollapsed}
          onChange={onChange}
        />
      )}
      <span className="sr-only">{label}</span>
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
