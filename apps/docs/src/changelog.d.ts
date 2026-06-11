// The `@changelog` Vite alias (astro.config.mjs) maps to the repo-root
// CHANGELOG.md. Astro's ambient `*.md` module type keys on the import specifier,
// which "@changelog" doesn't match, so declare the markdown shape we consume.
declare module "@changelog" {
  type Instance = import("astro").MarkdownInstance<Record<string, unknown>>;
  export const Content: Instance["Content"];
  export const getHeadings: Instance["getHeadings"];
}
