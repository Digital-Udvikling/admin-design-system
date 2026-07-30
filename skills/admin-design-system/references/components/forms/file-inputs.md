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
<FileInput inputSize="sm" />
<FileInput />
<FileInput inputSize="lg" />
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
| `inputSize` | `"sm" \| "md" \| "lg"`              | `"md"`       |

The size prop is `inputSize` because `<input>` has a native `size` attribute — see [Conventions › Sizes](../../basics/conventions.md#sizes). `type` is fixed to `"file"`. Plus native `<input>` attributes, including `accept`, `multiple` and `capture`.

There are no status variants beyond `danger`, and no `info` / `success` / `warning`, unlike [Inputs](inputs.md). For a label, description and validation, wrap it in a [Field](fields.md).

### Vanilla

| Class               | Effect                                                                                                                                               |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `file-input`        | Bordered `0.5rem`-radius shell around a native picker; the button gets `0.75rem`/`0.5rem` padding, `text-sm` medium, a muted fill and a right border |
| `file-input-ghost`  | Shell has no fill or border until hover                                                                                                              |
| `file-input-danger` | Danger border and focus outline                                                                                                                      |
| `file-input-sm`     | `text-xs`, tighter button padding                                                                                                                    |
| `file-input-lg`     | `text-base`, looser button padding                                                                                                                   |

There is no `file-input-bordered` or `file-input-md` — both are the unmodified `file-input`. The picker button is the browser's own, styled through `::file-selector-button`, so its label text is the browser's and can't be changed from CSS. The filename that follows it is also the browser's, which is why the shell clips its overflow rather than growing.
