import type { ComponentProps, ReactNode } from "react";
import { AppShellRoot } from "./AppShell.client";
import { cn } from "./cn";

export { useAppShell } from "./AppShell.client";

export interface AppShellProps extends ComponentProps<"div"> {
  /** Adds `app-shell-with-sidebar`. Optional: a `<Sidebar>` rendered as a direct child switches the grid on its own. */
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

// Assembled here, not in the "use client" module: a Server Component importing from there
// gets an opaque reference without the dot-notation parts.
export const AppShell = Object.assign(AppShellRoot, {
  Main: AppShellMain,
});
