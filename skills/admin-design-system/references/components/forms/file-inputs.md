# File inputs

> File picker styled to match other inputs.

## Examples

### Variants

**Example**

```html
<input type="file" class="file-input" aria-label="Bordered" />
<input type="file" class="file-input file-input-ghost" aria-label="Ghost" />
```

```tsx
<FileInput aria-label="Bordered" />
<FileInput variant="ghost" aria-label="Ghost" />
```

### Invalid

**Example**

```html
<input type="file" class="file-input" aria-label="Invoice" aria-invalid="true" />
```

```tsx
<FileInput aria-label="Invoice" aria-invalid />
```

### Sizes

**Example**

```html
<input type="file" class="file-input file-input-sm" aria-label="Small" />
<input type="file" class="file-input" aria-label="Medium" />
<input type="file" class="file-input file-input-lg" aria-label="Large" />
```

```tsx
<FileInput size="sm" aria-label="Small" />
<FileInput aria-label="Medium" />
<FileInput size="lg" aria-label="Large" />
```

### Restricting file types

**Example**

```html
<input type="file" class="file-input" accept="image/*" multiple aria-label="Images" />
```

```tsx
<FileInput accept="image/*" multiple aria-label="Images" />
```

### Disabled

**Example**

```html
<input type="file" class="file-input" disabled aria-label="Attachment" />
```

```tsx
<FileInput disabled aria-label="Attachment" />
```

## Reference

### React

| Prop      | Type                    | Default      |
| --------- | ----------------------- | ------------ |
| `variant` | `"bordered" \| "ghost"` | `"bordered"` |
| `size`    | `"sm" \| "md" \| "lg"`  | `"md"`       |

The native `size` attribute doesn't apply to file inputs. `type` is fixed to `"file"`. Plus native `<input>` attributes, including `accept`, `multiple` and `capture`.

For a label, description and validation, wrap it in a [Field](fields.md).

### Vanilla

| Class              | Effect                                                                                                                                                                      |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `file-input`       | `2rem` tall, bordered `0.375rem`-radius shell around a native picker; the full-height button gets `0.75rem` side padding, `text-sm` medium, a muted fill and a right border |
| `file-input-ghost` | Shell has no fill or border until hover; the button takes a full border and radius, like a `.btn`                                                                           |
| `file-input-sm`    | `1.625rem` tall, `text-xs`, tighter button padding                                                                                                                          |
| `file-input-lg`    | `2.375rem` tall, `text-base`, looser button padding                                                                                                                         |

There is no `file-input-bordered` or `file-input-md` — both are the unmodified `file-input`. The picker button is the browser's own, styled through `::file-selector-button`, so its label text is the browser's and can't be changed from CSS. The filename that follows it is also the browser's, which is why the shell clips its overflow rather than growing.

An input with `aria-invalid="true"` or `data-invalid`, one that matches `:user-invalid`, and one inside a `.field[data-invalid]` get a danger border and focus outline.
