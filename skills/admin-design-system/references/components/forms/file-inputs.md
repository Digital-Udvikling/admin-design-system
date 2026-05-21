# File inputs

> Styled native file picker.

The `.file-input` class uses `::file-selector-button` to style the "Choose file" button. `FileInput` does the same in React.

## Examples

### Variants

**Example**

```html
<input type="file" class="file-input file-input-bordered" />
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
<input type="file" class="file-input file-input-bordered file-input-sm" />
<input type="file" class="file-input file-input-bordered" />
<input type="file" class="file-input file-input-bordered file-input-lg" />
```

```tsx
<FileInput inputSize="sm" />
<FileInput />
<FileInput inputSize="lg" />
```

### Restricting file types

Native `accept` and `multiple` flow through unchanged.

**Example**

```html
<input type="file" class="file-input file-input-bordered" accept="image/*" multiple />
```

```tsx
<FileInput accept="image/*" multiple />
```

### Disabled

**Example**

```html
<input type="file" class="file-input file-input-bordered" disabled />
```

```tsx
<FileInput disabled />
```
