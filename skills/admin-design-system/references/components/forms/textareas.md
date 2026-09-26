# Textareas

> Multi-line text input.

## Examples

### Variants

**Example**

```html
<textarea class="textarea" placeholder="Bordered (default)"></textarea>
<textarea class="textarea textarea-ghost" placeholder="Ghost"></textarea>
```

```tsx
<Textarea placeholder="Bordered (default)" />
<Textarea variant="ghost" placeholder="Ghost" />
```

### Invalid

**Example**

```html
<textarea class="textarea" aria-label="Notes" aria-invalid="true">too short</textarea>
```

```tsx
<Textarea aria-label="Notes" aria-invalid defaultValue="too short" />
```

### Sizes

**Example**

```html
<textarea class="textarea textarea-sm" placeholder="Small"></textarea>
<textarea class="textarea" placeholder="Medium"></textarea>
<textarea class="textarea textarea-lg" placeholder="Large"></textarea>
```

```tsx
<Textarea size="sm" placeholder="Small" />
<Textarea placeholder="Medium" />
<Textarea size="lg" placeholder="Large" />
```

### Auto-resize

**Example**

```html
<textarea class="textarea textarea-autosize" rows="4" placeholder="Grows as you type"></textarea>
```

```tsx
<Textarea autoResize rows={4} placeholder="Grows as you type" />
```

### Disabled

**Example**

```html
<textarea class="textarea" disabled aria-label="Notes">Disabled</textarea>
```

```tsx
<Textarea disabled aria-label="Notes" defaultValue="Disabled" />
```

## Reference

### React

| Prop         | Type                    | Default      |
| ------------ | ----------------------- | ------------ |
| `variant`    | `"bordered" \| "ghost"` | `"bordered"` |
| `size`       | `"sm" \| "md" \| "lg"`  | `"md"`       |
| `autoResize` | `boolean`               | `false`      |

Renders a `<textarea>` through Base UI's `Field.Control`, so inside a [Field](fields.md) it gets the same id, label association and validity wiring as an `Input`, and works standalone outside one. Plus native `<textarea>` attributes.

### Vanilla

| Class                   | Effect                                                                                                            |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `textarea`              | Full-width box, `0.75rem`/`0.5rem` padding, `0.375rem` radius, `text-sm`, `5rem` min-height, vertically resizable |
| `textarea-ghost`        | No fill or border; a translucent wash on hover                                                                    |
| `textarea-sm`           | `text-xs`, tighter padding, `4rem` min-height                                                                     |
| `textarea-lg`           | `text-base`, looser padding, `6rem` min-height                                                                    |
| `textarea-autosize`     | Height tracks content, floored at `rows`; manual resizing is off                                                  |
| `[aria-invalid="true"]` | Danger border and focus outline                                                                                   |

There is no `textarea-bordered` or `textarea-md` — both are the unmodified `textarea`.

The danger look also applies to Base UI's `[data-invalid]`, to `:user-invalid` once the user has edited the value, and inside an invalid [Field](fields.md).

`textarea-autosize` is `field-sizing: content`, so growth needs no JavaScript. Its floor is whichever is larger, the class's `min-height` or the `rows` attribute; cap it with your own `max-height`. Browsers without `field-sizing` keep the fixed, resizable box, the same as omitting the class.
