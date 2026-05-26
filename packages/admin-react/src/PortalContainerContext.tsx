import { createContext, useContext } from "react";

/**
 * Container that Base UI portals (Tooltip, Select, Sidebar, …) should mount
 * into. `<AdminRoot>` provides a portal-host element via this context so
 * popups land inside the same DOM subtree as the rest of admin — crucially,
 * inside the shadow root when `<AdminRoot isolated>` is used. `null` means
 * "no override; let Base UI default to `document.body`."
 */
export const PortalContainerContext = createContext<HTMLElement | null>(null);

export const usePortalContainer = (): HTMLElement | null => useContext(PortalContainerContext);
