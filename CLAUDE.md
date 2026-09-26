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
pnpm test            # vitest: admin-react (happy-dom + RTL) + admin-css build scripts
pnpm lint            # oxlint (NOT eslint)
pnpm lint:fix
pnpm format          # oxfmt (NOT prettier)
pnpm format:check
pnpm check-docs      # links, anchors, Reference classes vs CSS and props vs React types, tsx examples type-check, vanilla/React class parity
pnpm check-a11y      # axe (WCAG 2.2 A/AA) on every example, vanilla + React × light + dark, closed and with overlays open; needs pnpm build
pnpm check-package   # pack both packages: publint, attw, install the tarballs, import (plain + react-server), resolve CSS subpaths; needs pnpm build
pnpm generate-skill  # regenerate skills/ from the docs MDX
pnpm render components/buttons.mdx:42   # PNG of an example: vanilla + React × light + dark (--help)
pnpm visual-diff <base-dist> <head-dist>  # screenshot every example in two docs builds, report the changed ones (--help)
pnpm clean
```

CI runs `lint`, `format:check`, `build`, `check-package`, the skill drift check (`generate-skill` + `git diff --exit-code -- skills`), `check-docs --require-build --strict-coverage`, `check-a11y`, `check-types`, `test` — replicate locally before pushing.

## Architecture

### Class names are the contract

`admin-css` and `admin-react` share the same base class names — `btn`, `card`, `input`, etc. — defined in `packages/admin-css/src/components/*.css` via Tailwind `@apply`. **Both must change together** — a new CSS modifier needs a React prop, a new React prop needs a class. `check-docs` enforces it per example: each `tsx` fence is server-rendered and must use the same admin classes as its `html` fence, all `_ao-`-prefixed.

Naming: `<base>` + `<base>-<variant>` + (optional) `<base>-<size>` + (optional) `<base>-<modifier>`. Sizes: `sm` / `md` (default, omitted) / `lg`.

Two output forms ship from one source:

- **Unscoped, unprefixed** (`@aortl/admin-css/admin.css`) — class names are bare (`.btn`, `.card`). For full-page admin apps that own the document. Hand-written HTML uses these names directly.
- **Scoped, prefixed** (`@aortl/admin-css/admin.scoped.css`, also re-exported as `@aortl/admin-react/styles.css`) — every selector is wrapped in `@scope (._ao-admin-root)` and every class is prefixed `_ao-` (`._ao-btn`, `._ao-card`). The build script `packages/admin-css/scripts/wrap-scoped.mjs` derives this from the unscoped bundle. **`admin-react` always uses this variant** — components emit `_ao-`-prefixed classes via the `cn` helper in `packages/admin-react/src/cn.ts`, and `<AdminRoot>` (which renders `class="_ao-admin-root"`) is required.

In React source you still write the bare name (`cn("btn", className)`); `cn` adds the prefix at render time. The consumer-supplied `className` prop is passed through verbatim — only admin's own classes carry the prefix. Tests assert on the prefixed form (`expect(el).toHaveClass("_ao-btn")`). `admin.css` ships no Tailwind utilities (`source(none)`), so `cn` must only name classes defined in `components/*.css` — `cn("sr-only")` renders `_ao-sr-only` with no rule behind it.

React components wrap Base UI primitives (`@base-ui/react/button`, `/input`, `/field`) for a11y wiring, focus, validation. Compound parts use `Object.assign` dot-notation (`Card.Body`, `Field.Label`).

### Server Components

Every export must work in a React Server Component. A module gets `"use client"` only when it calls a hook, creates a context, or creates a function prop (an event handler on any element, or a render function for Base UI). A module that only other `"use client"` modules import needs none. The client part goes in `<Name>.client.tsx` beside the public `<Name>.tsx`. Compound assembly and `renderIcon` stay in the directive-free module: a server import of a `"use client"` module sees opaque references, and a component-reference icon can't cross into a client component. When the root itself is client (`AppShell`, `Sidebar`), the directive-free module attaches the parts to the imported root. `Pagination` is the one exception: its handlers only wrap the consumer's `onPageChange`, and a server parent uses `renderItem`. `src/server-components.test.ts` checks these rules; the build fails if a `"use client"` module doesn't end up as its own `dist/` file with the directive.

### High-level component + `.Container` escape hatch

When a component has a meaningful container/inner-wrapper distinction in CSS (e.g. `.card` + `.card-body`) AND shorthand props that auto-fill the wrapper:

- The default export (`<Card>`) is opinionated — always renders the inner wrapper with shorthand props (`title`, `description`, `icon`, `actions`) around children.
- `<Card.Container>` is the bare primitive — just the outer class — for layouts that don't fit the default (multiple bodies, media headers, custom dividers).

Only use this split when there's real layout variation. Leaf components (`Button`), linear layouts (`Alert`, `Sidebar.Item`), and Base UI compounds (`Field`, `Select`) don't need it.

### Icons

Recommended: **Tabler Icons** — webfont (`<i class="ti ti-name">`) for vanilla, `@tabler/icons-react` (`<IconName size={16} />`) for React. Neither package depends on Tabler directly; `apps/docs` has both as devDeps so `:::example` previews render in both tabs.

React components take an `icon` prop (and `iconTrailing` where applicable) that accepts a component reference: `<Button icon={IconPlus}>Add</Button>`. The shared `renderIcon()` helper in `src/icon.ts` renders at `size="1em"` with `aria-hidden` (so SVG icons inherit the host `font-size`, matching the Tabler webfont in the vanilla bundle), and also accepts pre-instantiated elements (`icon={<IconPlus size={20} />}`) when callers need to override size. Prefer this prop over passing icon JSX as children — the two render to identical DOM but the prop ensures consistent defaults.

CSS-side, components accommodate an icon as a direct child of the root (`flex items-center gap-2`, or `:has()` to switch layout when a leading `<i>`/`<svg>` is present). No wrapper class unless structurally required — `.sidebar-icon` is the exception (must stay visible in the collapsed rail).

### Token system (Flexoki, two layers)

`packages/admin-css/src/theme.css`. Two `@theme static` blocks, both registered with Tailwind so it generates utilities AND emits CSS variables:

1. **Palette** — Flexoki ramps (`--color-blue-600`, `--color-base-50`, paper, black, …). `--color-*: initial` wipes Tailwind's defaults; Flexoki is the single source of truth. Tones are absolute, identical in light/dark mode.
2. **Semantic** — purpose-named aliases (`--color-primary`, `--color-surface`, `--color-danger`, …) declared once via `light-dark()`. Dark mode swaps to Flexoki's inverted pairs (paper↔black, base-50↔base-950, accent-600↔accent-400).

**Components only reference semantic tokens, never palette tones directly** — override `--color-primary` and every component follows.

Dark mode is driven by CSS `color-scheme` on `:root`: `light dark` (OS-driven) by default; `[data-theme="dark"]` / `[data-theme="light"]` force a mode and can be scoped to any subtree. A `@custom-variant dark` block aligns Tailwind's `dark:` variant with the same rules.

### Build pipeline

Workspace order: `admin-css` (Tailwind CLI → `dist/admin.css` + `.min.css`) → `admin-react` (Vite lib mode, ESM only, one `.js` + `.d.ts` per source module, externals everything; then `cp ../admin-css/dist/admin.scoped.css ./dist/admin.scoped.css` for the `./styles.css` subpath export) → `docs`.

`apps/docs/src/styles/global.css` imports `admin-css` **source files**, not the built bundle, so docs share Tailwind's single compilation pass — this is what makes editing component CSS hot-reload in dev. It also pre-declares the `@layer` order explicitly so Tailwind's `components`/`utilities` layers land AFTER Starlight's — otherwise `@layer starlight.reset` overrides component sizing regardless of specificity. **Don't reorder these imports without understanding why.** The scoped bundle for React previews is also compiled from source: `customCss` imports `@aortl/admin-css/src/admin.css?scoped`, and `apps/docs/plugins/admin-scoped.mjs` runs `wrap()` on Tailwind's output and puts it in `@layer admin`. So `pnpm dev` and the docs build never read `admin-css/dist`.

### Tests

Vitest + `@testing-library/react` on happy-dom. Tests live next to the component as `<Name>.test.tsx`.

Two shapes per component:

1. **Smoke** — one `it("renders", ...)` that mounts the component (with subparts) and asserts the root is queryable. Just "doesn't throw".
2. **Interactions** — controlled + uncontrolled paths for stateful components (`Input`, `Textarea`, `Checkbox`, `Switch`, `Radio`, `Select`), plus a "parent ignores change → state stays put" case. Use `@testing-library/user-event`, not `fireEvent`.

`src/test-setup.ts` wires an explicit `afterEach(cleanup)` — RTL's auto-cleanup checks for `afterEach` at module-load which vitest doesn't expose that early, so without this the DOM leaks across tests in the same file. Tests are excluded from the published build via `tsconfig.json` and `vite-plugin-dts`; `tsconfig.test.json` type-checks them as the second half of `pnpm check-types`. `css: false` in `vitest.config.ts` — visual checks belong in docs.

To see a CSS or component change, run `pnpm render <page>.mdx:<line>` and read the PNG it prints. `--click <selector>` opens dialogs, menus and popovers first. `--probe <selector> --props width,color` prints computed styles for each cell, which is cheaper than reading an image when you're checking a number. The render is static apart from the clicks, so hover, focus-visible and Safari quirks still need `pnpm dev` and a browser.

Every PR touching `packages/` or `apps/docs/` also gets the `Visual report` workflow (`.github/workflows/visual-report.yml`): it builds the docs for base and head, runs `pnpm visual-diff` on both with the runner's Chrome, and puts the changed examples in the job summary and before/after/diff PNGs in the `visual-diff` artifact. It is a report, not a gate; it fails only when a build or capture breaks.

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

**React-only features** (clipboard access, `useState`/`setTimeout`-driven UI — anything the vanilla bundle can't replicate without consumer-written JS): drop the `html` fence so the example shows only the React preview, and flag the heading with Starlight's `<Badge>` aliased to avoid colliding with the admin `<Badge>`:

```mdx
import { Badge as StarlightBadge } from "@astrojs/starlight/components";

### Copyable <StarlightBadge text="React only" variant="caution" />
```

Keep the underlying CSS classes shipping in both bundles — consumers wiring their own vanilla JS still rely on the styling.

URLs in docs MUST go through `import.meta.env.BASE_URL` (e.g. `` `${import.meta.env.BASE_URL}components/buttons/` ``) — the site is served from `/admin-design-system/` on GitHub Pages. In `.mdx` body prose, prefer relative Markdown links (`../../basics/icons/`) over hardcoded `/admin-design-system/...`.

### Docs writing style

`apps/docs/src/content/docs/contributing/*.mdx` is canonical for page shape and prose; when it and this file disagree, correct this file.

Examples carry the page; prose should orient and step out of the way.

- **Frontmatter `description`** — one short sentence (≤ ~10 words). Don't restate it as the body's first paragraph. Sentence case in `title` (`App shell`, `Dark mode`, `File inputs`).
- **Subsection intros are optional** — `### Variants`, `### Sizes`, `### Disabled` usually need no prose. Add a sentence only when the example would surprise (constraint, gotcha, invariant).
- **No marketing voice, no rationale for third-party choices** — name the library, link it, move on. Skip "warm humanist sans" / "heart of the design system" framing. Trust the reader knows `<details>`, `:has()`, `color-scheme`.
- **Voice is flat and factual** — no rhetorical color. Purge antithesis ("X rather than Y", "isn't just X, it's Y"), rule-of-three flavor triads, anthropomorphism ("digits don't shimmy", "segments breathe"), marketing intensifiers ("the fastest way", "the simplest path"), empty reassurance ("text stays readable", "visible at a glance", "which is the right outcome"), and soft hedges ("most likely", "probably"). Keep an em-dash only for a real list or aside that adds information, never to tack on an editorializing clause. Delete `###` intros that only narrate the adjacent example.
- **Consumer pages carry the contract, not the plumbing** — document what a consumer needs (class-name parity, the `_ao-` scope, version pinning, props), but keep build/repo mechanics (the remark pipeline, virtual modules, `wrap-scoped.mjs`, `@layer` ordering) on `contributing/` pages.
- **Cross-references are tight** — `See [Icons](../../basics/icons/).` not "for the recommended library, sizing convention, and usage patterns."

Keep: code examples, a11y hooks, version-pinning, override/escape-hatch APIs, non-obvious constraints. Cut: cheerleading, restated descriptions, explanations of what the next code block plainly demonstrates.

## Adding a component

1. `packages/admin-css/src/components/<name>.css` — wrap in `@layer components { ... }`, use `@apply` with semantic tokens (`bg-primary`, `text-text-muted`). If the component might host an icon, lay out the root with flex + gap so a leading `<i>`/`<svg>` works without a wrapper.
2. Add `@import "./<name>.css";` to `packages/admin-css/src/components/index.css`.
3. (Optional) `packages/admin-react/src/<Name>.tsx` — wrap a Base UI primitive if applicable, compose classes with `cn` (not bare `clsx`), re-export from `src/index.ts` (component + types). Parts that call hooks or define handlers go in `<Name>.client.tsx` (see [Server Components](#server-components)).
4. (If React) `packages/admin-react/src/<Name>.test.tsx` — smoke test at minimum; interaction tests for controlled state.
5. `apps/docs/src/content/docs/components/<name>.mdx` — `## Examples` (one `###` + `:::example` per variation), then `## Reference` with `### React` and `### Vanilla` tables; the Vanilla table lists every class the CSS defines. Run what CI runs: `pnpm build && pnpm --filter docs check-docs -- --require-build --strict-coverage`.
6. `pnpm generate-skill` to regenerate the agent-skill bundle from the new MDX. CI verifies the bundle is in sync via `git diff --exit-code -- skills`, so a forgotten regen turns into a red build.
7. Add a bullet under `## [Unreleased]` in `CHANGELOG.md` (see [Changelog](#changelog)).

No build config changes needed.

## Agent skill bundle

The repo ships an Agent Skill at `skills/admin-design-system/` (see [getting-started/skill/](apps/docs/src/content/docs/getting-started/skill.mdx) for install instructions). It is **generated** — committed but produced by `apps/docs/scripts/generate-skill.mjs` walking `apps/docs/src/content/docs/**/*.mdx` and writing per-page markdown plus a top-level `SKILL.md`. CI re-runs the generator and fails on drift, so:

- **After any change under `apps/docs/src/content/docs/`** (new component page, edited examples, new section): run `pnpm generate-skill` and commit the updated `skills/` alongside your MDX change. Same commit. CI catches it if you forget.
- **When introducing a new system-wide convention** (a new prop pattern, a new token layer, a new "prefer the platform" rule, a different way to compose primitives): edit `apps/docs/scripts/skill-header.md`. That file is the hand-curated header of `SKILL.md` and holds everything that isn't per-component reference material — frontmatter, "when to use this skill" trigger, conventions, the "When nothing fits" gap procedure. Then run `pnpm generate-skill`.
- **When the transform logic needs to change** (a new MDX directive to handle, a new piece of Starlight JSX to strip, a different output layout): edit `apps/docs/scripts/generate-skill.mjs`. The script is deterministic — no timestamps, sorted file enumeration — so `git diff --exit-code` is a meaningful staleness check.

`skills/` is in `.oxfmtrc.json`'s `ignorePatterns` because it's a generated artifact. `apps/docs/scripts/skill-header.md` is NOT ignored — oxfmt formats it as normal markdown.

## Changelog

Root `CHANGELOG.md`, [Keep a Changelog](https://keepachangelog.com/) format. **One file for both packages** — they share a version and release together; tag each entry `(css)` / `(react)` / `(both)` to show which dep a consumer bumps. It is hand-curated, not generated from commits: every PR with a consumer-visible change adds a bullet under `## [Unreleased]` (the Conventional Commit prefix maps to the H3 — `feat:` → Added, `fix:` → Fixed). Skip docs-only and internal changes.

The docs changelog page (`apps/docs/src/pages/changelog.astro`) imports the root `CHANGELOG.md` via the `@changelog` Vite alias (typed by the ambient `apps/docs/src/changelog.d.ts`) and renders it inside Starlight's `<StarlightPage>`, passing `getHeadings()` so the version TOC populates — no copy step, no generated file. The file has no top-level `# Changelog` heading; the page title supplies it. Each package also ships a copy in its npm tarball via a `prepack` step (gitignored as `packages/*/CHANGELOG.md`).

`CHANGELOG.md` is in `.oxfmtrc.json`'s `ignorePatterns`: the keep-a-changelog release plugin owns its formatting, and oxfmt (which also formats markdown) disagrees with the plugin's compare-link spacing — so the release plugin is the single formatter.

## Releasing

Run `pnpm release` (interactive: pick patch/minor/major; `pnpm release minor` skips the prompt). It uses **release-it** (`.release-it.json` + `@release-it/keep-a-changelog`) to, in one step:

1. compute the next version and cut `## [Unreleased]` into a dated `## [x.y.z]` section with a fresh Unreleased and updated compare links (the keep-a-changelog plugin);
2. bump the root `package.json` (the canonical release pointer, though root is private) and write the same version into both packages' `package.json` (the bumper plugin — JSON mode, which matches oxfmt's `package.json` formatting, so no reformat step is needed);
3. commit (`chore(release): v${version}`) and push to `main`.

release-it does **not** publish, tag, or create the GitHub release — that stays in CI. On the pushed commit, `.github/workflows/release.yml` triggers on path `packages/*/package.json`, asks npm (`npm view <name>@<version>`) whether each package's version is already published, and for every package that isn't: gates on `grep`-ing the `## [version]` section out of `CHANGELOG.md` (catches a hand-bump that bypassed `pnpm release`, **before** the irreversible publish) alongside lint/format/build/types/test, then builds + `npm publish --provenance`, pushes one shared umbrella `v<version>` tag (the target of the compare links; there are no per-package tags), and cuts a GitHub Release from that version's changelog section. Don't publish manually.

Docs deploy is a separate workflow (`deploy.yml`) — every push to `main` publishes `apps/docs/dist` (including the changelog page) to GitHub Pages.

## Conventions

- pnpm ≥10, Node ≥22. `.npmrc` sets `save-exact=true` — no caret ranges, except `@base-ui/react` in `admin-react`'s `dependencies`: an exact pin gives a consumer that also uses Base UI a second copy, and Base UI context doesn't cross copies.
- Tailwind v4 (`@theme`, `@custom-variant`, `light-dark()`). No `tailwind.config.js` — everything is CSS.
- TypeScript strict + `noUncheckedIndexedAccess` + `verbatimModuleSyntax` (use `import type` for types).
- Conventional Commits.
