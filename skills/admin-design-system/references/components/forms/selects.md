# Selects

> Compound Select with Trigger + Popup + Item.

React's `Select` is a Base UI compound primitive (`Select.Trigger`, `Select.Popup`, `Select.Item`) with a custom popup. Vanilla falls back to a native `<select>` styled with `.select` — the popup chrome itself can only be customized in React.

## Examples

### Default

Wrap each item's label in `<Select.ItemText>` so `<Select.Value>` can render the selected label in the trigger.

**Example**

```html
<select class="select select-bordered">
  <option value="">Select a status…</option>
  <option value="open">Open</option>
  <option value="in-progress">In progress</option>
  <option value="closed">Closed</option>
</select>
```

```tsx
<Select name="status">
  <Select.Trigger>
    <Select.Value placeholder="Select a status…" />
    <Select.Icon />
  </Select.Trigger>
  <Select.Popup>
    <Select.Item value="open">
      <Select.ItemText>Open</Select.ItemText>
      <Select.ItemIndicator />
    </Select.Item>
    <Select.Item value="in-progress">
      <Select.ItemText>In progress</Select.ItemText>
      <Select.ItemIndicator />
    </Select.Item>
    <Select.Item value="closed">
      <Select.ItemText>Closed</Select.ItemText>
      <Select.ItemIndicator />
    </Select.Item>
  </Select.Popup>
</Select>
```

### Variants

**Example**

```html
<select class="select select-bordered">
  <option>Bordered</option>
</select>
<select class="select select-ghost">
  <option>Ghost</option>
</select>
<select class="select select-danger">
  <option>Danger</option>
</select>
```

```tsx
<Select defaultValue="x">
  <Select.Trigger>
    <Select.Value />
    <Select.Icon />
  </Select.Trigger>
  <Select.Popup>
    <Select.Item value="x">Bordered</Select.Item>
  </Select.Popup>
</Select>
<Select defaultValue="x">
  <Select.Trigger variant="ghost">
    <Select.Value />
    <Select.Icon />
  </Select.Trigger>
  <Select.Popup>
    <Select.Item value="x">Ghost</Select.Item>
  </Select.Popup>
</Select>
<Select defaultValue="x">
  <Select.Trigger variant="danger">
    <Select.Value />
    <Select.Icon />
  </Select.Trigger>
  <Select.Popup>
    <Select.Item value="x">Danger</Select.Item>
  </Select.Popup>
</Select>
```

### Sizes

**Example**

```html
<select class="select select-bordered select-sm">
  <option>Small</option>
</select>
<select class="select select-bordered">
  <option>Medium</option>
</select>
<select class="select select-bordered select-lg">
  <option>Large</option>
</select>
```

```tsx
<Select defaultValue="x">
  <Select.Trigger triggerSize="sm">
    <Select.Value />
    <Select.Icon />
  </Select.Trigger>
  <Select.Popup>
    <Select.Item value="x">Small</Select.Item>
  </Select.Popup>
</Select>
<Select defaultValue="x">
  <Select.Trigger>
    <Select.Value />
    <Select.Icon />
  </Select.Trigger>
  <Select.Popup>
    <Select.Item value="x">Medium</Select.Item>
  </Select.Popup>
</Select>
<Select defaultValue="x">
  <Select.Trigger triggerSize="lg">
    <Select.Value />
    <Select.Icon />
  </Select.Trigger>
  <Select.Popup>
    <Select.Item value="x">Large</Select.Item>
  </Select.Popup>
</Select>
```

### Groups

**Example**

```html
<select class="select select-bordered">
  <optgroup label="Fruit">
    <option>Apple</option>
    <option>Banana</option>
  </optgroup>
  <optgroup label="Veg">
    <option>Carrot</option>
    <option>Daikon</option>
  </optgroup>
</select>
```

```tsx
<Select>
  <Select.Trigger>
    <Select.Value placeholder="Pick one…" />
    <Select.Icon />
  </Select.Trigger>
  <Select.Popup>
    <Select.Group>
      <Select.GroupLabel>Fruit</Select.GroupLabel>
      <Select.Item value="apple">
        Apple
        <Select.ItemIndicator />
      </Select.Item>
      <Select.Item value="banana">
        Banana
        <Select.ItemIndicator />
      </Select.Item>
    </Select.Group>
    <Select.Group>
      <Select.GroupLabel>Veg</Select.GroupLabel>
      <Select.Item value="carrot">
        Carrot
        <Select.ItemIndicator />
      </Select.Item>
      <Select.Item value="daikon">
        Daikon
        <Select.ItemIndicator />
      </Select.Item>
    </Select.Group>
  </Select.Popup>
</Select>
```

### Disabled

**Example**

```html
<select class="select select-bordered" disabled>
  <option>Disabled</option>
</select>
```

```tsx
<Select disabled defaultValue="x">
  <Select.Trigger>
    <Select.Value />
    <Select.Icon />
  </Select.Trigger>
  <Select.Popup>
    <Select.Item value="x">Disabled</Select.Item>
  </Select.Popup>
</Select>
```

### Inside a Field

**Example**

```html
<div class="field">
  <label class="field-label" for="role">Role</label>
  <select id="role" class="select select-bordered" required>
    <option value="">Pick a role…</option>
    <option value="admin">Admin</option>
    <option value="member">Member</option>
  </select>
</div>
```

```tsx
<Field name="role">
  <Field.Label>Role</Field.Label>
  <Select required>
    <Select.Trigger>
      <Select.Value placeholder="Pick a role…" />
      <Select.Icon />
    </Select.Trigger>
    <Select.Popup>
      <Select.Item value="admin">
        Admin
        <Select.ItemIndicator />
      </Select.Item>
      <Select.Item value="member">
        Member
        <Select.ItemIndicator />
      </Select.Item>
    </Select.Popup>
  </Select>
  <Field.Error match="valueMissing">Pick a role.</Field.Error>
</Field>
```
