# Brand tile

> A monogram, icon, or logo square for the navbar.

## Contents

- [Examples](#examples)
  - [Monogram](#monogram)
  - [Icon](#icon)
  - [Sizes](#sizes)
  - [Tones](#tones)
  - [Soft](#soft)
  - [Image](#image)
- [Reference](#reference)
  - [React](#react)
  - [Vanilla](#vanilla)

## Examples

### Monogram

**Example**

```html
<span class="brand-tile" aria-hidden="true">OR</span>
<span class="brand-tile" aria-hidden="true" style="--color-system-accent: var(--color-purple-600)">
  OR
</span>
<span class="brand-tile" aria-hidden="true" style="--color-system-accent: var(--color-green-600)">
  AO
</span>
```

```tsx
<BrandTile monogram="OR" />
<BrandTile monogram="OR" systemAccent="var(--color-purple-600)" />
<BrandTile monogram="AO" systemAccent="var(--color-green-600)" />
```

### Icon

**Example**

```html
<span class="brand-tile" aria-hidden="true" style="--color-system-accent: var(--color-green-600)">
  <i class="ti ti-shopping-cart"></i>
</span>
<span class="brand-tile" aria-hidden="true" style="--color-system-accent: var(--color-orange-600)">
  <i class="ti ti-chart-bar"></i>
</span>
<span class="brand-tile" aria-hidden="true" style="--color-system-accent: var(--color-cyan-600)">
  <i class="ti ti-package"></i>
</span>
```

```tsx
<BrandTile icon={IconShoppingCart} systemAccent="var(--color-green-600)" />
<BrandTile icon={IconChartBar} systemAccent="var(--color-orange-600)" />
<BrandTile icon={IconPackage} systemAccent="var(--color-cyan-600)" />
```

### Sizes

**Example**

```html
<span class="brand-tile" aria-hidden="true">OR</span>
<span class="brand-tile brand-tile-lg" aria-hidden="true">OR</span>
```

```tsx
<BrandTile monogram="OR" />
<BrandTile monogram="OR" size="lg" />
```

### Tones

**Example**

```html
<span class="brand-tile brand-tile-info" aria-hidden="true">
  <i class="ti ti-package"></i>
</span>
<span class="brand-tile brand-tile-success" aria-hidden="true">
  <i class="ti ti-shopping-cart"></i>
</span>
<span class="brand-tile brand-tile-warning" aria-hidden="true">
  <i class="ti ti-alert-triangle"></i>
</span>
<span class="brand-tile brand-tile-danger" aria-hidden="true">
  <i class="ti ti-chart-bar"></i>
</span>
```

```tsx
<BrandTile icon={IconPackage} variant="info" />
<BrandTile icon={IconShoppingCart} variant="success" />
<BrandTile icon={IconAlertTriangle} variant="warning" />
<BrandTile icon={IconChartBar} variant="danger" />
```

### Soft

**Example**

```html
<span class="brand-tile brand-tile-soft" aria-hidden="true">OR</span>
<span
  class="brand-tile brand-tile-soft"
  aria-hidden="true"
  style="--color-system-accent: light-dark(var(--color-purple-600), var(--color-purple-400))"
>
  OR
</span>
<span class="brand-tile brand-tile-info brand-tile-soft" aria-hidden="true">
  <i class="ti ti-package"></i>
</span>
<span class="brand-tile brand-tile-success brand-tile-soft" aria-hidden="true">
  <i class="ti ti-shopping-cart"></i>
</span>
<span class="brand-tile brand-tile-warning brand-tile-soft" aria-hidden="true">
  <i class="ti ti-alert-triangle"></i>
</span>
<span class="brand-tile brand-tile-danger brand-tile-soft" aria-hidden="true">
  <i class="ti ti-chart-bar"></i>
</span>
```

```tsx
<BrandTile monogram="OR" soft />
<BrandTile
  monogram="OR"
  soft
  systemAccent="light-dark(var(--color-purple-600), var(--color-purple-400))"
/>
<BrandTile icon={IconPackage} variant="info" soft />
<BrandTile icon={IconShoppingCart} variant="success" soft />
<BrandTile icon={IconAlertTriangle} variant="warning" soft />
<BrandTile icon={IconChartBar} variant="danger" soft />
```

### Image

**Example**

```html
<span class="brand-tile brand-tile-lg">
  <img src="/favicon.svg" alt="Acme" />
</span>
```

```tsx
<BrandTile src={`/favicon.svg`} alt="Acme" size="lg" />
```

## Reference

### React

| Prop           | Type                                                       | Default    |
| -------------- | ---------------------------------------------------------- | ---------- |
| `variant`      | `"accent" \| "info" \| "success" \| "warning" \| "danger"` | `"accent"` |
| `soft`         | `boolean`                                                  | `false`    |
| `size`         | `"md" \| "lg"`                                             | `"md"`     |
| `monogram`     | `string`                                                   | —          |
| `icon`         | [`IconProp`](../basics/conventions.md#icons)              | —          |
| `src`          | `string`                                                   | —          |
| `alt`          | `string`                                                   | `""`       |
| `systemAccent` | `string` (CSS color)                                       | inherited  |

Content precedence is `src` > `icon` > `monogram`. Monogram and icon tiles are marked `aria-hidden`, since the brand name is next to them in the navbar; an image tile exposes `alt` instead. There is no `sm`. Plus native `<span>` attributes.

Sits in [`Navbar.Brand`](../modules/app-shell.md#navbar).

### Vanilla

| Class                                                                           | Effect                                                                                            |
| ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `brand-tile`                                                                    | `1.5rem` square, `0.25rem` radius, accent fill, `11px` semibold monogram                          |
| `brand-tile-lg`                                                                 | `2.5rem`, `0.375rem` radius, `text-sm`                                                            |
| `brand-tile-info` `brand-tile-success` `brand-tile-warning` `brand-tile-danger` | Status fill with its `-content` glyph                                                             |
| `brand-tile-soft`                                                               | `-muted` fill with a glyph in the tone (accent without one); soft `warning` keeps the text colour |

A direct `<i>`/`<svg>` child is sized in CSS — `14px`, or `20px` under `brand-tile-lg` — so vanilla needs no inline `font-size` and React icons render at `1em`. A direct `<img>` child flips the tile to a bordered surface via `:has()` and is `object-contain`, so an arbitrary-ratio logo isn't cropped.

There is no `brand-tile-accent` or `brand-tile-md` — both are the unmodified `brand-tile`. Keep monograms to two characters; the default box won't fit more.

The fill comes from `--color-system-accent`. The tile derives `--color-system-accent-muted` and `--color-system-accent-content` from the accent in scope, so an override on the tile, the navbar or the shell retints the soft fill and sets the solid tile's glyph to paper or black by the accent's lightness. An override of `-muted` or `-content` on `:root`, the navbar or the shell doesn't reach the tile; set it on the tile itself (`.brand-tile { --color-system-accent-content: var(--color-paper); }`). The soft glyph is the accent itself: for `brand-tile-soft`, pass a `light-dark()` pair (e.g. `light-dark(var(--color-purple-600), var(--color-purple-400))`) so it stays legible on the dark tint. See [Theming › System accent](../basics/theming.md#system-accent).
