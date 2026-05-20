import { clsx } from "clsx";
import { createContext, useContext, useMemo, useState } from "react";
import type { ComponentProps, ReactNode } from "react";

interface AppShellContextValue {
  mobileDrawerOpen: boolean;
  setMobileDrawerOpen: (open: boolean) => void;
  hasSidebar: boolean;
}

const AppShellContext = createContext<AppShellContextValue | null>(null);

export function useAppShell(): AppShellContextValue | null {
  return useContext(AppShellContext);
}

export interface AppShellProps extends ComponentProps<"div"> {
  hasSidebar?: boolean;
  hasFooter?: boolean;
  mobileDrawerOpen?: boolean;
  defaultMobileDrawerOpen?: boolean;
  onMobileDrawerOpenChange?: (open: boolean) => void;
  children?: ReactNode;
}

function AppShellRoot({
  hasSidebar = false,
  hasFooter = false,
  mobileDrawerOpen,
  defaultMobileDrawerOpen = false,
  onMobileDrawerOpenChange,
  className,
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

  return (
    <AppShellContext.Provider value={value}>
      <div
        className={clsx(
          "app-shell",
          hasSidebar && "app-shell-with-sidebar",
          hasFooter && "app-shell-with-footer",
          className,
        )}
        {...rest}
      >
        {children}
      </div>
    </AppShellContext.Provider>
  );
}

export type AppShellMainProps = ComponentProps<"main">;

function AppShellMain({ className, ...rest }: AppShellMainProps) {
  return <main className={clsx("app-shell-main", className)} {...rest} />;
}

export const AppShell = Object.assign(AppShellRoot, {
  Main: AppShellMain,
});
