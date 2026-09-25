# File inputs

> File picker styled to match other inputs.

## Examples

### Variants

**Example**

```html
<input type="file" class="file-input" />
<input type="file" class="file-input file-input-ghost" />
<input type="file" class="file-input file-input-danger" />
```

```tsx
<FileInput />
<FileInput variant="ghost" />
<FileInput variant="danger" />
```

### Sizes

**Example**

```html
<input type="file" class="file-input file-input-sm" />
<input type="file" class="file-input" />
<input type="file" class="file-input file-input-lg" />
```

```tsx
<FileInput size="sm" />
<FileInput />
<FileInput size="lg" />
```

### Restricting file types

**Example**

```html
<input type="file" class="file-input" accept="image/*" multiple />
```

```tsx
<FileInput accept="image/*" multiple />
```

### Disabled

**Example**

```html
<input type="file" class="file-input" disabled />
```

```tsx
<FileInput disabled />
```

## Reference

### React

| Prop        | Type                                | Default      |
| ----------- | ----------------------------------- | ------------ |
| `variant`   | `"bordered" \| "ghost" \| "danger"` | `"bordered"` |
| `size`      | `"sm" \| "md" \| "lg"`              | `"md"`       |
| `inputSize` | `"sm" \| "md" \| "lg"`              | —            |

`inputSize` is a deprecated alias of `size`; `size` wins when both are set. The native `size` attribute doesn't apply to file inputs. `type` is fixed to `"file"`. Plus native `<input>` attributes, including `accept`, `multiple` and `capture`.

There are no status variants beyond `danger`, and no `info` / `success` / `warning`, unlike [Inputs](inputs.md). For a label, description and validation, wrap it in a [Field](fields.md).

### Vanilla

| Class               | Effect                                                                                                                                                                      |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `file-input`        | `2rem` tall, bordered `0.375rem`-radius shell around a native picker; the full-height button gets `0.75rem` side padding, `text-sm` medium, a muted fill and a right border |
| `file-input-ghost`  | Shell has no fill or border until hover; the button takes a full border and radius, like a `.btn`                                                                           |
| `file-input-danger` | Danger border and focus outline                                                                                                                                             |
| `file-input-sm`     | `1.625rem` tall, `text-xs`, tighter button padding                                                                                                                          |
| `file-input-lg`     | `2.375rem` tall, `text-base`, looser button padding                                                                                                                         |

There is no `file-input-bordered` or `file-input-md` — both are the unmodified `file-input`. The picker button is the browser's own, styled through `::file-selector-button`, so its label text is the browser's and can't be changed from CSS. The filename that follows it is also the browser's, which is why the shell clips its overflow rather than growing.

The danger look also applies without the modifier: to an input with `aria-invalid="true"` or `data-invalid`, one that matches `:user-invalid`, and one inside a `.field[data-invalid]`.
