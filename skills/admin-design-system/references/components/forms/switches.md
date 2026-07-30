# Switches

> Immediate on/off setting.

## Examples

### Default

**Example**

```html
<input type="checkbox" role="switch" class="switch" />
<input type="checkbox" role="switch" class="switch" checked />
```

```tsx
<Switch />
<Switch defaultChecked />
```

### With a label

**Example**

```html
<label>
  <input type="checkbox" role="switch" class="switch" checked />
  Email notifications
</label>
```

```tsx
<label>
  <Switch defaultChecked />
  Email notifications
</label>
```

### Disabled

**Example**

```html
<input type="checkbox" role="switch" class="switch" disabled />
<input type="checkbox" role="switch" class="switch" disabled checked />
```

```tsx
<Switch disabled />
<Switch disabled defaultChecked />
```

## Reference

### React

| Part           | Renders    | Class          |
| -------------- | ---------- | -------------- |
| `Switch`       | `<button>` | `switch`       |
| `Switch.Thumb` | `<span>`   | `switch-thumb` |

Wraps [Base UI Switch](https://base-ui.com/react/components/switch): `checked` / `defaultChecked` / `onCheckedChange`, `name`, `required`, `disabled`. It renders a `<button role="switch">` with a hidden input for form submission. `Switch` supplies its own thumb; pass `children` only to replace it. Plus native `<button>` attributes.

### Vanilla

| Class          | Effect                                                                     |
| -------------- | -------------------------------------------------------------------------- |
| `switch`       | `2.25rem` × `1.25rem` track, full radius, `border-strong` off / primary on |
| `switch-thumb` | `1rem` paper circle with a shadow, sliding `1rem` when checked             |

Works two ways with identical output. On a native `<input type="checkbox" role="switch">` the appearance is reset and the thumb drawn as a `::before`, keyed off `:checked` — no `switch-thumb` element needed. On a `<button role="switch">` the states come from `[data-checked]`, `[data-unchecked]` and `[data-disabled]`, and the thumb is a real `switch-thumb` child; that's what React emits. Write `role="switch"` yourself on the native input, otherwise it announces as a checkbox.

A wrapping `<label>` is laid out for you: inline row, `0.75rem` gap (wider than a checkbox's, since the track is wider), pointer cursor, dimmed when disabled. Pair it with [`field-row`](fields.md#inline-label) for a label on the same line as the control.

A switch applies its change immediately. For something that only takes effect on submit, use a [checkbox](checkboxes.md).
