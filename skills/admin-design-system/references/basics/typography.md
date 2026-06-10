# Typography

> Type scale, weights, and font stack.

Body text is **14px**; the UI typeface is IBM Plex.

## Font stack

```css
--font-sans:
  "IBM Plex Sans", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;

--font-mono:
  "IBM Plex Mono", ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono",
  monospace;
```

Fonts load with `font-display: swap`. The fallback faces are metric-overridden to match Plex's box, so the swap changes glyph shapes without shifting layout.

To opt out, override `--font-sans` / `--font-mono`:

```css
:root {
  --font-sans: ui-sans-serif, system-ui, sans-serif;
}
```

To skip the Plex network requests entirely, import admin-css's source files individually and leave out `fonts.css`. The default `dist/admin.css` bundle includes Plex.

## Specimen

IBM Plex Sans — the UI typeface.

**Example**

```html
<div class="font-sans">
  <p class="text-2xl">The quick brown fox jumps over the lazy dog</p>
  <p class="text-text-muted">ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz</p>
  <p class="text-text-muted">0123456789 &amp; @ # % ( ) { } [ ] / \ — – … ! ? « »</p>
</div>
```

```tsx
<div className="font-sans">
  <p className="text-2xl">The quick brown fox jumps over the lazy dog</p>
  <p className="text-text-muted">ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz</p>
  <p className="text-text-muted">0123456789 &amp; @ # % ( ) {"{ }"} [ ] / \ — – … ! ? « »</p>
</div>
```

IBM Plex Mono — fixed-width, for IDs, hashes, and figures.

**Example**

```html
<div class="font-mono">
  <p class="text-2xl">The quick brown fox jumps over the lazy dog</p>
  <p class="text-text-muted">ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz</p>
  <p class="text-text-muted">0123456789 il1 O0 |/\ {} [] () &lt;&gt; -- == =&gt;</p>
</div>
```

```tsx
<div className="font-mono">
  <p className="text-2xl">The quick brown fox jumps over the lazy dog</p>
  <p className="text-text-muted">ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz</p>
  <p className="text-text-muted">0123456789 il1 O0 |/\ {"{} [] ()"} &lt;&gt; -- == =&gt;</p>
</div>
```

## Scale

| Selector | Size            | Weight    | Line-height     | Use                            |
| -------- | --------------- | --------- | --------------- | ------------------------------ |
| `<h1>`   | 1.25rem (20px)  | 600       | `leading-tight` | Page title                     |
| `<h2>`   | 1rem (16px)     | 600       | `leading-tight` | Section header                 |
| `<h3>`   | 0.875rem (14px) | 600       | `leading-snug`  | Subsection / form group header |
| `<body>` | 0.875rem (14px) | 400       | 1.5             | Default text                   |
| —        | 0.75rem (12px)  | 400 / 500 | 1.4             | Captions, hints, table meta    |

Heading sizes are applied at the element level — no defaults for `h4`–`h6`.

## Body and small text

Smaller text — captions, hints, secondary meta — uses `text-xs` (12px), often paired with `text-text-muted`.

**Example**

```html
<p>Customers are billed at the end of each calendar month.</p>
<p class="text-xs text-text-muted">Last invoice generated 14 days ago.</p>
```

```tsx
<p>Customers are billed at the end of each calendar month.</p>
<p className="text-xs text-text-muted">
  Last invoice generated 14 days ago.
</p>
```

## Weights

Regular (400), medium (500), and semibold (600).

**Example**

```html
<p>Regular — body copy and long-form text.</p>
<p class="font-medium">Medium — labels, button text, active states.</p>
<p class="font-semibold">Semibold — headings, KPI numbers, table column headers.</p>
```

```tsx
<p>Regular — body copy and long-form text.</p>
<p className="font-medium">Medium — labels, button text, active states.</p>
<p className="font-semibold">
  Semibold — headings, KPI numbers, table column headers.
</p>
```

## Monospace

Use `font-mono` for IDs, hashes, currency amounts, and figures that must align.

**Example**

```html
<p>
  Order <span class="font-mono">#A7F31B-2014</span> was processed in
  <span class="font-mono">142 ms</span>.
</p>
```

```tsx
<p>
  Order <span className="font-mono">#A7F31B-2014</span> was processed in
  <span className="font-mono">142 ms</span>.
</p>
```
