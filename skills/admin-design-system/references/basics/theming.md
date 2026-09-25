# Theming

> Brand accent, dark mode, and token overrides.

## Contents

- [System accent](#system-accent)
- [Dark mode](#dark-mode)
  - [Force a mode](#force-a-mode)
  - [Scope to a subtree](#scope-to-a-subtree)
  - [Tailwind dark: variant](#tailwind-dark-variant)
- [Override tokens](#override-tokens)
  - [A semantic role](#a-semantic-role)
  - [A palette tone](#a-palette-tone)
  - [The whole palette](#the-whole-palette)
- [Container surface](#container-surface)
- [Popup layering](#popup-layering)

## System accent

One variable drives the navbar stripe, the footer stripe, and [`<BrandTile>`](../components/brand-tile.md). Set it at `:root`:

```css
:root {
  --color-system-accent: light-dark(var(--color-purple-600), var(--color-purple-400));
}
```

Defaults to a neutral gray. A `light-dark()` pair keeps the tile legible in both modes. Three derived tokens track it:

| Token                           | What it controls                         | Derivation                          |
| ------------------------------- | ---------------------------------------- | ----------------------------------- |
| `--color-system-accent`         | Navbar + footer stripe, `.brand-tile` bg | The value you set                   |
| `--color-system-accent-hover`   | Reserved for hover states                | 12% mix toward `--color-text`       |
| `--color-system-accent-muted`   | `.brand-tile-soft` fill                  | 12% accent over `--color-surface`   |
| `--color-system-accent-content` | Tile / icon foreground                   | Paper or black, by accent lightness |

`.brand-tile` re-derives `-muted` and `-content` from the accent it inherits, so an accent set on a subtree (`.app-shell`, `.navbar`, the tile itself) reaches the tile's fill and glyph. Overriding `-content` directly doesn't reach the tile.

In React, `<AdminRoot systemAccent="…">` sets it inline on one subtree. To run several accents in one app, see [App shell › Branding](../modules/app-shell.md#branding-multiple-systems).

## Dark mode

Mode resolves from CSS `color-scheme`, which also flips native form controls, scrollbars, and the page background before paint:

| Selector               | `color-scheme` | When it wins             |
| ---------------------- | -------------- | ------------------------ |
| `:root`                | `light dark`   | default — follows the OS |
| `[data-theme="light"]` | `light`        | forces light             |
| `[data-theme="dark"]`  | `dark`         | forces dark              |

### Force a mode

```html
<!-- swap to data-theme="light" to force light -->
<html data-theme="dark">
  ...
</html>
```

### Scope to a subtree

The selector isn't tied to `:root`, so any element flips its own subtree. An embedded `<AdminRoot>` then owns its `color-scheme` outright and the host page's does not leak in.

```html
<section data-theme="dark">
  <!-- everything inside renders in dark mode -->
</section>
```

```tsx
<AdminRoot theme="dark">{/* ... */}</AdminRoot>
```

### Tailwind `dark:` variant

Fires under `prefers-color-scheme: dark` or inside `[data-theme="dark"]`, and is suppressed inside `[data-theme="light"]`:

```html
<div class="shadow-md dark:shadow-xl">...</div>
```

## Override tokens

Colors live in two layers — [Colors](colors.md) has the catalog, [Principles](principles.md#two-layer-tokens) has the reasoning.

### A semantic role

Components reference only this layer, so one declaration moves every component that uses the role:

```css
:root {
  --color-primary: var(--color-green-600);
}
```

### A palette tone

Replaces a Flexoki tone everywhere it is used, including inside any semantic role pointing at it:

```css
:root {
  --color-blue-600: oklch(0.55 0.18 250);
}
```

### The whole palette

Both layers are plain declarations on `:root`. Redefine the palette in your own stylesheet to ship a different brand.

## Container surface

Filled containers publish their fill as `--surface-current`: cards and their tints, dialogs and their footer, menu and select popups, accordion items, muted and selected list items, selected table rows, the navbar, sidebar and footer. Components that must paint the surface they sit on read it — timeline rings, avatar-group rings, stacked-bar seams, and the pinned column and sticky header of a table. Set it on your own filled container so those match:

```css
.my-panel {
  background-color: var(--color-surface-strong);
  --surface-current: var(--color-surface-strong);
}
```

## Popup layering

Portaled popups — [`<Select>`](../components/forms/selects.md) and [`<Tooltip>`](../components/tooltip.md) — render on `.popup-layer`, whose `z-index` reads `--z-popup` and defaults to `1000`. The vanilla `.tooltip-wrap` bubble reads it too. Lower it when an `<AdminRoot>` sits inside a host page with chrome that should still paint above admin popups:

```css
.my-embedded-panel {
  --z-popup: 106;
}
```

Declare it on the admin root or any ancestor — the default is a `var()` fallback rather than a token, so any declaration wins outright.

`<Dialog>` and `<Drawer>` are native `<dialog>` elements in the top layer and ignore `z-index`; popups opened inside one are portaled into the dialog so they stay above its backdrop.
