# Principles

> What this system optimizes for.

A system for internal admin tooling.

## Built for admin tooling

Operators sit in these screens all day. The defaults reflect that:

- **Information density** — compact spacing, smaller defaults, tabular layouts. Don't pad components to feel "premium."
- **Operator UX** — keyboard affordances, predictable focus, fast scanning, low chrome.
- **Clarity over polish** — legible type, honest borders, restrained color. No decorative gradients or oversized hero spacing.
- **Predictable primitives** — fewer variants, consistent names. A `<Button>` does what `<button>` does.

When in doubt: would this make a 12-row form on a busy admin screen _easier_ or _prettier_? Pick easier.

## Prefer the platform

Reach for modern HTML and CSS before JavaScript. No legacy budget, no polyfills, no graceful fallbacks. If a behavior can be expressed declaratively, it should be.

- **Animation** — CSS `transition`, `@keyframes`, `@starting-style`, `transition-behavior: allow-discrete`.
- **Disclosure and overlays** — `<dialog>` + `showModal()`, the `popover` attribute, `anchor-name` / `position-anchor`.
- **Accordions** — `<details>` + `<summary>`, with `::details-content` for animated open/close.
- **Form state** — `:has()`, `:user-valid`, `:user-invalid`, `:placeholder-shown`, `accent-color`, `field-sizing: content`.
- **Layout** — container queries, `subgrid`, `aspect-ratio`, logical properties, `text-wrap: balance` / `pretty`.
- **Scroll** — `position: sticky`, `scroll-snap-*`, `overscroll-behavior`, `scroll-margin-*`.
- **Color and theming** — `light-dark()`, `color-mix()`, relative color syntax, `@property`.

JavaScript shows up when behavior is genuinely stateful, needs data fetching, or has no declarative equivalent. In those cases, use Base UI primitives instead of rolling your own.

## Two flavors, one contract

Both packages ship the same class names. `@aortl/admin-css` defines `.btn`, `.input`, `.field`, …. `@aortl/admin-react` wraps Base UI primitives in thin components that emit those same classes. Vanilla HTML and React render identical DOM.

This shapes the rest of the system:

- Adopting one flavor doesn't lock out the other — mix freely on the same page.
- The CSS is the source of truth. Visual changes happen there, and React inherits them.
- Class names are part of the public API. Renaming `.btn-primary` is a breaking change.

Naming pattern: `<base>` + `<base>-<variant>` + (optional) `<base>-<size>` + (optional) `<base>-<modifier>`. Sizes use `sm` / `md` (default, omitted) / `lg`.

## Two-layer tokens

Colors live in two layers, both registered with Tailwind's `@theme`:

1. **Palette** — Flexoki ramps (`--color-blue-600`, `--color-base-50`, …). Absolute tones, identical in light and dark mode.
2. **Semantic** — purpose-named aliases (`--color-primary`, `--color-surface`, `--color-danger`, …) point at palette tones via `light-dark()`.

Components only ever reference semantic tokens. Override `--color-primary` and every component follows. Spacing, radii, and shadows use Tailwind's built-in scales (`p-4`, `rounded-lg`, `shadow-xs`).

See [Colors](colors.md) for the full token catalog and [Customize](customize.md) for override patterns.
