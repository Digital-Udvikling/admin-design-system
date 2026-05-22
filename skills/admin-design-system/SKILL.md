---
name: admin-design-system
description: Build UI for internal admin tooling in Digital-Udvikling projects. Use when working in a Digital-Udvikling repo on admin pages, internal tools, or operator-facing screens; when files import @aortl/admin-react or link @aortl/admin-css; or when seeing class names like .btn, .input, .card, .field, .alert, .table, .sidebar.
---

# aortl admin design system

A small, opinionated design system for internal admin tooling. Ships as two packages from one source of truth:

- `@aortl/admin-css` — pre-built CSS with semantic class names (`.btn`, `.input`, `.card`, `.field`).
- `@aortl/admin-react` — React components wrapping Base UI primitives, emitting the same class names.

Vanilla HTML and React render identically — pick whichever fits the host application.

## When to use this skill

- The codebase imports from `@aortl/admin-react` or links `@aortl/admin-css`.
- The user asks for a component, form, layout, or admin page in this design system.
- You're building UI for an internal admin tool at Digital-Udvikling — even if the design system isn't installed yet, prefer adding it over hand-rolling component styles.

This system is for **internal admin tooling**, not customer-facing marketing surfaces. Optimize for information density, operator UX, and clarity over polish. When in doubt: would this make a 12-row form on a busy admin screen _easier_ or _prettier_? Pick easier.

## Conventions

### Class names are the contract

Both packages emit the same class names. `<Button variant="primary" size="sm">` renders as `<button class="btn btn-primary btn-sm">`. Vanilla HTML and React are interchangeable at the DOM level.

Naming pattern: `<base>` + `<base>-<variant>` + (optional) `<base>-<size>` + (optional) `<base>-<modifier>`. Sizes use `sm` / (default, omitted) / `lg`.

### Icons

Iconized React components accept an `icon` (and where applicable `iconTrailing`) prop that takes a Tabler-style component reference:

```tsx
import { IconPlus } from "@tabler/icons-react";

<Button icon={IconPlus}>Add</Button>;
```

Pass JSX (`icon={<IconPlus size={20} />}`) to override the default 16px size. Components currently exposing this prop: `Button`, `Menu.Item`, `Card` / `Card.Title`, `Navbar.Item`, `Alert`, `Sidebar.Item` / `SubItem` / `Collapsible`.

Vanilla CSS uses the Tabler webfont directly: `<button class="btn btn-primary"><i class="ti ti-plus"></i> Add</button>`.

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

For projects without Tailwind, use the host project's own layout classes or inline styles — the component classes (`.btn`, `.card`, …) don't require Tailwind to render correctly.

### Prefer the platform

Admin users run current browsers — there is no legacy budget. Reach for modern HTML and CSS before reaching for JavaScript.

- Disclosure: `<details>` + `<summary>` with `interactivity: inert` and `::details-content`.
- Modals: `<dialog>` + `showModal()`.
- Popovers / tooltips / menus: `popover` attribute + `anchor-name` / `position-anchor`.
- Animations: CSS `transition`, `@keyframes`, `@starting-style`, `transition-behavior: allow-discrete`.
- Form state: `:has()`, `:user-valid`, `:user-invalid`, `:placeholder-shown`, `field-sizing: content`.
- Layout: container queries, `subgrid`, `aspect-ratio`, `text-wrap: balance`.

Don't pull in `framer-motion`, manual portals, or `requestAnimationFrame` loops. Base UI handles the cases where JS is genuinely needed.

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

- [Agent skill](references/getting-started/skill.md) — Install the design system as an Agent Skill so Claude (or any compatible agent) knows the class names, component API, and conventions.
- [React](references/getting-started/react.md) — Thin React wrappers that emit the same class names as the vanilla CSS.
- [Scoped bundle](references/getting-started/scoped.md) — Drop admin components into a non-admin app without leaking styles.
- [Tailwind](references/getting-started/tailwind.md) — Drop the design system into an existing Tailwind v4 project.
- [Vanilla CSS](references/getting-started/vanilla.md) — A single pre-built stylesheet. No build tooling required on your end.

### Basics

- [Colors](references/basics/colors.md) — Color tokens — brand, surfaces, borders, text, and state.
- [Customize](references/basics/customize.md) — Brand-shift the design system with one variable, or override individual tokens.
- [Dark mode](references/basics/dark-mode.md) — Follows the OS by default, with manual override per page or subtree.
- [Icons](references/basics/icons.md) — Tabler Icons — webfont for vanilla, typed components for React.
- [Principles](references/basics/principles.md) — What this system optimizes for, and how it's built.
- [Typography](references/basics/typography.md) — Type scale, weights, and font stack.

### Components

- [Accordions](references/components/accordions.md) — Native <details> + <summary>, smoothed by interpolate-size and ::details-content.
- [Alerts](references/components/alerts.md) — Inline notifications for errors, confirmations, and contextual feedback.
- [Badges](references/components/badges.md) — Compact status indicator for tags, counts, and chips.
- [Brand tile](references/components/brand-tile.md) — A 24px monogram or icon square, used to brand the navbar per system.
- [Breadcrumbs](references/components/breadcrumbs.md) — Trail of links to ancestor pages, ending in the current page.
- [Buttons](references/components/buttons.md) — Base class .btn + a variant + an optional size.
- [Cards](references/components/cards.md) — A container with optional title, description, and actions.
- [Dialogs](references/components/dialog.md) — Modal dialogs built on the native <dialog> element.
- [Forms](references/components/forms/index.md) — Input controls and composition primitives.
- [Forms: Checkboxes](references/components/forms/checkboxes.md) — Base class .checkbox with an inner .checkbox-indicator.
- [Forms: Fields](references/components/forms/fields.md) — Accessibility wiring (label, description, validation) around inputs.
- [Forms: File inputs](references/components/forms/file-inputs.md) — Styled native file picker.
- [Forms: Input groups](references/components/forms/input-groups.md) — Combine inputs, addons, and buttons into a flush row.
- [Forms: Inputs](references/components/forms/inputs.md) — Base class .input + a variant + an optional size.
- [Forms: Radios](references/components/forms/radios.md) — Radio + RadioGroup.
- [Forms: Selects](references/components/forms/selects.md) — Compound Select with Trigger + Popup + Item.
- [Forms: Switches](references/components/forms/switches.md) — Base class .switch with an inner .switch-thumb.
- [Forms: Textareas](references/components/forms/textareas.md) — Base class .textarea + a variant + an optional size.
- [Menus](references/components/menus.md) — Dropdown menu built on native <details> + <summary>.
- [Pagination](references/components/pagination.md) — Numbered page navigation with prev/next controls.
- [Progress](references/components/progress.md) — Styled native <progress> element.
- [Spinners](references/components/spinners.md) — Compact CSS-only loading indicator.
- [Tables](references/components/tables.md) — Native <table> with optional row selection, sticky headers, status gutter, and whole-row links.
- [Tabs](references/components/tabs.md) — Section a view into named panels.

### Modules

- [App shell](references/modules/app-shell.md) — Page chrome — navbar, optional sidebar, optional footer — around a main content area.
