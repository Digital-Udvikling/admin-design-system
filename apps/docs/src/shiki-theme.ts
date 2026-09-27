import { createCssVariablesTheme } from "shiki";

/**
 * Shiki's `css-variables` theme under the `--shiki-` prefix `.code-block`
 * colors. Astro's own `"css-variables"` preset emits `--astro-code-*` instead.
 */
export const shikiTheme = createCssVariablesTheme({ name: "admin", variablePrefix: "--shiki-" });
