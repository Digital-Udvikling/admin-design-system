---
name: admin-design-system
description: Build UI for internal admin tooling with the @aortl/admin design system. Use when a repo imports @aortl/admin-react or links @aortl/admin-css; when you see class names like .btn, .input, .card, .field, .alert, .table, .sidebar (or their `_ao-` prefixed forms in scoped contexts); or when building admin pages, internal tools, or operator-facing screens in a Digital-Udvikling repo where this system is the component layer.
---

# aortl admin design system

Generated for `@aortl/admin` 0.21.0. If the repo depends on, or pins an unpkg URL to, a different `@aortl/*` version, tell the user to update this skill (`npx skills update`, or `/plugin marketplace update digital-udvikling`) before trusting the references: props and classes may differ.

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

Form controls take `variant` `bordered` or `ghost` only; invalid is a state. Mark a control invalid with `aria-invalid="true"` or an invalid `Field` (`error` / `invalid`); `:user-invalid` covers native constraints. There is no `input-danger`.

### Router links (`render`)

To render a link-like component as your router's link, pass the link element as `render`: `<Sidebar.Item current render={<NextLink href="/orders" />}>Orders</Sidebar.Item>`. The component's classes, `aria-current` and children land on your element. `Navbar.Item`, `Sidebar.Item` / `SubItem`, `Breadcrumbs.Item`, `Link`, `Badge`, `Card.Container`, `Item` and `Menu.Item` take it; `Button` also needs `nativeButton={false}`. Never copy `_ao-` classes onto your own link instead.

### Targeting inner elements (`classNames`)

React components whose shorthand props render inner elements expose a `classNames` prop — an object mapping slot names to classes. `className` styles the root; `classNames={{ slot: "…" }}` reaches the inner slots. Slot classes pass through verbatim (no `_ao-` prefix), exactly like `className`, and slot names autocomplete from the component's types.

```tsx
<Card title="Deploy failed" description="Build #2042 failed." classNames={{ title: "text-danger" }} />
<StatCard label="Errors" value="37" classNames={{ value: "text-danger" }} />
```

Available on the shorthand/opinionated components: `Alert`, `Card`, `Dialog`, `Drawer`, `Field`, `Input` / `PasswordInput`, `Item`, `Navbar.Dropdown`, `NumberInput`, `Pagination`, `PropertyList` (+ `.Item` / `.Value`), `Sidebar.Item` / `SubItem` / `Collapsible` / `CollapseToggle` (+ `Sidebar` drawer), `StatCard`, `Timeline.Item`, `Tooltip`. Leaves (`Button`, `Badge`) and pure compound components (`Table`, `Tabs`, `Select`, `Accordion`) don't need it — take `className` on the element or on each composed part. Vanilla CSS has no equivalent; write the classes on the elements directly.

### Icons

Iconized React components accept an `icon` (and where applicable `iconTrailing`) prop that takes a Tabler-style component reference:

```tsx
import { IconPlus } from "@tabler/icons-react";

<Button icon={IconPlus}>Add</Button>;
```

Component references render at `size="1em"` with `aria-hidden`, so the glyph inherits the host `font-size`. Pass JSX (`icon={<IconPlus size={20} />}`) to override that. Most leaf and shorthand components accept `icon` — among them `Button`, `Badge`, `Link`, `Input` / `Input.Action`, `Item`, `Card` / `Card.Title`, `Alert`, `Menu.Trigger` / `Menu.Item`, `Select.Trigger`, `Accordion.Summary`, `Navbar.Item` / `Navbar.Dropdown`, `Dialog`, `Drawer`, `StatCard`, `Timeline.Item`, `Breadcrumbs.Item`, `Indicator`, `BrandTile`, and `Sidebar.Item` / `SubItem` / `Collapsible`. A trailing `iconTrailing` slot is on `Button`, `Input`, and `Link`. Prefer the prop over passing icon JSX as children; check the component's reference page if unsure.

Vanilla CSS uses the Tabler webfont directly: `<button class="btn btn-primary"><i class="ti ti-plus"></i> Add</button>` (or `_ao-btn _ao-btn-primary` inside an `._ao-admin-root` wrapper).

### Tokens (two layers)

1. **Flexoki palette tones** — absolute colors (`--color-blue-600`, `--color-base-50`). Identical in light/dark.
2. **Semantic aliases** — purpose names (`--color-primary`, `--color-surface`, `--color-danger`) declared via `light-dark()`. Components reference only semantic tokens.

Override semantic tokens to reskin the system; never reference Flexoki tones directly from component code.

Hover and zebra fills use the translucent `surface-hover` / `surface-stripe` washes, so they show on any container. A custom filled container sets `--surface-current` to its fill so timeline rings, avatar-group rings and pinned or sticky table cells paint the same surface; see [Theming › Container surface](references/basics/theming.md).

### Dark mode

Driven entirely by CSS `color-scheme` and `[data-theme]`:

- `:root { color-scheme: light dark }` — OS-driven by default.
- `[data-theme="dark"]` / `[data-theme="light"]` — forced, scopable to any subtree.

No JS toggle needed.

### Use Tailwind utilities for layout when Tailwind is active

If the host application uses Tailwind v4 — check `package.json` for `tailwindcss` or look for `@import "tailwindcss"` in a CSS entry — reach for utility classes for spacing, flex/grid, and one-off layout: `flex items-center gap-2`, `grid grid-cols-3`, `mt-4`. The design system's semantic tokens (`bg-primary`, `text-text-muted`, `border-border`) are wired through Tailwind, so utilities and component classes compose freely on the same element.

With `@aortl/admin-react`, import `styles.css` into a cascade layer below `utilities` first: the scoped bundle is unlayered, so its reset (`:scope * { margin: 0; padding: 0 }`) beats every layered Tailwind utility inside `<AdminRoot>` and `mt-4` silently does nothing. See [React › With Tailwind](references/getting-started/react.md#with-tailwind).

For vanilla / no-build contexts (Jinja, Go templates, plain HTML) the package ships a second pre-built bundle, `@aortl/admin-css/admin.utilities.css`, containing a curated subset of Tailwind-grammar utilities (layout, flex/grid, spacing, sizing, typography, borders, semantic colors). Drop it in alongside `admin.css`. Semantic colors only (`bg-primary`, `text-danger`) — no raw Flexoki tones in utility form. The React package does not consume this bundle: in `@aortl/admin-react` apps, style components through their props and use the host's Tailwind, if any, for layout around them.

### Keyboard shortcuts

`<Button>` and `<Menu.Item>` accept a `hotkey` prop (`<Button hotkey="mod+s">Save</Button>`) that fires `onClick` on the matching chord and renders a trailing `<Kbd>` chip. For shortcuts not tied to a visible control, use `useHotkey("?", openHelp)` from `@aortl/admin-react`. `<Kbd keys="mod+s" />` renders the matching visual for tooltips and help dialogs. `mod` resolves to `Cmd` on macOS and `Ctrl` on every other platform.

### Prefer the platform

Admin users run current browsers — there is no legacy budget. Reach for modern HTML and CSS before reaching for JavaScript, and don't pull in `framer-motion`, manual portals, `requestAnimationFrame` loops, or `useState` mirroring what the DOM already tracks. Base UI handles the cases where JS is genuinely needed.

What the system itself builds on, so you can match it: `<dialog>` + `showModal()`, the `popover` attribute with `anchor-name` / `position-anchor`, `<details>` + `::details-content`, `:has()`, `field-sizing: content`, `@starting-style` with `transition-behavior: allow-discrete`, `subgrid`, `text-wrap: balance`, `light-dark()` and `color-mix()`. Don't infer support for anything beyond what a component's reference page shows.

### Charts

Three pure-CSS, JS-free primitives — `<BarChart>`, `<StackedBar>`, `<Donut>` (vanilla `.chart-bars` / `.chart-stack` / `.chart-donut`). For dense inline micro-viz and dashboard cards; no axes, ticks, or gridlines. Driven by inline custom properties, never `data-*`; in React the primary API is the `data` prop. See [Charts](references/components/charts.md) for the full API.

## Common mistakes

- **Missing `<AdminRoot>`.** `admin-react` components emit `_ao-`-prefixed classes that only match inside `._ao-admin-root`. Without the wrapper everything renders unstyled. Mount one high in the tree.
- **Mixing prefixed and bare class names.** A React app uses the scoped bundle (`_ao-btn`); a full-page vanilla app uses bare (`btn`). Don't write `btn` inside an `admin-react` tree, or `_ao-btn` outside one — pick the flavor (see Quick start) and stay in it.
- **Hand-rolling spacing and layout.** Use `<Container>` for page sections and flex/grid utilities for rows and grids ([Row](references/components/row.md), [Grid](references/components/grid.md)); there are no `Row` or `Grid` components. Density is a system property, not a per-page decision.
- **Reaching for raw Flexoki tones in component code.** Reference semantic tokens (`bg-primary`, `text-text-muted`, `border-border`); override those to reskin. To colour-code categories (event types, chart series), use the [categorical tokens](references/basics/colors.md#categorical) (`text-category-blue`, `--color-category-blue`), not `text-blue-600 dark:text-blue-400`.
- **Adding `framer-motion`, manual portals, or `requestAnimationFrame`.** Prefer the platform (see above); Base UI covers the genuinely stateful cases.
- **Putting `required` on the `<Field>` instead of the control.** The asterisk comes from the control's own `required`, on a label that is a direct child of the field. `<Field required>` alone marks the label but validates nothing; use it for controls with no native `required`, and `<Field.Label required>` for a label wrapped in another element. `required={false}` removes the asterisk.

- **Icon-only buttons without a name.** `<Button icon={IconTrash} />` with no children, an empty `Menu.Trigger`, or a vanilla `btn-square` needs an `aria-label`. A Tooltip is not an accessible name.
- **Pulling in Select2, react-select or a hand-rolled searchable select.** React has [Combobox](references/components/forms/combobox.md), with `multiple` for chips. A vanilla page filters by a few values with the [filter menu](references/patterns/filter-menu.md), a GET form of checkbox rows in a popover menu, and needs no JavaScript.
- **Reaching for a toast library.** There is no toast. A server-rendered page shows the last request's messages as an alert stack at the top of `main` ([flash messages](references/patterns/flash-messages.md)); a React view shows an `<Alert>` next to the action, or a status in the affected row.
- **A hand-rolled copy button.** React has [`<CopyButton value>`](references/components/copy-button.md) and `useCopy()`, which announce the copy to screen readers; a property list value takes `copyable`.
- **A bare `<span>` styled as a status dot.** Use `indicator-dot` / [`<StatusDot>`](references/components/indicator.md) next to the status text.
- **`window.confirm()`, `window.prompt()` or a hand-rolled confirm script.** React has `useConfirm()` and `usePrompt()` ([Dialog](references/components/dialog.md)). A vanilla page puts the POST form inside a `<dialog>` opened with `commandfor` ([confirm before submit](references/patterns/confirm.md)), which needs no JavaScript.

## When nothing fits

In a consumer repo you use the system; changing it is a separate task in a checkout of [`Digital-Udvikling/admin-design-system`](https://github.com/Digital-Udvikling/admin-design-system).

1. Re-check the index and the component's Reference table: most gaps are a prop, a `.Container`, or a composition. Check the Patterns pages for layouts like empty states, section headers, master-detail, confirmations and flash messages.
2. Prefer composition: a prop, `className` / `classNames`, `.Container`, `render` onto your own element (a router link), or in vanilla a documented class on your own element.
3. Otherwise write the smallest local workaround, either a stand-in built from system primitives and semantic tokens or a narrow override of one system class, and mark it with a comment in the file's own syntax:
   `aortl-gap: <component> — <what the system can't express> — #<issue> | unreported`
   Run `rg aortl-gap` first and reuse an existing stand-in. Never use `!important` against the system, copy component CSS, or edit files under `node_modules`.
4. Draft a "Design system gap" issue for the user to file; don't file it yourself. The repo is public, so describe the need generically, with no code, repo names, paths or URLs from private repos.
5. List every new marker in your final reply.

When `@aortl/*` or a pinned unpkg URL is bumped, run `rg aortl-gap` and remove workarounds the new version covers.

## How to use the references

The `references/` folder contains one markdown file per docs page. Each contains paired `html` and `tsx` code blocks showing both flavors for every documented variant.

Component pages end in a `Reference` section: a `React` table of props (plus a parts table for compound components) and a `Vanilla` table of classes and custom properties. **That table is authoritative** — the examples show common cases, the table shows the whole surface. Read it before assuming a prop or class exists, and note that defaults usually emit no class (`md`, `neutral`, `default`).

Cross-cutting props that hold everywhere — `className`, `classNames`, `icon`, sizes, tones, `.Container` — are in [Conventions](references/basics/conventions.md) and are not repeated per component.

Read references **on demand** — do not pre-load. The index below lists every available file.

## Reference index

### Getting started

- [Agent skill](references/getting-started/skill.md) — Install the design system as an Agent Skill.
- [React](references/getting-started/react.md) — Typed components emitting the same class names as the CSS package.
- [Scoped bundle](references/getting-started/scoped.md) — Drop admin styles into a non-admin app without colliding on class names.
- [Tailwind](references/getting-started/tailwind.md) — Drop the design system into an existing Tailwind v4.1+ project.
- [Vanilla CSS](references/getting-started/vanilla.md) — One pre-built stylesheet, no build tooling required.

### Basics

- [Colors](references/basics/colors.md) — Color tokens — brand, surfaces, borders, text, and state.
- [Conventions](references/basics/conventions.md) — Props and classes every component shares.
- [Icons](references/basics/icons.md) — Tabler Icons — webfont for vanilla, typed components for React.
- [Principles](references/basics/principles.md) — What this system optimizes for.
- [Theming](references/basics/theming.md) — Brand accent, dark mode, and token overrides.
- [Typography](references/basics/typography.md) — Type scale, weights, and font stack.

### Components

- [Accordions](references/components/accordions.md) — Disclosure rows built on <details>.
- [Alerts](references/components/alerts.md) — Inline notifications for errors, confirmations, and contextual feedback.
- [Avatar](references/components/avatar.md) — Image with a no-JS initials fallback, plus a group stack.
- [Badges](references/components/badges.md) — Short status, category, or count label on an item.
- [Brand tile](references/components/brand-tile.md) — A monogram, icon, or logo square for the navbar.
- [Breadcrumbs](references/components/breadcrumbs.md) — Trail of links to ancestor pages, ending in the current page.
- [Buttons](references/components/buttons.md) — Trigger an action, submit a form, or toggle a state.
- [Cards](references/components/cards.md) — A container with optional title, description, and actions.
- [Charts](references/components/charts.md) — Pure-CSS bar, proportion, and donut primitives.
- [Code blocks](references/components/code-blocks.md) — Styled <pre> for logs, JSON, and terminal output.
- [Container](references/components/container.md) — A centered, max-width page region that spaces its sections.
- [Copy button](references/components/copy-button.md) — Write a value to the clipboard from a button.
- [Dialogs](references/components/dialog.md) — Modal dialogs built on the native dialog element.
- [Drawers](references/components/drawer.md) — Edge-anchored panel built on the native dialog element.
- [Forms](references/components/forms/index.md) — Input controls and composition primitives.
- [Forms: Checkboxes](references/components/forms/checkboxes.md) — Independent on/off toggles.
- [Forms: Combobox](references/components/forms/combobox.md) — Type to filter a list, then pick one or more values.
- [Forms: Fields](references/components/forms/fields.md) — Accessibility wiring (label, description, validation) around inputs.
- [Forms: File inputs](references/components/forms/file-inputs.md) — File picker styled to match other inputs.
- [Forms: Input groups](references/components/forms/input-groups.md) — Combine inputs, addons, and buttons into a flush row.
- [Forms: Inputs](references/components/forms/inputs.md) — Single-line text input.
- [Forms: Number inputs](references/components/forms/number-inputs.md) — Numeric field with steppers and clamping.
- [Forms: Radios](references/components/forms/radios.md) — Mutually exclusive choice within a group.
- [Forms: Selects](references/components/forms/selects.md) — Pick one value from a collapsed list.
- [Forms: Switches](references/components/forms/switches.md) — Immediate on/off setting.
- [Forms: Textareas](references/components/forms/textareas.md) — Multi-line text input.
- [Grid](references/components/grid.md) — Two-dimensional layouts with grid utilities.
- [Indicator](references/components/indicator.md) — Place a badge, count, or dot on the corner of another element.
- [Kbd](references/components/kbd.md) — Keyboard shortcut chips for help text, tooltips, and bindings.
- [Links](references/components/links.md) — Styled text links with an optional external affordance.
- [List](references/components/list.md) — Compact rows for settings, members, and notifications.
- [Menus](references/components/menus.md) — Actions behind a trigger, in a dropdown.
- [Pagination](references/components/pagination.md) — Numbered page navigation with prev/next controls.
- [Progress](references/components/progress.md) — Task progress bar, determinate or indeterminate.
- [Property list](references/components/property-list.md) — Label-and-value rows for one-entity-N-attributes panels.
- [Prose](references/components/prose.md) — Styling for rendered markdown and other HTML you don't control.
- [Row](references/components/row.md) — One-dimensional layouts with flex utilities.
- [Separator](references/components/separator.md) — Divide content with a horizontal or vertical rule.
- [Spinners](references/components/spinners.md) — Inline busy state for work of unknown length.
- [Stat cards](references/components/stat-cards.md) — Compact KPI tile with label, value, and detail.
- [Tables](references/components/tables.md) — Native table with row selection, sticky headers, and row links.
- [Tabs](references/components/tabs.md) — Section a view into named panels.
- [Timeline](references/components/timeline.md) — Event rail for activity and status history.
- [Tooltips](references/components/tooltip.md) — Transient hints anchored to a trigger.

### Patterns

- [Confirm before submit](references/patterns/confirm.md) — Ask before a destructive action runs.
- [Empty, loading and error states](references/patterns/states.md) — Fill a panel or table while its data is missing.
- [Filter menu](references/patterns/filter-menu.md) — Filter a list by several values of one field.
- [Flash messages](references/patterns/flash-messages.md) — Report the result of an action after it runs.
- [Master-detail](references/patterns/master-detail.md) — Pick a row and show its record beside the list.
- [Section header](references/patterns/section-header.md) — Title a list or table with a count and actions.

### Modules

- [App shell](references/modules/app-shell.md) — Page chrome — navbar, optional sidebar, optional footer — around a main content area.
