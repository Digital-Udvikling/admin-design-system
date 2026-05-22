import { createContext, useContext, useMemo, useState } from "react";
import type { CSSProperties, ComponentProps, ReactNode } from "react";
import { cn } from "./cn";

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
  /**
   * CSS color (e.g. `var(--color-purple-600)`) applied as `--color-system-accent`
   * to the shell root. See [Customize › System accent](https://digital-udvikling.github.io/admin-design-system/basics/customize/#system-accent).
   */
  systemAccent?: string;
  children?: ReactNode;
}

function AppShellRoot({
  hasSidebar = false,
  hasFooter = false,
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
        className={cn(
          [
            "app-shell",
            hasSidebar && "app-shell-with-sidebar",
            hasFooter && "app-shell-with-footer",
          ],
          className,
        )}
        style={rootStyle}
        {...rest}
      >
        {children}
      </div>
    </AppShellContext.Provider>
  );
}

export type AppShellMainProps = ComponentProps<"main">;

function AppShellMain({ className, ...rest }: AppShellMainProps) {
  return <main className={cn("app-shell-main", className)} {...rest} />;
}

export const AppShell = Object.assign(AppShellRoot, {
  Main: AppShellMain,
});
