# Spinners

> Compact CSS-only loading indicator.

A pure-CSS rotating arc. The visible edge uses `currentColor`, so it inherits the surrounding text colour.

For buttons, prefer the `.btn-loading` modifier (or React's `loading` prop) — see [Buttons → Loading](../buttons/#loading).

## Examples

### Sizes

**Example**

```html
<output class="spinner spinner-sm" aria-label="Loading"></output>
<output class="spinner" aria-label="Loading"></output>
<output class="spinner spinner-lg" aria-label="Loading"></output>
```

```tsx
<Spinner size="sm" />
<Spinner />
<Spinner size="lg" />
```

### Inherits text colour

**Example**

```html
<span style="color: var(--color-danger)">
  <output class="spinner spinner-sm" aria-label="Loading"></output>
  Retrying connection
</span>
```

```tsx
<span style={{ color: "var(--color-danger)" }}>
  <Spinner size="sm" /> Retrying connection
</span>
```

### Accessible label

The React component sets `aria-label="Loading"` by default. Override via the `label` prop; in vanilla, set `aria-label` directly.

**Example**

```html
<output class="spinner" aria-label="Indlæser"></output>
```

```tsx
<Spinner label="Indlæser" />
```
