"use client";

import { createContext, useContext, useMemo, useState, type CSSProperties } from "react";
import type { AppShellProps } from "./AppShell";
import { cn } from "./cn";

export interface AppShellContextValue {
  mobileDrawerOpen: boolean;
  setMobileDrawerOpen: (open: boolean) => void;
  hasSidebar: boolean;
}

const AppShellContext = createContext<AppShellContextValue | null>(null);

export function useAppShell(): AppShellContextValue | null {
  return useContext(AppShellContext);
}

export function AppShellRoot({
  hasSidebar = false,
  mobileDrawerOpen,
  defaultMobileDrawerOpen = false,
  onMobileDrawerOpenChange,
  systemAccent,
  className,
  style,
  children,
  ...rest
}: AppShellProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultMobileDrawerOpen);
  const isControlled = mobileDrawerOpen !== undefined;
  const open = isControlled ? mobileDrawerOpen : uncontrolledOpen;

  const value = useMemo<AppShellContextValue>(
    () => ({
      mobileDrawerOpen: open,
      setMobileDrawerOpen: (next) => {
        if (!isControlled) setUncontrolledOpen(next);
        onMobileDrawerOpenChange?.(next);
      },
      hasSidebar,
    }),
    [open, isControlled, onMobileDrawerOpenChange, hasSidebar],
  );

  const rootStyle =
    systemAccent !== undefined
      ? ({ ...style, "--color-system-accent": systemAccent } as CSSProperties)
      : style;

  return (
    <AppShellContext.Provider value={value}>
      <div
        className={cn(["app-shell", hasSidebar && "app-shell-with-sidebar"], className)}
        style={rootStyle}
        {...rest}
      >
        {children}
      </div>
    </AppShellContext.Provider>
  );
}
