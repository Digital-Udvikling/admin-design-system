import {
  useLayoutEffect,
  useState,
  type CSSProperties,
  type ComponentProps,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "./cn";
import { ADMIN_CSS_TEXT, getAdminStyleSheet } from "./adminStyleSheet";
import { PortalContainerContext } from "./PortalContainerContext";

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
  /**
   * Mount admin inside an open shadow root for hard isolation from the host
   * page's CSS. Use when admin is embedded into an app you don't control and
   * cannot guarantee won't collide on class names or override admin styles.
   *
   * Renders nothing on the server — the shadow root is attached on the client
   * after hydration, so the admin region is briefly empty before it pops in.
   * Acceptable for an embedded panel; use the default light-DOM mount for
   * full-page admin-react apps where you own the document.
   */
  isolated?: boolean;
}

function accentStyle(
  systemAccent: string | undefined,
  base?: CSSProperties,
): CSSProperties | undefined {
  if (systemAccent === undefined) return base;
  return { ...base, "--color-system-accent": systemAccent } as CSSProperties;
}

export function AdminRoot({
  className,
  theme,
  systemAccent,
  style,
  isolated,
  children,
  ...rest
}: AdminRootProps) {
  if (isolated) {
    return (
      <IsolatedAdminRoot
        className={className}
        theme={theme}
        systemAccent={systemAccent}
        style={style}
        {...rest}
      >
        {children}
      </IsolatedAdminRoot>
    );
  }

  return (
    <LightAdminRoot
      className={className}
      theme={theme}
      systemAccent={systemAccent}
      style={style}
      {...rest}
    >
      {children}
    </LightAdminRoot>
  );
}

interface InternalRootProps extends ComponentProps<"div"> {
  theme: "light" | "dark" | undefined;
  systemAccent: string | undefined;
  children: ReactNode;
}

function LightAdminRoot({
  className,
  theme,
  systemAccent,
  style,
  children,
  ...rest
}: InternalRootProps) {
  const [portalEl, setPortalEl] = useState<HTMLDivElement | null>(null);

  return (
    <div
      className={cn("admin-root", className)}
      style={accentStyle(systemAccent, style)}
      {...rest}
      {...(theme !== undefined && { "data-theme": theme })}
    >
      <PortalContainerContext.Provider value={portalEl}>
        {children}
        <div ref={setPortalEl} data-admin-portal-host="" />
      </PortalContainerContext.Provider>
    </div>
  );
}

function IsolatedAdminRoot({
  className,
  theme,
  systemAccent,
  style,
  children,
  ...rest
}: InternalRootProps) {
  const [host, setHost] = useState<HTMLDivElement | null>(null);
  const [shadow, setShadow] = useState<ShadowRoot | null>(null);
  const [portalEl, setPortalEl] = useState<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (!host || shadow) return;
    const root = host.attachShadow({ mode: "open" });
    const constructed = getAdminStyleSheet();
    if (constructed !== null) {
      try {
        root.adoptedStyleSheets = [constructed];
      } catch {
        appendStyleFallback(root);
      }
    } else {
      appendStyleFallback(root);
    }
    setShadow(root);
  }, [host, shadow]);

  return (
    <div ref={setHost} {...rest}>
      {shadow !== null &&
        createPortal(
          <PortalContainerContext.Provider value={portalEl}>
            <div
              className={cn("admin-root", className)}
              style={accentStyle(systemAccent, style)}
              {...(theme !== undefined && { "data-theme": theme })}
            >
              {children}
              <div ref={setPortalEl} data-admin-portal-host="" />
            </div>
          </PortalContainerContext.Provider>,
          shadow,
        )}
    </div>
  );
}

function appendStyleFallback(root: ShadowRoot): void {
  const styleEl = root.ownerDocument.createElement("style");
  styleEl.textContent = ADMIN_CSS_TEXT;
  root.appendChild(styleEl);
}
