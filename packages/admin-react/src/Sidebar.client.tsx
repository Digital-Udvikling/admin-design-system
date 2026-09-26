"use client";

import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { createContext, useContext, useState } from "react";
import { useAppShell } from "./AppShell.client";
import { cn } from "./cn";
import { PortalContainerContext } from "./portal-context";
import type { SidebarCollapseToggleProps, SidebarCollapsibleProps, SidebarProps } from "./Sidebar";

interface SidebarContextValue {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

export function SidebarRoot({
  collapsed,
  defaultCollapsed,
  onCollapsedChange,
  drawerLabel = "Navigation",
  className,
  classNames,
  children,
  ...rest
}: SidebarProps) {
  const shell = useAppShell();
  const drawerOpen = shell?.mobileDrawerOpen ?? false;
  const portalContainer = useContext(PortalContainerContext);
  const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed ?? false);
  const isCollapsed = collapsed ?? internalCollapsed;
  const setCollapsed = (next: boolean) => {
    if (collapsed === undefined) setInternalCollapsed(next);
    onCollapsedChange?.(next);
  };

  return (
    <SidebarContext.Provider value={{ collapsed: isCollapsed, setCollapsed }}>
      {/* `data-collapsed` collapses the rail without a CollapseToggle; the toggle mirrors it. */}
      <aside
        className={cn("sidebar", className)}
        data-collapsed={isCollapsed ? "" : undefined}
        {...rest}
      >
        {drawerOpen ? null : children}
      </aside>
      {shell ? (
        <BaseDialog.Root open={drawerOpen} onOpenChange={(open) => shell.setMobileDrawerOpen(open)}>
          <BaseDialog.Portal container={portalContainer ?? undefined}>
            <BaseDialog.Backdrop
              className={cn("sidebar-drawer-backdrop", classNames?.drawerBackdrop)}
            />
            <BaseDialog.Popup
              className={cn("sidebar-drawer", classNames?.drawer)}
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

/** `Sidebar.Collapsible` with its trigger pre-rendered by Sidebar.tsx, so Server Components can pass `icon={IconUsers}`. */
export type SidebarCollapsibleBaseProps = Omit<SidebarCollapsibleProps, "icon" | "label">;

export function SidebarCollapsibleBase({
  trigger,
  children,
  className,
  classNames,
  open,
  defaultOpen,
  onOpenChange,
  ...rest
}: SidebarCollapsibleBaseProps) {
  const isControlled = open !== undefined;
  const [internalOpen, setInternalOpen] = useState(defaultOpen ?? false);
  const isOpen = isControlled ? open : internalOpen;

  return (
    <details
      className={cn("sidebar-collapsible", className)}
      open={isOpen}
      onToggle={(event) => {
        const next = (event.currentTarget as HTMLDetailsElement).open;
        if (!isControlled) setInternalOpen(next);
        // Skips the echo of a controlled `open` update; still reports toggles React didn't make.
        if (next !== isOpen) onOpenChange?.(next);
      }}
      {...rest}
    >
      <summary
        className={cn("sidebar-collapsible-trigger", classNames?.trigger)}
        // Controlled: cancel the native toggle so the DOM can't drift from `open`. Capture
        // phase, since happy-dom toggles <details> before the click bubbles to React's root.
        onClickCapture={(event) => {
          if (!isControlled) return;
          const nested = (event.target as Element).closest("a, button, input, select, textarea");
          if (nested !== null && event.currentTarget.contains(nested)) return;
          event.preventDefault();
          onOpenChange?.(!isOpen);
        }}
      >
        {trigger}
      </summary>
      <div className={cn("sidebar-collapsible-panel", classNames?.panel)}>{children}</div>
    </details>
  );
}

export function SidebarCollapseToggle({
  label = "Toggle sidebar",
  className,
  classNames,
  children,
  ...rest
}: SidebarCollapseToggleProps) {
  const ctx = useContext(SidebarContext);

  return (
    <label className={cn("sidebar-collapse-toggle", className)} {...rest}>
      <input
        type="checkbox"
        className={cn("sidebar-toggle", classNames?.input)}
        aria-label={label}
        // Outside a Sidebar the checkbox holds the state itself, as in vanilla markup.
        {...(ctx
          ? {
              checked: ctx.collapsed,
              onChange: (event) => ctx.setCollapsed(event.currentTarget.checked),
            }
          : {})}
      />
      {children}
    </label>
  );
}
