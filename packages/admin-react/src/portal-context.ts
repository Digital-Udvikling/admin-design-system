import { createContext, type RefObject } from "react";

/**
 * Container that Base UI popups (Select, Tooltip, etc.) should portal into.
 * When a `<Dialog>` ancestor publishes its `<dialog>` element through this
 * context, popups render inside that top-layer dialog so they paint above
 * the backdrop and escape its `overflow: hidden`. Outside a dialog the
 * context is null and popups portal to `document.body` as before.
 */
export const PortalContainerContext = createContext<RefObject<HTMLElement | null> | null>(null);
