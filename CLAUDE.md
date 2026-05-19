# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

`@aortl/admin` — a design system shipped as two npm packages from a single source of truth, plus a Starlight docs site. Maintained under the `Digital-Udvikling` GitHub org.

- `packages/admin-css` — pre-built CSS, semantic class names (`.btn`, `.input`, `.card`, `.field`). Built from Tailwind v4 source.
- `packages/admin-react` — React component library. **Wraps Base UI primitives** and emits the **same class names** as `admin-css`, so vanilla HTML and React render identically.
- `apps/docs` — Astro + Starlight site with side-by-side vanilla/React tabs.

## Design philosophy

This is a system for **internal admin tooling**, not customer-facing marketing surfaces. Optimize for:

- **Information density** — favor compact spacing, smaller defaults, tabular layouts. Don't pad components to feel "premium."
- **Operator UX** — keyboard affordances, predictable focus, fast scanning, low chrome. Power users sit in these screens all day.
- **Clarity over polish** — legible type, honest borders, restrained color. Decorative gradients, oversized hero spacing, soft shadows, and animation flourishes belong in a different system.
- **Predictable primitives** — fewer variants, consistent names, no surprises. A `<Button>` does what the HTML button does.

When in doubt: would this make a 12-row form on a busy admin screen *easier* or *prettier*? Pick easier.

## Commands

```fish
pnpm install
pnpm build           # builds admin-css → admin-react → docs (order matters)
pnpm build:css       # admin-css only
pnpm build:react     # admin-react only (depends on admin-css dist)
pnpm dev             # docs site at http://localhost:4321, with HMR into source CSS
pnpm check-types     # tsc on admin-react + astro check on docs
pnpm lint            # oxlint (NOT eslint)
pnpm lint:fix
pnpm format          # oxfmt (NOT prettier)
pnpm format:check
pnpm clean           # nuke dist/, .astro/, node_modules/.vite across the workspace
```

CI (`.github/workflows/ci.yml`) runs `lint`, `format:check`, `build`, then `check-types` — replicate locally before pushing.

## Architecture

### Class names are the contract

Both packages ship the same class names. `admin-react` components are thin wrappers — each `<Button>`, `<Input>`, `<Field>`, etc. emits e.g. `class="btn btn-primary btn-sm"` via `clsx`. The vanilla CSS in `packages/admin-css/src/components/*.css` defines those classes with Tailwind `@apply`. **Both must change together** — if you add a CSS modifier, expose a matching React prop; if you add a React prop, add the class to the CSS.

Naming pattern: `<base>` + `<base>-<variant>` + (optional) `<base>-<size>` + (optional) `<base>-<modifier>`. Sizes use `sm` / `md` (default, omitted) / `lg`.

React components stay tiny by wrapping Base UI primitives (`@base-ui/react/button`, `/input`, `/field`) — Base UI handles a11y wiring, focus, validation. Don't reimplement that. Compound parts use `Object.assign` dot-notation (`Card.Body`, `Field.Label`).

### Token system (Flexoki, two layers)

`packages/admin-css/src/theme.css` is the heart of the design system. Two `@theme static` blocks, both registered with Tailwind so it generates utilities AND emits CSS variables:

1. **Palette** — Flexoki ramps (`--color-blue-600`, `--color-base-50`, paper, black, …). `--color-*: initial` wipes Tailwind's defaults; Flexoki is the single source of truth. Tones are absolute, identical in light/dark mode.
2. **Semantic** — purpose-named aliases (`--color-primary`, `--color-surface`, `--color-danger`, …) declared once via `light-dark()`. Dark mode swaps to Flexoki's inverted ramp pairs (paper↔black, base-50↔base-950, accent-600↔accent-400).

**Components only reference semantic tokens, never palette tones directly.** This is what makes reskinning work — override `--color-primary` and every component follows.

Dark mode is driven by CSS `color-scheme` on `:root`: `light dark` (OS-driven) by default; `[data-theme="dark"]` / `[data-theme="light"]` force a mode and can be scoped to any subtree. A `@custom-variant dark` block aligns Tailwind's `dark:` variant with the same `[data-theme]` rules — important so authored utilities track the tokens.

### Build pipeline

Workspace order matters: `admin-css` builds first (Tailwind CLI produces `dist/admin.css` + `.min.css`); `admin-react` builds second (Vite lib mode, externals everything; then `cp ../admin-css/dist/admin.css ./dist/admin.css` for the `./styles.css` subpath export); `docs` builds last.

`apps/docs/src/styles/global.css` does NOT import the built `admin-css` bundle — it imports the **source files** (`@aortl/admin-css/src/theme.css`, `.../components/index.css`) so the docs share Tailwind's single compilation pass with the design system. This is what makes editing component CSS hot-reload in dev.

That same file also pre-declares the `@layer` order explicitly so Tailwind's `components`/`utilities` layers land AFTER Starlight's layers — otherwise Starlight's `@layer starlight.reset` overrides component sizing regardless of specificity. Don't reorder these imports without understanding why.

### Docs Example component

`apps/docs/src/components/Example.astro` renders the live preview and the synced-tab source viewer. It accepts `html` and `react` props and formats both at build time with `oxfmt`'s prettier parsers (`html` and `babel-ts`). Snippets are fragments (sibling roots), so the formatter wraps them in a synthetic root, formats, then strips and dedents — keep that in mind if you touch the helpers in `Example.astro`.

URLs in docs MUST go through `import.meta.env.BASE_URL` (e.g. `` `${import.meta.env.BASE_URL}components/buttons/` ``) — the site is served from `/admin-design-system/` on GitHub Pages.

## Adding a component

1. `packages/admin-css/src/components/<name>.css` — wrap in `@layer components { ... }`, use `@apply` with semantic tokens (`bg-primary`, `text-text-muted`, ...).
2. Add `@import "./<name>.css";` to `packages/admin-css/src/components/index.css`.
3. (Optional) `packages/admin-react/src/<Name>.tsx` — wrap a Base UI primitive if applicable, compose class names with `clsx`, re-export from `src/index.ts` (export both the component and its types).
4. `apps/docs/src/content/docs/components/<name>.mdx` — use `<Example html={...} react={...}>` with the live JSX as children.

No build config changes needed for new components.

## Releasing

Bump `version` in a package's `package.json`, commit, push to `main`. `.github/workflows/release.yml` triggers on path `packages/*/package.json`, diffs the version against existing git tags, then builds + `pnpm publish --provenance` + tags `<name>@<version>` for each package that's ahead. Do not publish manually; do not amend version commits after push.

Docs deploy is a separate workflow (`deploy.yml`) — runs on every push to `main`, publishes `apps/docs/dist` to GitHub Pages.

## Conventions

- Package manager is pnpm 10.13.1, Node ≥22. `.npmrc` sets `save-exact=true` — install with exact versions, no caret ranges.
- Tailwind v4 (`@theme`, `@custom-variant`, `light-dark()`). No `tailwind.config.js` — everything is CSS.
- TypeScript strict mode + `noUncheckedIndexedAccess` + `verbatimModuleSyntax` (use `import type` for types).
- Commits follow Conventional Commits style (see `git log`).
