import { createContext, type RefObject } from "react";

/**
 * Container Base UI popups portal into. `<AdminRoot>` publishes its element so
 * popups stay inside the `@scope (._ao-admin-root)` subtree — portaled to
 * `document.body` they fall outside the scope and render unstyled. A `<Dialog>`
 * ancestor overrides it with its `<dialog>` so popups join the top layer above
 * the backdrop. Null falls back to `document.body`.
 */
export const PortalContainerContext = createContext<RefObject<HTMLElement | null> | null>(null);
