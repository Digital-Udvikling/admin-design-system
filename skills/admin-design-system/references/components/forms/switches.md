# Switches

> Immediate on/off setting.

For form submissions, prefer a [checkbox](checkboxes.md).

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

### Inside a Field

`.field-row` lays the switch and label out on one line; the default `.field` stacks vertically.

**Example**

```html
<div class="field field-row">
  <input type="checkbox" role="switch" class="switch" checked />
  <label class="field-label">Email notifications</label>
</div>
```

```tsx
<Field inline label="Email notifications">
  <Switch defaultChecked />
</Field>
```
