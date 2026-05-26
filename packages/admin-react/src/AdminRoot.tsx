import type { CSSProperties, ComponentProps } from "react";
import { cn } from "./cn";

export interface AdminRootProps extends ComponentProps<"div"> {
  /**
   * Force a color scheme for this subtree. Sets `data-theme`, which flips the
   * semantic tokens and `color-scheme`. Omit to follow the OS preference.
   */
  theme?: "light" | "dark";
  /**
   * CSS color (e.g. `var(--color-purple-600)`) applied as `--color-system-accent`
   * to brand-shift the navbar + footer stripes and `<BrandTile>`. See
   * [Customize › System accent](https://digital-udvikling.github.io/admin-design-system/basics/customize/#system-accent).
   */
  systemAccent?: string;
}

export function AdminRoot({ className, theme, systemAccent, style, ...rest }: AdminRootProps) {
  const rootStyle =
    systemAccent !== undefined
      ? ({ ...style, "--color-system-accent": systemAccent } as CSSProperties)
      : style;

  return (
    <div
      className={cn("admin-root", className)}
      style={rootStyle}
      {...rest}
      {...(theme !== undefined && { "data-theme": theme })}
    />
  );
}
