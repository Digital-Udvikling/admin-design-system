# Progress

> Styled native <progress> element.

## Examples

### Determinate

**Example**

```html
<progress class="progress" value="25" max="100"></progress>
<progress class="progress" value="60" max="100"></progress>
<progress class="progress" value="90" max="100"></progress>
```

```tsx
<Progress value={25} />
<Progress value={60} />
<Progress value={90} />
```

### Indeterminate

**Example**

```html
<progress class="progress"></progress>
```

```tsx
<Progress />
```

### Variants

**Example**

```html
<progress class="progress" value="40" max="100"></progress>
<progress class="progress progress-success" value="40" max="100"></progress>
<progress class="progress progress-warning" value="40" max="100"></progress>
<progress class="progress progress-danger" value="40" max="100"></progress>
```

```tsx
<Progress value={40} />
<Progress value={40} variant="success" />
<Progress value={40} variant="warning" />
<Progress value={40} variant="danger" />
```

### Sizes

**Example**

```html
<progress class="progress progress-sm" value="50" max="100"></progress>
<progress class="progress" value="50" max="100"></progress>
<progress class="progress progress-lg" value="50" max="100"></progress>
```

```tsx
<Progress value={50} size="sm" />
<Progress value={50} />
<Progress value={50} size="lg" />
```

**Caution** — `<progress>` exposes its value to assistive tech but has no implicit accessible name. Label it with an associated `<label>`, `aria-label`, or `aria-labelledby` so screen readers announce what it tracks.

## Reference

### React

| Prop      | Type                                           | Default  |
| --------- | ---------------------------------------------- | -------- |
| `value`   | `number`                                       | —        |
| `max`     | `number`                                       | `100`    |
| `variant` | `"info" \| "success" \| "warning" \| "danger"` | `"info"` |
| `size`    | `"sm" \| "md" \| "lg"`                         | `"md"`   |

Omitting `value` (or passing `undefined`) gives an indeterminate bar. Plus native `<progress>` attributes.

### Vanilla

| Class              | Effect                                                               |
| ------------------ | -------------------------------------------------------------------- |
| `progress`         | `0.375rem` tall full-width pill, `surface-strong` track, `info` fill |
| `progress-success` | Success fill                                                         |
| `progress-warning` | Warning fill                                                         |
| `progress-danger`  | Danger fill                                                          |
| `progress-sm`      | `0.25rem` tall                                                       |
| `progress-lg`      | `0.5rem` tall                                                        |

There is no `progress-info` or `progress-md` — both are the unmodified `progress`. The fill is `currentColor`, so the variants only set `color`; setting it yourself recolours the bar. Drop the `value` attribute for the indeterminate state, which animates a gradient across the track (slowed to `3s` under `prefers-reduced-motion: reduce`) — the engines disagree about the value pseudo-element when indeterminate, so both are blanked.
