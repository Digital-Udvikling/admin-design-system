import { createContext, type RefObject } from "react";

/**
 * Container that Base UI popups (Select, Tooltip, etc.) should portal into.
 * `<AdminRoot>` publishes its own element here so popups render inside the
 * scoped subtree and match the `@scope (._ao-admin-root)` CSS — without it
 * they portal to `document.body`, outside the scope, and render unstyled. A
 * `<Dialog>` ancestor overrides it with its own `<dialog>` element so popups
 * join the top layer, painting above the backdrop and escaping its
 * `overflow: hidden`. With no provider the context is null and popups fall
 * back to `document.body`.
 */
export const PortalContainerContext = createContext<RefObject<HTMLElement | null> | null>(null);
