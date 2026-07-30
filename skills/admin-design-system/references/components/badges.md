# Badges

> Compact status indicator for tags and counts.

## Contents

- [Examples](#examples)
  - [Variants](#variants)
  - [Sizes](#sizes)
  - [Soft](#soft)
  - [With a leading icon](#with-a-leading-icon)
  - [Counts](#counts)
  - [Trend deltas](#trend-deltas)
  - [Dismissible](#dismissible)
- [Reference](#reference)
  - [React](#react)
  - [Vanilla](#vanilla)

## Examples

### Variants

**Example**

```html
<span class="badge">Draft</span>
<span class="badge badge-info">Info</span>
<span class="badge badge-success">Active</span>
<span class="badge badge-warning">Review</span>
<span class="badge badge-danger">Blocked</span>
<span class="badge badge-primary">New</span>
```

```tsx
<Badge>Draft</Badge>
<Badge variant="info">Info</Badge>
<Badge variant="success">Active</Badge>
<Badge variant="warning">Review</Badge>
<Badge variant="danger">Blocked</Badge>
<Badge variant="primary">New</Badge>
```

### Sizes

**Example**

```html
<span class="badge badge-success badge-sm">SM</span>
<span class="badge badge-success">MD</span>
<span class="badge badge-success badge-lg">LG</span>
```

```tsx
<Badge variant="success" size="sm">SM</Badge>
<Badge variant="success">MD</Badge>
<Badge variant="success" size="lg">LG</Badge>
```

### Soft

**Example**

```html
<span class="badge badge-info badge-soft">Info</span>
<span class="badge badge-success badge-soft">Active</span>
<span class="badge badge-warning badge-soft">Review</span>
<span class="badge badge-danger badge-soft">Blocked</span>
<span class="badge badge-primary badge-soft">New</span>
```

```tsx
<Badge variant="info" soft>Info</Badge>
<Badge variant="success" soft>Active</Badge>
<Badge variant="warning" soft>Review</Badge>
<Badge variant="danger" soft>Blocked</Badge>
<Badge variant="primary" soft>New</Badge>
```

### With a leading icon

**Example**

```html
<span class="badge badge-success">
  <i class="ti ti-circle-check" aria-hidden="true"></i>
  Passed
</span>
<span class="badge badge-warning">
  <i class="ti ti-alert-triangle" aria-hidden="true"></i>
  Needs review
</span>
```

```tsx
<Badge variant="success" icon={IconCircleCheck}>Passed</Badge>
<Badge variant="warning" icon={IconAlertTriangle}>Needs review</Badge>
```

### Counts

**Example**

```html
<span class="badge badge-primary badge-sm">12</span> <span class="badge badge-sm">99+</span>
```

```tsx
<Badge variant="primary" size="sm">12</Badge> <Badge size="sm">99+</Badge>
```

### Trend deltas

Direction-to-tone is domain-specific — a falling error rate is good.

**Example**

```html
<span class="badge badge-success badge-soft">
  <i class="ti ti-trending-up" aria-hidden="true"></i>
  +12.4%
</span>
<span class="badge badge-danger badge-soft">
  <i class="ti ti-trending-down" aria-hidden="true"></i>
  -3.1%
</span>
```

```tsx
<Badge variant="success" soft icon={IconTrendingUp}>+12.4%</Badge>
<Badge variant="danger" soft icon={IconTrendingDown}>-3.1%</Badge>
```

### Dismissible

**Example**

```html
<span class="badge badge-info badge-soft">
  Digital salg
  <button type="button" class="badge-remove" aria-label="Remove Digital salg">
    <i class="ti ti-x" aria-hidden="true"></i>
  </button>
</span>
```

```tsx
<Badge variant="info" soft onRemove={() => {}} removeLabel="Remove Digital salg">
  Digital salg
</Badge>
```

**Caution** — The remove button is icon-only, so it needs its own accessible name. React sets one from `removeLabel`; in vanilla, write the `aria-label` yourself.

## Reference

### React

| Prop          | Type                                                                     | Default     |
| ------------- | ------------------------------------------------------------------------ | ----------- |
| `variant`     | `"neutral" \| "info" \| "success" \| "warning" \| "danger" \| "primary"` | `"neutral"` |
| `size`        | `"sm" \| "md" \| "lg"`                                                   | `"md"`      |
| `soft`        | `boolean`                                                                | `false`     |
| `icon`        | `IconProp`                                                               | —           |
| `onRemove`    | `MouseEventHandler<HTMLButtonElement>`                                   | —           |
| `removeLabel` | `string`                                                                 | `"Remove"`  |

`soft` gives a tinted fill; `icon` is the leading slot. `onRemove` renders the trailing remove button and takes its accessible name from `removeLabel` — React supplies the × glyph, vanilla supplies the icon.

Plus native `<span>` attributes. `Badge` takes no `classNames` — the remove button isn't reachable from outside.

### Vanilla

| Class / var                                                 | Effect                                                                                                        |
| ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `badge`                                                     | Inline-flex pill: `1.25rem` tall, `0.5rem` side padding, `text-xs`, full radius, neutral fill                 |
| `badge-info` `badge-success` `badge-warning` `badge-danger` | Solid status fill with matching border and `-content` text                                                    |
| `badge-primary`                                             | Solid brand fill; no border colour                                                                            |
| `badge-soft`                                                | Pair with a variant for a `-muted` fill and accent text. `warning` and `primary` keep the default text colour |
| `badge-sm`                                                  | `1rem` tall, `0.625rem` text                                                                                  |
| `badge-lg`                                                  | `1.5rem` tall, `text-sm`                                                                                      |
| `badge-remove`                                              | Trailing icon button, `0.875rem` square; nest it inside the badge so `badge-sm`/`badge-lg` can scale it       |

There is no `badge-neutral` or `badge-md` — both are the unmodified `badge`. A direct-child `<i>` or `<svg>` is kept from shrinking; no wrapper class needed.
