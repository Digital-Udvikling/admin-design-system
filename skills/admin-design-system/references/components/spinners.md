# Spinners

> Compact CSS-only loading indicator.

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

**Example**

```html
<output class="spinner" aria-label="Indlæser"></output>
```

```tsx
<Spinner label="Indlæser" />
```

## Reference

### React

| Prop    | Type                   | Default     |
| ------- | ---------------------- | ----------- |
| `size`  | `"sm" \| "md" \| "lg"` | `"md"`      |
| `label` | `string`               | `"Loading"` |

Renders `<output>`, whose implicit `role="status"` announces the `label` politely. Plus native `<output>` attributes.

For a button, use its `loading` prop instead — see [Buttons › Loading](buttons.md#loading).

### Vanilla

| Class        | Effect                                                                                     |
| ------------ | ------------------------------------------------------------------------------------------ |
| `spinner`    | `1rem` circle, `2px` ring at 25% `currentColor` with a solid top edge, one turn per `0.6s` |
| `spinner-sm` | `0.75rem`, `1.5px` ring                                                                    |
| `spinner-lg` | `1.5rem`, `3px` ring                                                                       |

The arc is `currentColor`, so it follows the surrounding text colour. Under `prefers-reduced-motion: reduce` the rotation slows to `2s` rather than stopping, since a frozen spinner reads as a hung request. `<output>` carries `role="status"` for free but no accessible name — write the `aria-label` yourself.
