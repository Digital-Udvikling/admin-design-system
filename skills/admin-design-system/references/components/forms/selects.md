# Selects

> Compound Select with Trigger + Popup + Item.

React's `Select` is a compound (`Select.Trigger`, `Select.Popup`, `Select.Item`) with a custom popup. Vanilla uses a native `<select>` with the `.select` class — the browser owns its dropdown UI.

## Examples

### Default

Pass an `items` map (value → label) to `<Select>` so `<Select.Value>` can show the selected label in the trigger; without it, the trigger falls back to the raw value.

**Example**

```html
<select class="select">
  <option value="">Select a status…</option>
  <option value="open">Open</option>
  <option value="in-progress">In progress</option>
  <option value="closed">Closed</option>
</select>
```

```tsx
<Select name="status" items={{ open: "Open", "in-progress": "In progress", closed: "Closed" }}>
  <Select.Trigger>
    <Select.Value placeholder="Select a status…" />
    <Select.Icon />
  </Select.Trigger>
  <Select.Popup>
    <Select.Item value="open">
      Open
      <Select.ItemIndicator />
    </Select.Item>
    <Select.Item value="in-progress">
      In progress
      <Select.ItemIndicator />
    </Select.Item>
    <Select.Item value="closed">
      Closed
      <Select.ItemIndicator />
    </Select.Item>
  </Select.Popup>
</Select>
```

### Variants

**Example**

```html
<select class="select">
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
<Select defaultValue="x" items={{ x: "Bordered" }}>
  <Select.Trigger>
    <Select.Value />
    <Select.Icon />
  </Select.Trigger>
  <Select.Popup>
    <Select.Item value="x">Bordered</Select.Item>
  </Select.Popup>
</Select>
<Select defaultValue="x" items={{ x: "Ghost" }}>
  <Select.Trigger variant="ghost">
    <Select.Value />
    <Select.Icon />
  </Select.Trigger>
  <Select.Popup>
    <Select.Item value="x">Ghost</Select.Item>
  </Select.Popup>
</Select>
<Select defaultValue="x" items={{ x: "Danger" }}>
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
<select class="select select-sm">
  <option>Small</option>
</select>
<select class="select">
  <option>Medium</option>
</select>
<select class="select select-lg">
  <option>Large</option>
</select>
```

```tsx
<Select defaultValue="x" items={{ x: "Small" }}>
  <Select.Trigger triggerSize="sm">
    <Select.Value />
    <Select.Icon />
  </Select.Trigger>
  <Select.Popup>
    <Select.Item value="x">Small</Select.Item>
  </Select.Popup>
</Select>
<Select defaultValue="x" items={{ x: "Medium" }}>
  <Select.Trigger>
    <Select.Value />
    <Select.Icon />
  </Select.Trigger>
  <Select.Popup>
    <Select.Item value="x">Medium</Select.Item>
  </Select.Popup>
</Select>
<Select defaultValue="x" items={{ x: "Large" }}>
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
<select class="select">
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
<Select items={{ apple: "Apple", banana: "Banana", carrot: "Carrot", daikon: "Daikon" }}>
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
<select class="select" disabled>
  <option>Disabled</option>
</select>
```

```tsx
<Select disabled defaultValue="x" items={{ x: "Disabled" }}>
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
  <select id="role" class="select" required>
    <option value="">Pick a role…</option>
    <option value="admin">Admin</option>
    <option value="member">Member</option>
  </select>
</div>
```

```tsx
<Field name="role">
  <Field.Label>Role</Field.Label>
  <Select required items={{ admin: "Admin", member: "Member" }}>
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
