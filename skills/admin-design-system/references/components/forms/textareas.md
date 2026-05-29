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

### Status variants

`info`, `success`, and `warning` carry the signal through the border and focus ring — text stays readable.

**Example**

```html
<textarea class="textarea textarea-info">Info</textarea>
<textarea class="textarea textarea-success">Success</textarea>
<textarea class="textarea textarea-warning">Warning</textarea>
```

```tsx
<Textarea variant="info" defaultValue="Info" />
<Textarea variant="success" defaultValue="Success" />
<Textarea variant="warning" defaultValue="Warning" />
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

### Auto-resize

Height tracks content via CSS `field-sizing` — no JavaScript. `rows` (or `min-height`) is the floor; cap growth with `max-height`. Chromium-only today; other browsers fall back to a fixed, resizable box.

**Example**

```html
<textarea class="textarea textarea-autosize" rows="2" placeholder="Grows as you type"></textarea>
```

```tsx
<Textarea autoResize rows={2} placeholder="Grows as you type" />
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
