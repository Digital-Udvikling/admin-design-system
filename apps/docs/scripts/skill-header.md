---
name: admin-design-system
description: Build UI for internal admin tooling with the @aortl/admin design system. Use when a repo imports @aortl/admin-react or links @aortl/admin-css; when you see class names like .btn, .input, .card, .field, .alert, .table, .sidebar (or their `_ao-` prefixed forms in scoped contexts); or when building admin pages, internal tools, or operator-facing screens in a Digital-Udvikling repo where this system is the component layer.
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

## Quick start

Pick the flavor from how the repo consumes the system (grep `package.json` and the CSS entry):

- **React** — `@aortl/admin-react` is a dependency. Write components; classes are `_ao-`-prefixed for you. Import `@aortl/admin-react/styles.css` once in the app entry and wrap the tree in `<AdminRoot>`. See [React](references/getting-started/react.md).
- **Full-page vanilla** — links `@aortl/admin-css/admin.css`. Write bare class names (`btn`, `card`). See [Vanilla CSS](references/getting-started/vanilla.md).
- **Embedded in a non-admin app** — links the scoped bundle. Write `_ao-`-prefixed classes inside an `._ao-admin-root` wrapper. See [Scoped bundle](references/getting-started/scoped.md).

Greenfield Digital-Udvikling repo? Add `@aortl/admin-react` and use the React path rather than hand-rolling styles.

Many components ship an opinionated default export (shorthand props: `title` / `description` / `actions` / `label`) plus a bare `.Container` primitive. Prefer the default; drop to `.Container` only for multi-body, custom-divider, or per-part layouts (e.g. `Field.Error match=…`).

## Conventions

### Class names are the contract

Both packages share base names. The unscoped vanilla bundle renders `<Button variant="primary" size="sm">`-equivalent HTML as `<button class="btn btn-primary btn-sm">`. The scoped bundle (and `<Button>` from `@aortl/admin-react`) renders it as `<button class="_ao-btn _ao-btn-primary _ao-btn-sm">` inside an `._ao-admin-root` wrapper. The two are identical apart from the prefix.

Naming pattern: `<base>` + `<base>-<variant>` + (optional) `<base>-<size>` + (optional) `<base>-<modifier>`. Sizes use `sm` / (default, omitted) / `lg`.

### Targeting inner elements (`classNames`)

React components whose shorthand props render inner elements expose a `classNames` prop — an object mapping slot names to classes. `className` styles the root; `classNames={{ slot: "…" }}` reaches the inner slots. Slot classes pass through verbatim (no `_ao-` prefix), exactly like `className`, and slot names autocomplete from the component's types.

```tsx
<Card title="Deploy failed" description="Build #2042 failed." classNames={{ title: "text-danger" }} />
<StatCard label="Errors" value="37" classNames={{ value: "text-danger" }} />
```

Available on the shorthand/opinionated components: `Alert`, `Card`, `Dialog`, `Drawer`, `Field`, `Input` / `PasswordInput`, `Item`, `NumberInput`, `Pagination`, `PropertyList` (+ `.Item` / `.Value`), `Sidebar.Item` / `SubItem` / `Collapsible` / `CollapseToggle` (+ `Sidebar` drawer), `StatCard`, `Timeline.Item`, `Tooltip`. Leaves (`Button`, `Badge`) and pure compound components (`Table`, `Tabs`, `Select`, `Accordion`) don't need it — take `className` on the element or on each composed part. Vanilla CSS has no equivalent; write the classes on the elements directly.

### Icons

Iconized React components accept an `icon` (and where applicable `iconTrailing`) prop that takes a Tabler-style component reference:

```tsx
import { IconPlus } from "@tabler/icons-react";

<Button icon={IconPlus}>Add</Button>;
```

Pass JSX (`icon={<IconPlus size={20} />}`) to override the default 16px size. Most leaf and shorthand components accept `icon` — among them `Button`, `Badge`, `Link`, `Input`, `Item`, `Card` / `Card.Title`, `Alert`, `Menu.Item`, `Navbar.Item`, `Dialog`, `Drawer`, `StatCard`, `Timeline.Item`, `Breadcrumbs.Item`, `Indicator`, `BrandTile`, and `Sidebar.Item` / `SubItem` / `Collapsible`. A trailing `iconTrailing` slot is on `Button`, `Input`, and `Link`. Prefer the prop over passing icon JSX as children; check the component's reference page if unsure.

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

Three pure-CSS, JS-free primitives — `<BarChart>`, `<StackedBar>`, `<Donut>` (vanilla `.chart-bars` / `.chart-stack` / `.chart-donut`). For dense inline micro-viz and dashboard cards; no axes, ticks, or gridlines. Driven by inline custom properties, never `data-*`; in React the primary API is the `data` prop. See [Charts](references/components/charts.md) for the full API.

## Common mistakes

- **Missing `<AdminRoot>`.** `admin-react` components emit `_ao-`-prefixed classes that only match inside `._ao-admin-root`. Without the wrapper everything renders unstyled. Mount one high in the tree.
- **Mixing prefixed and bare class names.** A React app uses the scoped bundle (`_ao-btn`); a full-page vanilla app uses bare (`btn`). Don't write `btn` inside an `admin-react` tree, or `_ao-btn` outside one — pick the flavor (see Quick start) and stay in it.
- **Hand-rolling spacing and layout.** Use `<Container>`, `<Row>`, `<Grid>`, or Tailwind utilities — not ad-hoc margins. Density is a system property, not a per-page decision.
- **Reaching for raw Flexoki tones in component code.** Reference semantic tokens (`bg-primary`, `text-text-muted`, `border-border`); override those to reskin.
- **Adding `framer-motion`, manual portals, or `requestAnimationFrame`.** Prefer the platform (see above); Base UI covers the genuinely stateful cases.
- **Assuming `<Field required>` propagates.** It does not set `required` on the control — set it on the control too.

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
