# Brand tile

> A monogram, icon, or logo square for the navbar.

## Contents

- [Examples](#examples)
  - [Monogram](#monogram)
  - [Icon](#icon)
  - [Sizes](#sizes)
  - [Soft tints](#soft-tints)
  - [Image](#image)
- [Reference](#reference)
  - [React](#react)
  - [Vanilla](#vanilla)

## Examples

### Monogram

**Example**

```html
<span class="brand-tile" aria-hidden>OR</span>
<span class="brand-tile" aria-hidden style="--color-system-accent: var(--color-purple-600)">
  OR
</span>
<span class="brand-tile" aria-hidden style="--color-system-accent: var(--color-green-600)">
  AO
</span>
```

```tsx
<BrandTile monogram="OR" />
<BrandTile monogram="OR" style={{ "--color-system-accent": "var(--color-purple-600)" }} />
<BrandTile monogram="AO" style={{ "--color-system-accent": "var(--color-green-600)" }} />
```

### Icon

**Example**

```html
<span class="brand-tile" aria-hidden style="--color-system-accent: var(--color-green-600)">
  <i class="ti ti-shopping-cart"></i>
</span>
<span class="brand-tile" aria-hidden style="--color-system-accent: var(--color-orange-600)">
  <i class="ti ti-chart-bar"></i>
</span>
<span class="brand-tile" aria-hidden style="--color-system-accent: var(--color-cyan-600)">
  <i class="ti ti-package"></i>
</span>
```

```tsx
<BrandTile icon={IconShoppingCart} style={{ "--color-system-accent": "var(--color-green-600)" }} />
<BrandTile icon={IconChartBar} style={{ "--color-system-accent": "var(--color-orange-600)" }} />
<BrandTile icon={IconPackage} style={{ "--color-system-accent": "var(--color-cyan-600)" }} />
```

### Sizes

**Example**

```html
<span class="brand-tile" aria-hidden>OR</span>
<span class="brand-tile brand-tile-lg" aria-hidden>OR</span>
```

```tsx
<BrandTile monogram="OR" />
<BrandTile monogram="OR" size="lg" />
```

### Soft tints

**Example**

```html
<span class="brand-tile brand-tile-soft" aria-hidden>OR</span>
<span
  class="brand-tile brand-tile-soft"
  aria-hidden
  style="--color-system-accent: var(--color-purple-600)"
>
  OR
</span>
<span class="brand-tile brand-tile-info" aria-hidden>
  <i class="ti ti-package"></i>
</span>
<span class="brand-tile brand-tile-success" aria-hidden>
  <i class="ti ti-shopping-cart"></i>
</span>
<span class="brand-tile brand-tile-danger" aria-hidden>
  <i class="ti ti-chart-bar"></i>
</span>
```

```tsx
<BrandTile monogram="OR" variant="soft" />
<BrandTile
  monogram="OR"
  variant="soft"
  style={{ "--color-system-accent": "var(--color-purple-600)" }}
/>
<BrandTile icon={IconPackage} variant="info" />
<BrandTile icon={IconShoppingCart} variant="success" />
<BrandTile icon={IconChartBar} variant="danger" />
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

| Prop       | Type                                                   | Default   |
| ---------- | ------------------------------------------------------ | --------- |
| `variant`  | `"solid" \| "soft" \| "info" \| "success" \| "danger"` | `"solid"` |
| `size`     | `"md" \| "lg"`                                         | `"md"`    |
| `monogram` | `string`                                               | —         |
| `icon`     | [`IconProp`](../basics/conventions.md#icons)          | —         |
| `src`      | `string`                                               | —         |
| `alt`      | `string`                                               | `""`      |

Content precedence is `src` > `icon` > `monogram`. Monogram and icon tiles are marked `aria-hidden`, since the brand name is next to them in the navbar; an image tile exposes `alt` instead. There is no `sm`. Plus native `<span>` attributes.

Sits in [`Navbar.Brand`](../modules/app-shell.md#navbar).

### Vanilla

| Class                                                      | Effect                                                                   |
| ---------------------------------------------------------- | ------------------------------------------------------------------------ |
| `brand-tile`                                               | `1.5rem` square, `0.25rem` radius, accent fill, `11px` semibold monogram |
| `brand-tile-lg`                                            | `2.5rem`, `0.375rem` radius, `text-sm`                                   |
| `brand-tile-soft`                                          | Accent `-muted` fill with an accent glyph                                |
| `brand-tile-info` `brand-tile-success` `brand-tile-danger` | Status `-muted` fill with a matching glyph                               |

A direct `<i>`/`<svg>` child is sized in CSS — `14px`, or `20px` under `brand-tile-lg` — so vanilla needs no inline `font-size` and React icons render at `1em`. A direct `<img>` child flips the tile to a bordered surface via `:has()` and is `object-contain`, so an arbitrary-ratio logo isn't cropped.

There is no `brand-tile-solid` or `brand-tile-md` — both are the unmodified `brand-tile` — and no `brand-tile-warning`; see [Conventions › Tones](../basics/conventions.md#tones). Keep monograms to two characters; the default box won't fit more.

The fill comes from `--color-system-accent`, so one override retints both the solid and soft variants — see [Theming › System accent](../basics/theming.md#system-accent).
