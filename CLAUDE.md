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

When in doubt: would this make a 12-row form on a busy admin screen _easier_ or _prettier_? Pick easier.

## Prefer the platform

Reach for modern HTML and CSS before reaching for JavaScript. Admin users run current browsers — there is no IE/legacy budget, no need for polyfills, and no need for graceful fallbacks. If a behavior can be expressed declaratively, it should be.

- **Animations and transitions** — use CSS `transition`, `@keyframes`, `animation-timeline` / scroll-driven animations, and `@starting-style` / `transition-behavior: allow-discrete`. Don't add `framer-motion`, `react-spring`, or hand-rolled `requestAnimationFrame` loops.
- **Disclosure and overlays** — use `<dialog>` + `showModal()`, the `popover` attribute, and `anchor-name` / `position-anchor` for tooltips and menus. Don't manually portal, trap focus, or compute float positions in JS unless Base UI already does it for you.
- **Details / accordions** — `<details>` + `<summary>`, with `interactivity: inert` and `::details-content` for animated open/close. No state hook needed.
- **Selection and form state** — `:has()`, `:user-valid`, `:user-invalid`, `:placeholder-shown`, `accent-color`, `field-sizing: content` for auto-growing textareas. No `useState` to mirror what the DOM already tracks.
- **Layout** — container queries (`@container`), `subgrid`, `aspect-ratio`, logical properties, `text-wrap: balance` / `pretty`. Don't measure with `ResizeObserver` if a container query covers it.
- **Sticky / scroll behavior** — `position: sticky`, `scroll-snap-*`, `overscroll-behavior`, `scroll-margin-*`. Don't recreate any of these with scroll listeners.
- **Color and theming** — `light-dark()`, `color-mix()`, relative color syntax, `@property` for animatable custom properties. Already the convention in `theme.css` — keep it that way.

JavaScript is appropriate when the behavior is genuinely stateful, requires data fetching, or has no declarative equivalent (drag-and-drop, complex keyboard composition that Base UI doesn't handle, etc.). In those cases, prefer Base UI primitives over building from scratch.

This applies to both packages. `admin-css` should never require JS to make a component look or feel right; `admin-react` should be a thin wrapper that emits the same classes and lets the CSS do the work.

## Commands

```fish
pnpm install
pnpm build           # builds admin-css → admin-react → docs (order matters)
pnpm build:css       # admin-css only
pnpm build:react     # admin-react only (depends on admin-css dist)
pnpm dev             # docs site at http://localhost:4321, with HMR into source CSS
pnpm check-types     # tsc on admin-react + astro check on docs
pnpm test            # vitest on admin-react (happy-dom + RTL)
pnpm lint            # oxlint (NOT eslint)
pnpm lint:fix
pnpm format          # oxfmt (NOT prettier)
pnpm format:check
pnpm clean           # nuke dist/, .astro/, node_modules/.vite across the workspace
```

CI (`.github/workflows/ci.yml`) runs `lint`, `format:check`, `build`, `check-types`, then `test` — replicate locally before pushing.

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

### Icons (Tabler)

The system recommends **Tabler Icons** — webfont (`<i class="ti ti-name">`) for vanilla, `@tabler/icons-react` (`<IconName size={16} />`) for React. It's a recommendation, not a hard dep: nothing in `admin-css` or `admin-react` imports Tabler. `apps/docs` has both as devDeps so `:::example` previews render in both tabs; end-user install lives in the `getting-started/*` pages and `/theme/icons/` covers usage.

Components accommodate icons as a direct child of the root — `(inline-)flex items-center gap-2`, or `:has()` to switch layout when a leading `<i>`/`<svg>` is present (`.alert`, `.accordion-summary`). No wrapper class needed, and no named icon slot unless one is structurally required — `<Sidebar.Icon>` is the exception because it has to stay visible in the collapsed rail.

### Build pipeline

Workspace order matters: `admin-css` builds first (Tailwind CLI produces `dist/admin.css` + `.min.css`); `admin-react` builds second (Vite lib mode, externals everything; then `cp ../admin-css/dist/admin.css ./dist/admin.css` for the `./styles.css` subpath export); `docs` builds last.

`apps/docs/src/styles/global.css` does NOT import the built `admin-css` bundle — it imports the **source files** (`@aortl/admin-css/src/theme.css`, `.../components/index.css`) so the docs share Tailwind's single compilation pass with the design system. This is what makes editing component CSS hot-reload in dev.

That same file also pre-declares the `@layer` order explicitly so Tailwind's `components`/`utilities` layers land AFTER Starlight's layers — otherwise Starlight's `@layer starlight.reset` overrides component sizing regardless of specificity. Don't reorder these imports without understanding why.

### Tests

`admin-react` is tested with Vitest + `@testing-library/react` on happy-dom. Tests live next to the component as `<Name>.test.tsx`.

Two shapes per component:

1. **Smoke** — one `it("renders", ...)` that mounts the component (with subparts where applicable) and asserts the root is queryable. Goal is just "doesn't throw" — not a class-name or DOM-shape contract.
2. **Interactions** — controlled + uncontrolled paths for stateful components (`Input`, `Textarea`, `Checkbox`, `Switch`, `Radio`, `Select`), plus a "parent ignores change → state stays put" case to verify the wrapper doesn't shadow Base UI's controlled semantics. Use `@testing-library/user-event`, not `fireEvent`.

Config notes — tests are kept out of the published build (`tsconfig.json` and `vite-plugin-dts` both exclude `*.test.*` + `test-setup.ts`); `tsconfig.test.json` is a sibling project for type-checking and runs as the second half of `pnpm check-types`. `src/test-setup.ts` imports jest-dom matchers AND wires an explicit `afterEach(cleanup)` — RTL's auto-cleanup checks for `afterEach` at module-load time which vitest doesn't expose that early, so without this the DOM leaks across tests in the same file. `css: false` in `vitest.config.ts`: visual checks belong in the docs site.

### Docs `:::example` directive

Examples in MDX are authored as a remark container directive — never write `<Example>` JSX by hand. The entire pipeline lives in `apps/docs/plugins/example/`:

- `index.mjs` — remark plugin (registered in `astro.config.mjs`). Finds `:::example` blocks, pulls out the `html` and `tsx` code fences, formats both with `oxfmt`'s prettier parsers (`html` / `babel-ts`), wraps the tsx fence in a per-example FC, and rewrites the node into a renderer call.
- `Example.astro` — the renderer. Imported via the `@example` Vite alias from injected ESM.
- `ReactPreview.tsx` — single-component wrapper that keeps the React preview inside one SSR pass so Base UI context (`Field`, `RadioGroup`, `Select.Root`) reaches descendants. Don't replace it with `<slot />` or inline JSX in the renderer — Astro will compile JSX through its own runtime and sever React context.

Authoring syntax (either fence may be omitted):

````markdown
:::example

```html
<button class="btn btn-primary">Save</button>
```

```tsx
<Button variant="primary">Save</Button>
```

:::
````

The plugin wraps each tsx fence in a synthetic root for formatting, then strips and dedents. Same for the html fence. Keep that in mind if you touch the formatter helpers.

URLs in docs MUST go through `import.meta.env.BASE_URL` (e.g. `` `${import.meta.env.BASE_URL}components/buttons/` ``) — the site is served from `/admin-design-system/` on GitHub Pages.

## Adding a component

1. `packages/admin-css/src/components/<name>.css` — wrap in `@layer components { ... }`, use `@apply` with semantic tokens (`bg-primary`, `text-text-muted`, ...). If the component might host an icon, lay out the root with flex + gap so a leading `<i>`/`<svg>` works without a wrapper — see **Icons (Tabler)**.
2. Add `@import "./<name>.css";` to `packages/admin-css/src/components/index.css`.
3. (Optional) `packages/admin-react/src/<Name>.tsx` — wrap a Base UI primitive if applicable, compose class names with `clsx`, re-export from `src/index.ts` (export both the component and its types).
4. (If you added a React component) `packages/admin-react/src/<Name>.test.tsx` — at minimum a smoke test; add interaction tests for any controlled state. See the **Tests** section above.
5. `apps/docs/src/content/docs/components/<name>.mdx` — write each example as a `:::example` block with ` ```html ` and ` ```tsx ` fences. See **Docs `:::example` directive** above.

No build config changes needed for new components.

## Releasing

Bump `version` in a package's `package.json`, commit, push to `main`. `.github/workflows/release.yml` triggers on path `packages/*/package.json`, diffs the version against existing git tags, then builds + `pnpm publish --provenance` + tags `<name>@<version>` for each package that's ahead. Do not publish manually; do not amend version commits after push.

Docs deploy is a separate workflow (`deploy.yml`) — runs on every push to `main`, publishes `apps/docs/dist` to GitHub Pages.

## Conventions

- Package manager is pnpm 10.13.1, Node ≥22. `.npmrc` sets `save-exact=true` — install with exact versions, no caret ranges.
- Tailwind v4 (`@theme`, `@custom-variant`, `light-dark()`). No `tailwind.config.js` — everything is CSS.
- TypeScript strict mode + `noUncheckedIndexedAccess` + `verbatimModuleSyntax` (use `import type` for types).
- Commits follow Conventional Commits style (see `git log`).
