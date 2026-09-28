import type { ComponentProps, ReactNode } from "react";
import { AppShellRoot } from "./AppShell.client";
import { cn } from "./cn";

export { useAppShell, type AppShellContextValue } from "./AppShell.client";

export interface AppShellProps extends ComponentProps<"div"> {
  /** Adds `app-shell-with-sidebar`; a direct-child `<Sidebar>` switches the grid without it. */
  hasSidebar?: boolean;
  mobileDrawerOpen?: boolean;
  defaultMobileDrawerOpen?: boolean;
  onMobileDrawerOpenChange?: (open: boolean) => void;
  /**
   * CSS color applied as `--color-system-accent` to the shell root. Pair a light and
   * a dark tone (e.g. `light-dark(var(--color-purple-600), var(--color-purple-400))`)
   * so the brand-tile glyph keeps its contrast in dark mode. See [Theming › System accent](https://digital-udvikling.github.io/admin-design-system/basics/theming/#system-accent).
   */
  systemAccent?: string;
  children?: ReactNode;
}

export type AppShellMainProps = ComponentProps<"main">;

function AppShellMain({ className, ...rest }: AppShellMainProps) {
  return <main className={cn("app-shell-main", className)} {...rest} />;
}

// Assembled here: a Server Component sees the "use client" module as opaque, without the parts.
export const AppShell = Object.assign(AppShellRoot, {
  Main: AppShellMain,
});
