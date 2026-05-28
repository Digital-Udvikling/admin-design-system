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

### Inside a Field

**Example**

```html
<div class="field">
  <label class="field-label" for="avatar">Avatar</label>
  <input id="avatar" type="file" class="file-input" accept="image/*" />
  <p class="field-description">PNG or JPEG, up to 2 MB.</p>
</div>
```

```tsx
<Field name="avatar">
  <Field.Label>Avatar</Field.Label>
  <FileInput accept="image/*" />
  <Field.Description>PNG or JPEG, up to 2 MB.</Field.Description>
</Field>
```
