# CLAUDE.md

Guidance for Claude Code working in this repo.

## Project

`@aortl/admin` — a design system shipped as two npm packages from a single source of truth, plus a Starlight docs site. Under the `Digital-Udvikling` GitHub org.

- `packages/admin-css` — pre-built CSS, semantic class names (`.btn`, `.input`, `.card`, `.field`). Built from Tailwind v4 source.
- `packages/admin-react` — React component library. Wraps Base UI primitives and emits the **same class names** as `admin-css`, so vanilla HTML and React render identically.
- `apps/docs` — Astro + Starlight site with side-by-side vanilla/React tabs.

## Design philosophy

A system for **internal admin tooling**, not customer-facing surfaces. Optimize for:

- **Information density** — compact spacing, smaller defaults, tabular layouts. No "premium" padding.
- **Operator UX** — keyboard affordances, predictable focus, fast scanning, low chrome.
- **Clarity over polish** — legible type, honest borders, restrained color. No decorative gradients, oversized hero spacing, or animation flourishes.
- **Predictable primitives** — fewer variants, consistent names. A `<Button>` does what the HTML button does.

When in doubt: would this make a 12-row form on a busy admin screen _easier_ or _prettier_? Pick easier.

## Prefer the platform

Reach for modern HTML and CSS before JavaScript. No IE/legacy budget, no polyfills, no graceful fallbacks. If it can be declarative, it should be.

Use the platform for: animations (`transition`, `@keyframes`, `@starting-style`, `transition-behavior: allow-discrete`), disclosure (`<dialog>`, `popover`, `anchor-name`), accordions (`<details>` + `::details-content`), form state (`:has()`, `:user-valid`, `:placeholder-shown`, `field-sizing: content`), layout (container queries, `subgrid`, `text-wrap: balance`), scroll (`position: sticky`, `scroll-snap`, `overscroll-behavior`), color (`light-dark()`, `color-mix()`, `@property`).

Don't add `framer-motion`, `react-spring`, hand-rolled `requestAnimationFrame` loops, `ResizeObserver` for what container queries cover, or `useState` to mirror what the DOM already tracks. JavaScript is appropriate only for genuinely stateful behavior, data fetching, or things with no declarative equivalent — and even then, prefer Base UI primitives over hand-rolling.

## Commands

```fish
pnpm install
pnpm build           # admin-css → admin-react → docs (order matters)
pnpm build:css
pnpm build:react     # depends on admin-css dist
pnpm dev             # docs at http://localhost:4321, HMR into source CSS
pnpm check-types     # tsc on admin-react + astro check on docs
pnpm test            # vitest on admin-react (happy-dom + RTL)
pnpm lint            # oxlint (NOT eslint)
pnpm lint:fix
pnpm format          # oxfmt (NOT prettier)
pnpm format:check
pnpm clean
```

CI runs `lint`, `format:check`, `build`, `check-types`, `test` — replicate locally before pushing.

## Architecture

### Class names are the contract

Both packages ship the same class names. `admin-react` components are thin wrappers — each emits e.g. `class="btn btn-primary btn-sm"` via `clsx`. Vanilla CSS in `packages/admin-css/src/components/*.css` defines those classes with Tailwind `@apply`. **Both must change together** — a new CSS modifier needs a React prop, a new React prop needs a class.

Naming: `<base>` + `<base>-<variant>` + (optional) `<base>-<size>` + (optional) `<base>-<modifier>`. Sizes: `sm` / `md` (default, omitted) / `lg`.

React components wrap Base UI primitives (`@base-ui/react/button`, `/input`, `/field`) for a11y wiring, focus, validation. Compound parts use `Object.assign` dot-notation (`Card.Body`, `Field.Label`).

### High-level component + `.Container` escape hatch

When a component has a meaningful container/inner-wrapper distinction in CSS (e.g. `.card` + `.card-body`) AND shorthand props that auto-fill the wrapper:

- The default export (`<Card>`) is opinionated — always renders the inner wrapper with shorthand props (`title`, `description`, `icon`, `actions`) around children.
- `<Card.Container>` is the bare primitive — just the outer class — for layouts that don't fit the default (multiple bodies, media headers, custom dividers).

Only use this split when there's real layout variation. Leaf components (`Button`), linear layouts (`Alert`, `Sidebar.Item`), and Base UI compounds (`Field`, `Select`) don't need it.

### Icons

Recommended: **Tabler Icons** — webfont (`<i class="ti ti-name">`) for vanilla, `@tabler/icons-react` (`<IconName size={16} />`) for React. Neither package depends on Tabler directly; `apps/docs` has both as devDeps so `:::example` previews render in both tabs.

React components take an `icon` prop (and `iconTrailing` where applicable) that accepts a component reference: `<Button icon={IconPlus}>Add</Button>`. The shared `renderIcon()` helper in `src/icon.ts` renders at `size={16}` with `aria-hidden`, and also accepts pre-instantiated elements (`icon={<IconPlus size={20} />}`) when callers need to override size. Prefer this prop over passing icon JSX as children — the two render to identical DOM but the prop ensures consistent defaults.

CSS-side, components accommodate an icon as a direct child of the root (`flex items-center gap-2`, or `:has()` to switch layout when a leading `<i>`/`<svg>` is present). No wrapper class unless structurally required — `.sidebar-icon` is the exception (must stay visible in the collapsed rail).

### Token system (Flexoki, two layers)

`packages/admin-css/src/theme.css`. Two `@theme static` blocks, both registered with Tailwind so it generates utilities AND emits CSS variables:

1. **Palette** — Flexoki ramps (`--color-blue-600`, `--color-base-50`, paper, black, …). `--color-*: initial` wipes Tailwind's defaults; Flexoki is the single source of truth. Tones are absolute, identical in light/dark mode.
2. **Semantic** — purpose-named aliases (`--color-primary`, `--color-surface`, `--color-danger`, …) declared once via `light-dark()`. Dark mode swaps to Flexoki's inverted pairs (paper↔black, base-50↔base-950, accent-600↔accent-400).

**Components only reference semantic tokens, never palette tones directly** — override `--color-primary` and every component follows.

Dark mode is driven by CSS `color-scheme` on `:root`: `light dark` (OS-driven) by default; `[data-theme="dark"]` / `[data-theme="light"]` force a mode and can be scoped to any subtree. A `@custom-variant dark` block aligns Tailwind's `dark:` variant with the same rules.

### Build pipeline

Workspace order: `admin-css` (Tailwind CLI → `dist/admin.css` + `.min.css`) → `admin-react` (Vite lib mode, externals everything; then `cp ../admin-css/dist/admin.css ./dist/admin.css` for the `./styles.css` subpath export) → `docs`.

`apps/docs/src/styles/global.css` imports `admin-css` **source files**, not the built bundle, so docs share Tailwind's single compilation pass — this is what makes editing component CSS hot-reload in dev. It also pre-declares the `@layer` order explicitly so Tailwind's `components`/`utilities` layers land AFTER Starlight's — otherwise `@layer starlight.reset` overrides component sizing regardless of specificity. **Don't reorder these imports without understanding why.**

### Tests

Vitest + `@testing-library/react` on happy-dom. Tests live next to the component as `<Name>.test.tsx`.

Two shapes per component:

1. **Smoke** — one `it("renders", ...)` that mounts the component (with subparts) and asserts the root is queryable. Just "doesn't throw".
2. **Interactions** — controlled + uncontrolled paths for stateful components (`Input`, `Textarea`, `Checkbox`, `Switch`, `Radio`, `Select`), plus a "parent ignores change → state stays put" case. Use `@testing-library/user-event`, not `fireEvent`.

`src/test-setup.ts` wires an explicit `afterEach(cleanup)` — RTL's auto-cleanup checks for `afterEach` at module-load which vitest doesn't expose that early, so without this the DOM leaks across tests in the same file. Tests are excluded from the published build via `tsconfig.json` and `vite-plugin-dts`; `tsconfig.test.json` type-checks them as the second half of `pnpm check-types`. `css: false` in `vitest.config.ts` — visual checks belong in docs.

### Docs `:::example` directive

Examples in MDX are a remark container directive — never write `<Example>` JSX by hand. Pipeline in `apps/docs/plugins/example/`:

- `index.mjs` — remark plugin. Finds `:::example`, pulls `html` and `tsx` fences, formats with `oxfmt`'s prettier parsers, rewrites into a renderer call.
- `Example.astro` — the renderer, imported via the `@example` Vite alias.
- `ReactPreview.tsx` — single-component wrapper that keeps the React preview inside one SSR pass so Base UI context (`Field`, `RadioGroup`, `Select.Root`) reaches descendants. **Don't replace it with `<slot />` or inline JSX in the renderer — Astro will compile JSX through its own runtime and sever React context.**

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

URLs in docs MUST go through `import.meta.env.BASE_URL` (e.g. `` `${import.meta.env.BASE_URL}components/buttons/` ``) — the site is served from `/admin-design-system/` on GitHub Pages. In `.mdx` body prose, prefer relative Markdown links (`../../basics/icons/`) over hardcoded `/admin-design-system/...`.

### Docs writing style

Examples carry the page; prose should orient and step out of the way.

- **Frontmatter `description`** — one short sentence (≤ ~10 words). Don't restate it as the body's first paragraph. Sentence case in `title` (`App shell`, `Dark mode`, `File inputs`).
- **Subsection intros are optional** — `### Variants`, `### Sizes`, `### Disabled` usually need no prose. Add a sentence only when the example would surprise (constraint, gotcha, invariant).
- **No marketing voice, no rationale for third-party choices** — name the library, link it, move on. Skip "warm humanist sans" / "heart of the design system" framing. Trust the reader knows `<details>`, `:has()`, `color-scheme`.
- **Cross-references are tight** — `See [Icons](../../basics/icons/).` not "for the recommended library, sizing convention, and usage patterns."

Keep: code examples, a11y hooks, version-pinning, override/escape-hatch APIs, non-obvious constraints. Cut: cheerleading, restated descriptions, explanations of what the next code block plainly demonstrates.

## Adding a component

1. `packages/admin-css/src/components/<name>.css` — wrap in `@layer components { ... }`, use `@apply` with semantic tokens (`bg-primary`, `text-text-muted`). If the component might host an icon, lay out the root with flex + gap so a leading `<i>`/`<svg>` works without a wrapper.
2. Add `@import "./<name>.css";` to `packages/admin-css/src/components/index.css`.
3. (Optional) `packages/admin-react/src/<Name>.tsx` — wrap a Base UI primitive if applicable, compose with `clsx`, re-export from `src/index.ts` (component + types).
4. (If React) `packages/admin-react/src/<Name>.test.tsx` — smoke test at minimum; interaction tests for controlled state.
5. `apps/docs/src/content/docs/components/<name>.mdx` — each example as a `:::example` block.

No build config changes needed.

## Releasing

Bump `version` in a package's `package.json`, commit, push to `main`. `.github/workflows/release.yml` triggers on path `packages/*/package.json`, diffs the version against existing git tags, then builds + `pnpm publish --provenance` + tags `<name>@<version>` for each package ahead. Don't publish manually; don't amend version commits after push.

Docs deploy is a separate workflow (`deploy.yml`) — every push to `main` publishes `apps/docs/dist` to GitHub Pages.

## Conventions

- pnpm ≥10, Node ≥22. `.npmrc` sets `save-exact=true` — no caret ranges.
- Tailwind v4 (`@theme`, `@custom-variant`, `light-dark()`). No `tailwind.config.js` — everything is CSS.
- TypeScript strict + `noUncheckedIndexedAccess` + `verbatimModuleSyntax` (use `import type` for types).
- Conventional Commits.
