# Checkboxes

> Independent on/off toggles.

## Examples

### Default

**Example**

```html
<input type="checkbox" class="checkbox" /> <input type="checkbox" class="checkbox" checked />
```

```tsx
<Checkbox />
<Checkbox defaultChecked />
```

### Disabled

**Example**

```html
<input type="checkbox" class="checkbox" disabled />
<input type="checkbox" class="checkbox" disabled checked />
```

```tsx
<Checkbox disabled />
<Checkbox disabled defaultChecked />
```

### Indeterminate

Set imperatively in vanilla via `node.indeterminate = true`; React takes an `indeterminate` prop. The CSS treats it identically to checked.

**Example**

```html
<input type="checkbox" class="checkbox" id="indeterm" />
<script>
  document.getElementById("indeterm").indeterminate = true;
</script>
```

```tsx
<Checkbox indeterminate />
```

### Inside a Field

A `<label>` wrapping a `.checkbox` lays out inline automatically.

**Example**

```html
<div class="field">
  <label class="field-label">
    <input type="checkbox" class="checkbox" name="newsletter" />
    Subscribe to the newsletter
  </label>
  <p class="field-description">One short email per month. Unsubscribe anytime.</p>
</div>
```

```tsx
<Field name="newsletter">
  <Field.Label>
    <Checkbox />
    Subscribe to the newsletter
  </Field.Label>
  <Field.Description>One short email per month. Unsubscribe anytime.</Field.Description>
</Field>
```
