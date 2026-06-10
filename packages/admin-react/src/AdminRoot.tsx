import { useCallback, useRef, type CSSProperties, type ComponentProps } from "react";
import { cn } from "./cn";
import { PortalContainerContext } from "./portal-context";

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

export function AdminRoot({ className, theme, systemAccent, style, ref, ...rest }: AdminRootProps) {
  const rootStyle =
    systemAccent !== undefined
      ? ({ ...style, "--color-system-accent": systemAccent } as CSSProperties)
      : style;

  // Publish this element as the portal container — Base UI popups otherwise
  // portal to `document.body`, outside `@scope (._ao-admin-root)`, and render
  // unstyled. A `<Dialog>` ancestor overrides this with its own `<dialog>`.
  const portalRef = useRef<HTMLElement | null>(null);
  const setRef = useCallback(
    (node: HTMLDivElement | null) => {
      portalRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );

  return (
    <PortalContainerContext.Provider value={portalRef}>
      <div
        ref={setRef}
        className={cn("admin-root", className)}
        style={rootStyle}
        {...rest}
        {...(theme !== undefined && { "data-theme": theme })}
      />
    </PortalContainerContext.Provider>
  );
}
