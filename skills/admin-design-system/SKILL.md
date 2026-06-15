---
name: admin-design-system
description: Build UI for internal admin tooling in Digital-Udvikling projects. Use when working in a Digital-Udvikling repo on admin pages, internal tools, or operator-facing screens; when files import @aortl/admin-react or link @aortl/admin-css; or when seeing class names like .btn, .input, .card, .field, .alert, .table, .sidebar (or their `_ao-` prefixed forms in scoped contexts).
---

# aortl admin design system

A small, opinionated design system for internal admin tooling. Ships as two packages from one source of truth:

- `@aortl/admin-css` — pre-built CSS. The default bundle uses bare class names (`.btn`, `.input`, `.card`, `.field`) for full-page admin apps that own the document. A parallel scoped bundle (`@aortl/admin-css/admin.scoped.css`) wraps everything in `@scope (._ao-admin-root)` and prefixes every class with `_ao-`, for embedding inside non-admin pages.
- `@aortl/admin-react` — React components wrapping Base UI primitives. Always emits `_ao-`-prefixed class names and requires `<AdminRoot>` (which renders `class="_ao-admin-root"`) somewhere up the tree. `@aortl/admin-react/styles.css` resolves to the scoped+prefixed bundle.

Vanilla HTML and React render at the same DOM positions and behave identically — the only difference is whether the class names carry the `_ao-` prefix.

## When to use this skill

- The codebase imports from `@aortl/admin-react` or links `@aortl/admin-css`.
- The user asks for a component, form, layout, or admin page in this design system.
- You're building UI for an internal admin tool at Digital-Udvikling — even if the design system isn't installed yet, prefer adding it over hand-rolling component styles.

This system is for **internal admin tooling**, not customer-facing marketing surfaces. Optimize for information density, operator UX, and clarity over polish. When in doubt: would this make a 12-row form on a busy admin screen _easier_ or _prettier_? Pick easier.

## Conventions

### Class names are the contract

Both packages share base names. The unscoped vanilla bundle renders `<Button variant="primary" size="sm">`-equivalent HTML as `<button class="btn btn-primary btn-sm">`. The scoped bundle (and `<Button>` from `@aortl/admin-react`) renders it as `<button class="_ao-btn _ao-btn-primary _ao-btn-sm">` inside an `._ao-admin-root` wrapper. The two are identical apart from the prefix.

Naming pattern: `<base>` + `<base>-<variant>` + (optional) `<base>-<size>` + (optional) `<base>-<modifier>`. Sizes use `sm` / (default, omitted) / `lg`.

### Icons

Iconized React components accept an `icon` (and where applicable `iconTrailing`) prop that takes a Tabler-style component reference:

```tsx
import { IconPlus } from "@tabler/icons-react";

<Button icon={IconPlus}>Add</Button>;
```

Pass JSX (`icon={<IconPlus size={20} />}`) to override the default 16px size. Components currently exposing this prop: `Button`, `Menu.Item`, `Card` / `Card.Title`, `Navbar.Item`, `Alert`, `Sidebar.Item` / `SubItem` / `Collapsible`.

Vanilla CSS uses the Tabler webfont directly: `<button class="btn btn-primary"><i class="ti ti-plus"></i> Add</button>` (or `_ao-btn _ao-btn-primary` inside an `._ao-admin-root` wrapper).

### Tokens (two layers)

1. **Flexoki palette tones** — absolute colors (`--color-blue-600`, `--color-base-50`). Identical in light/dark.
2. **Semantic aliases** — purpose names (`--color-primary`, `--color-surface`, `--color-danger`) declared via `light-dark()`. Components reference only semantic tokens.

Override semantic tokens to reskin the system; never reference Flexoki tones directly from component code.

### Dark mode

Driven entirely by CSS `color-scheme` and `[data-theme]`:

- `:root { color-scheme: light dark }` — OS-driven by default.
- `[data-theme="dark"]` / `[data-theme="light"]` — forced, scopable to any subtree.

No JS toggle needed.

### Use Tailwind utilities for layout when Tailwind is active

If the host application uses Tailwind v4 — check `package.json` for `tailwindcss` or look for `@import "tailwindcss"` in a CSS entry — reach for utility classes for spacing, flex/grid, and one-off layout: `flex items-center gap-2`, `grid grid-cols-3`, `mt-4`. The design system's semantic tokens (`bg-primary`, `text-text-muted`, `border-border`) are wired through Tailwind, so utilities and component classes compose freely on the same element.

For vanilla / no-build contexts (Jinja, Go templates, plain HTML) the package ships a second pre-built bundle, `@aortl/admin-css/admin.utilities.css`, containing a curated subset of Tailwind-grammar utilities (layout, flex/grid, spacing, sizing, typography, borders, semantic colors). Drop it in alongside `admin.css`. Semantic colors only (`bg-primary`, `text-danger`) — no raw Flexoki tones in utility form. The React package does not consume this bundle; in `@aortl/admin-react` contexts, prefer component props (`<Card>`, `<Button>`) and component composition over utility classes.

### Keyboard shortcuts

`<Button>` and `<Menu.Item>` accept a `hotkey` prop (`<Button hotkey="mod+s">Save</Button>`) that fires `onClick` on the matching chord and renders a trailing `<Kbd>` chip. For shortcuts not tied to a visible control, use `useHotkey("?", openHelp)` from `@aortl/admin-react`. `<Kbd keys="mod+s" />` renders the matching visual for tooltips and help dialogs. `mod` resolves to `Cmd` on macOS and `Ctrl` on every other platform.

### Prefer the platform

Admin users run current browsers — there is no legacy budget. Reach for modern HTML and CSS before reaching for JavaScript.

- Disclosure: `<details>` + `<summary>` with `interactivity: inert` and `::details-content`.
- Modals: `<dialog>` + `showModal()`.
- Popovers / tooltips / menus: `popover` attribute + `anchor-name` / `position-anchor`.
- Animations: CSS `transition`, `@keyframes`, `@starting-style`, `transition-behavior: allow-discrete`.
- Form state: `:has()`, `:user-valid`, `:user-invalid`, `:placeholder-shown`, `field-sizing: content`.
- Layout: container queries, `subgrid`, `aspect-ratio`, `text-wrap: balance`.

Don't pull in `framer-motion`, manual portals, or `requestAnimationFrame` loops. Base UI handles the cases where JS is genuinely needed.

### Charts

Three pure-CSS, JS-free primitives — `<BarChart>`, `<StackedBar>`, `<Donut>` (vanilla `.chart-bars` / `.chart-stack` / `.chart-donut`, all under the shared `.chart` base). No axes, ticks, or gridlines; they serve dense inline micro-viz and compact dashboard cards. Data is driven by inline custom properties, never `data-*` (CSS can't read an attribute as a number for `calc()` cross-browser):

- **Bars** — container `style="--chart-max: <n>"` (default 100), each bar `style="--value: <n>"`; the fill sizes to `calc(var(--value) / var(--chart-max) * 100%)`. Horizontal by default (label gutter + aligned value column); add `.chart-bars-vertical` for columns. Single-series only.
- **Proportion bar** — `.chart-stack` flex row; each `.chart-segment` takes `style="--value: <n>"` and is sized by its flex ratio (no max).
- **Donut/pie** — one cumulative `conic-gradient` stop string in `style="--donut-segments: …"`; the hole is a radial-gradient mask sized by `--donut-thickness` (`.chart-donut-pie` for a solid pie). The centre label is a sibling overlay in `.chart-donut-figure`, never a child of the masked ring.

Colour: single-series follows `currentColor` (`--color-primary`, plus `.chart-success` / `-warning` / `-danger` / `-info`). Multi-series colours are set inline per element (`--bar-color` / `--segment-color` / legend `--legend-color`) — there is no chart token layer. React cycles a `SERIES` constant of existing Flexoki palette tokens (`var(--color-blue-500)`, `var(--color-orange-400)`, …) by index, overridable per datum via `color`; vanilla copies the same sequence so both bundles match.

In React the primary API is the `data` prop (`data={[{ label?, value, color? }]}`), which computes the max, builds the donut string, and generates an overridable `aria-label`. Each component also exposes a `.Container` (or `.Track` / `.Figure`) plus part subcomponents for hand-composed layouts, mirroring the `Card` / `Card.Container` split. Roots carry `role="img"`; bars and stack segments carry a native `title` (the donut's per-slice read-out lives on the legend rows). Bars and segments transition over 200ms on value change; `prefers-reduced-motion` removes it.

## Contributing back

When building a non-trivial component or module that's likely to recur across admin tools — a richer table layout, a specific form pattern, a custom navbar variant — pause and consider whether it belongs upstream in [`Digital-Udvikling/admin-design-system`](https://github.com/Digital-Udvikling/admin-design-system) rather than duplicated locally.

Good candidates:

- Composes existing primitives but adds enough structure to be worth naming.
- A teammate would plausibly want the same thing in another internal tool.
- Fits the system's density-first philosophy.

Sketch locally first, then propose upstream as a PR. The single-source-of-truth pattern (vanilla CSS classes mirrored in React) means each contribution lands in both flavors automatically.

## How to use the references

The `references/` folder contains one markdown file per docs page. Each contains paired `html` and `tsx` code blocks showing both flavors for every documented variant.

Read references **on demand** — do not pre-load. The index below lists every available file.

## Reference index

### Getting started

- [Agent skill](references/getting-started/skill.md) — Install the design system as an Agent Skill.
- [React](references/getting-started/react.md) — Thin React wrappers around Base UI primitives, scoped to <AdminRoot>.
- [Scoped bundle](references/getting-started/scoped.md) — Drop admin styles into a non-admin app without colliding on class names.
- [Tailwind](references/getting-started/tailwind.md) — Drop the design system into an existing Tailwind v4 project.
- [Vanilla CSS](references/getting-started/vanilla.md) — One pre-built stylesheet, no build tooling required.

### Basics

- [Colors](references/basics/colors.md) — Color tokens — brand, surfaces, borders, text, and state.
- [Customize](references/basics/customize.md) — Brand-shift the design system with one variable, or override individual tokens.
- [Dark mode](references/basics/dark-mode.md) — Follows the OS by default, with manual override per page or subtree.
- [Hotkeys](references/basics/hotkeys.md) — Bind keyboard shortcuts to page-level actions.
- [Icons](references/basics/icons.md) — Tabler Icons — webfont for vanilla, typed components for React.
- [Principles](references/basics/principles.md) — What this system optimizes for.
- [Typography](references/basics/typography.md) — Type scale, weights, and font stack.

### Components

- [Accordions](references/components/accordions.md) — Disclosure rows built on <details>.
- [Alerts](references/components/alerts.md) — Inline notifications for errors, confirmations, and contextual feedback.
- [Avatar](references/components/avatar.md) — Image with a no-JS initials fallback, plus a group stack.
- [Badges](references/components/badges.md) — Compact status indicator for tags and counts.
- [Brand tile](references/components/brand-tile.md) — A monogram, icon, or logo square for the navbar.
- [Breadcrumbs](references/components/breadcrumbs.md) — Trail of links to ancestor pages, ending in the current page.
- [Buttons](references/components/buttons.md) — Buttons with variants, sizes, icons, and loading state.
- [Cards](references/components/cards.md) — A container with optional title, description, and actions.
- [Charts](references/components/charts.md) — Pure-CSS bar, proportion, and donut primitives.
- [Code blocks](references/components/code-blocks.md) — Styled <pre> for logs, JSON, and terminal output.
- [Container](references/components/container.md) — A centered, max-width page region that spaces its sections.
- [Dialogs](references/components/dialog.md) — Modal dialogs built on the native dialog element.
- [Forms](references/components/forms/index.md) — Input controls and composition primitives.
- [Forms: Checkboxes](references/components/forms/checkboxes.md) — Independent on/off toggles.
- [Forms: Fields](references/components/forms/fields.md) — Accessibility wiring (label, description, validation) around inputs.
- [Forms: File inputs](references/components/forms/file-inputs.md) — File picker styled to match other inputs.
- [Forms: Input groups](references/components/forms/input-groups.md) — Combine inputs, addons, and buttons into a flush row.
- [Forms: Inputs](references/components/forms/inputs.md) — Single-line text input.
- [Forms: Radios](references/components/forms/radios.md) — Mutually exclusive choice within a group.
- [Forms: Selects](references/components/forms/selects.md) — Compound Select with Trigger + Popup + Item.
- [Forms: Switches](references/components/forms/switches.md) — Immediate on/off setting.
- [Forms: Textareas](references/components/forms/textareas.md) — Multi-line text input.
- [Grid](references/components/grid.md) — Two-dimensional layouts with grid utilities.
- [Indicator](references/components/indicator.md) — Place a badge, count, or dot on the corner of another element.
- [Kbd](references/components/kbd.md) — Keyboard shortcut chips for help text, tooltips, and bindings.
- [Links](references/components/links.md) — Styled text links with an optional external affordance.
- [Menus](references/components/menus.md) — Dropdown action menu.
- [Pagination](references/components/pagination.md) — Numbered page navigation with prev/next controls.
- [Progress](references/components/progress.md) — Styled native <progress> element.
- [Property list](references/components/property-list.md) — Label-and-value rows for one-entity-N-attributes panels.
- [Prose](references/components/prose.md) — Styling for rendered markdown and other HTML you don't control.
- [Row](references/components/row.md) — One-dimensional layouts with flex utilities.
- [Separator](references/components/separator.md) — A styled hr with an optional vertical modifier.
- [Spinners](references/components/spinners.md) — Compact CSS-only loading indicator.
- [Stat cards](references/components/stat-cards.md) — Compact KPI tile with label, value, and detail.
- [Tables](references/components/tables.md) — Native table with row selection, sticky headers, and row links.
- [Tabs](references/components/tabs.md) — Section a view into named panels.
- [Tooltips](references/components/tooltip.md) — Transient hints anchored to a trigger.

### Modules

- [App shell](references/modules/app-shell.md) — Page chrome — navbar, optional sidebar, optional footer — around a main content area.
