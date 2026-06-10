# Vanilla CSS

> One pre-built stylesheet, no build tooling required.

## Install via CDN

```html
<link rel="stylesheet" href="https://unpkg.com/@aortl/admin-css/dist/admin.min.css" />
```

## Or via npm

```bash
npm install @aortl/admin-css
```

Then import `@aortl/admin-css/admin.min.css` from your bundler entry. Package page: [`@aortl/admin-css` on npm](https://www.npmjs.com/package/@aortl/admin-css).

Embedding admin markup inside a non-admin page? See [Scoped bundle](scoped.md).

## Utilities (optional)

A second pre-built file ships Tailwind-grammar utilities (`flex`, `grid-cols-3`, `p-4`, `bg-primary`, …) for laying out pages from Jinja, Go templates, or plain HTML without setting up Tailwind. Opt-in — drop a second `<link>` next to `admin.min.css`:

```html
<link rel="stylesheet" href="https://unpkg.com/@aortl/admin-css/dist/admin.min.css" />
<link rel="stylesheet" href="https://unpkg.com/@aortl/admin-css/dist/admin.utilities.min.css" />
```

### What's included

- **Layout / flex / grid** — `block`, `flex`, `grid`, `hidden`, `relative`, `sticky`, `overflow-*`, `flex-{row,col,wrap}`, `items-*`, `justify-*`, `gap-*`, `grid-cols-{1-12}`, `col-span-*`, `col-start/end-*`, `row-start/end-*`, `order-*`. See [Row](../components/row.md) and [Grid](../components/grid.md) for patterns.
- **Spacing** — `p`/`m` per side on a curated 14-step scale: `0, 0.5, 1, 1.5, 2, 3, 4, 6, 8, 12, 16, 20, 24, 32`. Anything above `32` is outside admin density.
- **Sizing** — `w`/`h`/`min-w`/`max-w`/`min-h`/`max-h` on the same scale plus `px`, fractions (`1/2`, `1/3`, `2/3`, `1/4`, `2/4`, `3/4`), and keywords (`auto`, `full`, `screen`, `fit`, `min`, `max`). `max-w-*` additionally accepts the container-width tokens (`xs`..`7xl`, `prose`, `none`).
- **Typography** — `text-{xs,sm,base,lg,xl,2xl}`, `font-{thin..black}`, `font-{sans,mono,serif}`, `italic`, `uppercase`/`lowercase`/`capitalize`, `tabular-nums` (+ other `*-nums` variants), `leading-*`, `tracking-*`, `text-{left,center,right}`, `text-{wrap,balance}`, `whitespace-{nowrap,pre,…}`, `break-{words,all,keep}`, `align-*` (vertical-align), `list-{disc,decimal,none}`, `underline`, `truncate`. Caps at `text-2xl`.
- **Borders / effects** — `border`, `border-{0,2,4,8}`, `divide-{x,y}` (hairlines between children), `rounded-*` per side, `shadow-{xs..2xl,inner}`, `ring-*`, `outline-*`, `opacity-*`, `cursor-*`, `pointer-events-*`, `select-*`, `z-*`, `aspect-{square,video}`, `object-{cover,contain,fill,none,scale-down}`, `sr-only`.
- **Colors** — semantic tokens only: `bg-primary`, `text-text-muted`, `border-danger`, `ring-info`, `shadow-success`. Override `--color-primary` and every utility follows. No raw Flexoki ramps (`bg-blue-600`) — see [Colors](../basics/colors.md).
- **Translate** — `translate-x-*`, `translate-y-*` on the spacing scale plus `1/2` and `full`.
- **Variants** — `sm:`, `md:`, `lg:`, `xl:`, `2xl:` on layout-shifting utilities; `hover:`, `focus:`, `focus-visible:`, `active:` on stateful ones.

### What's not included

Animations, transitions, filters, backdrop filters, gradient backgrounds, mix-blend, SVG fill/stroke, and transforms beyond `translate-x/y`. Dark mode is driven by [tokens via `light-dark()`](../basics/dark-mode.md), not a `dark:` variant. If a family you need is missing, the component CSS (`.btn`, `.card`, `.alert`, `.field`) usually covers it.

### Compose with components

```html
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  <div class="card">
    <div class="card-body">
      <h3 class="card-title">Orders</h3>
      <p class="text-text-muted text-sm">128 placed</p>
    </div>
  </div>
  <div class="card">
    <div class="card-body">
      <h3 class="card-title">Errors</h3>
      <p class="text-danger text-sm">3 in last hour</p>
    </div>
  </div>
</div>
```

## Add icons (optional)

The recommended icon library is [Tabler Icons](https://tabler.io/icons) — see [Icons](../basics/icons.md). The webfont drops in without a bundler:

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/dist/tabler-icons.min.css"
/>
```

Pin a version (e.g. `@3.44.0`) for production. With an existing CSS pipeline, install the package and `@import` it instead:

```bash
npm install @tabler/icons-webfont
```

```css
@import "@tabler/icons-webfont/dist/tabler-icons.min.css";
```

Use icons with `<i class="ti ti-{name}"></i>` — `.btn`, `.menu-item`, `.alert`, and `.sidebar-icon` lay them out without wrappers.
