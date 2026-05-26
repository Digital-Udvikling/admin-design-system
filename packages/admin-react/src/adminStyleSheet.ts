import css from "@aortl/admin-css/admin.css?inline";

export const ADMIN_CSS_TEXT: string = css;

let sheet: CSSStyleSheet | null = null;

/**
 * Lazily construct a single `CSSStyleSheet` carrying admin's CSS so every
 * `<AdminRoot isolated>` shadow root on the page adopts the same instance.
 * Constructable stylesheets are explicitly designed for this — adopting one
 * sheet into many shadow roots skips per-instance parsing.
 *
 * Returns `null` when the runtime doesn't support constructable stylesheets
 * (some test environments). Callers should fall back to a `<style>` element
 * carrying `ADMIN_CSS_TEXT`.
 */
export function getAdminStyleSheet(): CSSStyleSheet | null {
  if (sheet) return sheet;
  if (typeof CSSStyleSheet === "undefined") return null;
  try {
    const s = new CSSStyleSheet();
    s.replaceSync(css);
    sheet = s;
    return sheet;
  } catch {
    return null;
  }
}
