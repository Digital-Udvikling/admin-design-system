"use client";

import { useAppShell } from "./AppShell.client";
import { cn } from "./cn";
import type { NavbarMobileToggleProps } from "./Navbar";

export function NavbarMobileToggle({
  "aria-label": ariaLabel = "Open menu",
  className,
  type = "button",
  ...rest
}: NavbarMobileToggleProps) {
  const shell = useAppShell();
  const open = shell?.mobileDrawerOpen ?? false;

  return (
    <button
      type={type}
      aria-label={ariaLabel}
      aria-expanded={open}
      onClick={() => shell?.setMobileDrawerOpen(!open)}
      className={cn("navbar-mobile-toggle", className)}
      {...rest}
    />
  );
}
