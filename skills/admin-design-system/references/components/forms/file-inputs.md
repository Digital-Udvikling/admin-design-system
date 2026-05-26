# File inputs

> File picker styled to match other inputs.

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
