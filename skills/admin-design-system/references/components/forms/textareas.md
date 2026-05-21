# Textareas

> Base class .textarea + a variant + an optional size.

## Examples

### Variants

**Example**

```html
<textarea class="textarea textarea-bordered" placeholder="Bordered (default)"></textarea>
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
<textarea class="textarea textarea-bordered textarea-sm" placeholder="Small"></textarea>
<textarea class="textarea textarea-bordered" placeholder="Medium"></textarea>
<textarea class="textarea textarea-bordered textarea-lg" placeholder="Large"></textarea>
```

```tsx
<Textarea textareaSize="sm" placeholder="Small" />
<Textarea placeholder="Medium" />
<Textarea textareaSize="lg" placeholder="Large" />
```

### Disabled

**Example**

```html
<textarea class="textarea textarea-bordered" disabled>Disabled</textarea>
```

```tsx
<Textarea disabled defaultValue="Disabled" />
```

### Inside a Field

Same Base UI wiring as `Input` — label, description, validation, invalid border tint.

**Example**

```html
<div class="field">
  <label class="field-label" for="notes">Notes</label>
  <textarea
    id="notes"
    class="textarea textarea-bordered"
    placeholder="Anything you'd like to share"
  ></textarea>
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
