# Textareas

> Multi-line text input.

## Examples

### Variants

**Example**

```html
<textarea class="textarea" placeholder="Bordered (default)"></textarea>
<textarea class="textarea textarea-ghost" placeholder="Ghost"></textarea>
<textarea class="textarea textarea-danger" placeholder="Danger">invalid</textarea>
```

```tsx
<Textarea placeholder="Bordered (default)" />
<Textarea variant="ghost" placeholder="Ghost" />
<Textarea variant="danger" defaultValue="invalid" />
```

### Sizes

**Example**

```html
<textarea class="textarea textarea-sm" placeholder="Small"></textarea>
<textarea class="textarea" placeholder="Medium"></textarea>
<textarea class="textarea textarea-lg" placeholder="Large"></textarea>
```

```tsx
<Textarea textareaSize="sm" placeholder="Small" />
<Textarea placeholder="Medium" />
<Textarea textareaSize="lg" placeholder="Large" />
```

### Disabled

**Example**

```html
<textarea class="textarea" disabled>Disabled</textarea>
```

```tsx
<Textarea disabled defaultValue="Disabled" />
```

### Inside a Field

See [Fields](fields.md) for label, description, and validation.

**Example**

```html
<div class="field">
  <label class="field-label" for="notes">Notes</label>
  <textarea id="notes" class="textarea" placeholder="Anything you'd like to share"></textarea>
  <p class="field-description">Markdown is supported.</p>
</div>
```

```tsx
<Field name="notes">
  <Field.Label>Notes</Field.Label>
  <Textarea placeholder="Anything you'd like to share" />
  <Field.Description>Markdown is supported.</Field.Description>
</Field>
```
