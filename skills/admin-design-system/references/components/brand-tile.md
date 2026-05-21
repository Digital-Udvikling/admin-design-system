# Brand tile

> A 24px monogram or icon square, used to brand the navbar per system.

Sits in `<Navbar.Brand>`. Color follows `--color-system-accent` — see [Customize](../../basics/customize/#system-accent).

## Monogram

Keep monograms to 1–2 characters; the 24px box won't fit more.

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

## Icon

Pass a [Tabler icon](../../basics/icons/) instead; renders at 14px. `icon` wins over `monogram`.

**Example**

```tsx
<BrandTile icon={IconShoppingCart} style={{ "--color-system-accent": "var(--color-green-600)" }} />
<BrandTile icon={IconChartBar} style={{ "--color-system-accent": "var(--color-orange-600)" }} />
<BrandTile icon={IconPackage} style={{ "--color-system-accent": "var(--color-cyan-600)" }} />
```
