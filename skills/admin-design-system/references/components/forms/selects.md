# Selects

> Pick one value from a collapsed list.

## Contents

- [Examples](#examples)
  - [Default](#default)
  - [Variants](#variants)
  - [Sizes](#sizes)
  - [Groups](#groups)
  - [Leading icon (React only)](#leading-icon-react-only)
  - [Disabled](#disabled)
  - [Inside a Field](#inside-a-field)
- [Reference](#reference)
  - [React](#react)
  - [Vanilla](#vanilla)

React's `Select` is a compound with a custom popup. Vanilla uses a native `<select>` with the `.select` class — the browser owns its dropdown UI, so the two paths share styling but not structure.

## Examples

### Default

**Example**

```html
<select class="select" aria-label="Status">
  <option value="">Select a status…</option>
  <option value="open">Open</option>
  <option value="in-progress">In progress</option>
  <option value="closed">Closed</option>
</select>
```

```tsx
<Select name="status" items={{ open: "Open", "in-progress": "In progress", closed: "Closed" }}>
  <Select.Trigger aria-label="Status">
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
<select class="select" aria-label="Bordered">
  <option>Bordered</option>
</select>
<select class="select select-ghost" aria-label="Ghost">
  <option>Ghost</option>
</select>
<select class="select select-danger" aria-label="Danger">
  <option>Danger</option>
</select>
```

```tsx
<Select defaultValue="x" items={{ x: "Bordered" }}>
  <Select.Trigger aria-label="Bordered">
    <Select.Value />
    <Select.Icon />
  </Select.Trigger>
  <Select.Popup>
    <Select.Item value="x">Bordered</Select.Item>
  </Select.Popup>
</Select>
<Select defaultValue="x" items={{ x: "Ghost" }}>
  <Select.Trigger variant="ghost" aria-label="Ghost">
    <Select.Value />
    <Select.Icon />
  </Select.Trigger>
  <Select.Popup>
    <Select.Item value="x">Ghost</Select.Item>
  </Select.Popup>
</Select>
<Select defaultValue="x" items={{ x: "Danger" }}>
  <Select.Trigger variant="danger" aria-label="Danger">
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
<select class="select select-sm" aria-label="Small">
  <option>Small</option>
</select>
<select class="select" aria-label="Medium">
  <option>Medium</option>
</select>
<select class="select select-lg" aria-label="Large">
  <option>Large</option>
</select>
```

```tsx
<Select defaultValue="x" items={{ x: "Small" }}>
  <Select.Trigger size="sm" aria-label="Small">
    <Select.Value />
    <Select.Icon />
  </Select.Trigger>
  <Select.Popup>
    <Select.Item value="x">Small</Select.Item>
  </Select.Popup>
</Select>
<Select defaultValue="x" items={{ x: "Medium" }}>
  <Select.Trigger aria-label="Medium">
    <Select.Value />
    <Select.Icon />
  </Select.Trigger>
  <Select.Popup>
    <Select.Item value="x">Medium</Select.Item>
  </Select.Popup>
</Select>
<Select defaultValue="x" items={{ x: "Large" }}>
  <Select.Trigger size="lg" aria-label="Large">
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
<select class="select" aria-label="Produce">
  <option value="">Pick one…</option>
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
  <Select.Trigger aria-label="Produce">
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

### Leading icon (React only)

A native `<select>` can't hold an icon.

**Example**

```tsx
<Select defaultValue="cph" items={{ cph: "Copenhagen", aar: "Aarhus" }}>
  <Select.Trigger icon={IconBuildingWarehouse} aria-label="Warehouse">
    <Select.Value />
    <Select.Icon />
  </Select.Trigger>
  <Select.Popup>
    <Select.Item value="cph">Copenhagen</Select.Item>
    <Select.Item value="aar">Aarhus</Select.Item>
  </Select.Popup>
</Select>
```

### Disabled

**Example**

```html
<select class="select" disabled aria-label="Status">
  <option>Disabled</option>
</select>
```

```tsx
<Select disabled defaultValue="x" items={{ x: "Disabled" }}>
  <Select.Trigger aria-label="Status">
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

**Caution** — The React popup is portaled out of the trigger's stacking context onto `.popup-layer`, so an ancestor `overflow: hidden` can't clip it — but a host page with a higher stacking context can still paint over it. See [Theming › Popup layering](../../basics/theming.md#popup-layering).

## Reference

### React

| Part                   | Renders                        | Class                         |
| ---------------------- | ------------------------------ | ----------------------------- |
| `Select`               | nothing — provides context     | —                             |
| `Select.Trigger`       | `<button>`                     | `select`                      |
| `Select.Value`         | `<span>`                       | `select-value`                |
| `Select.Icon`          | `<span>`, chevron by default   | `select-icon`                 |
| `Select.Popup`         | portal → positioner → `<div>`  | `popup-layer`, `select-popup` |
| `Select.Item`          | `<div>`                        | `select-item`                 |
| `Select.ItemText`      | `<div>`                        | —                             |
| `Select.ItemIndicator` | `<span>`, checkmark by default | `select-item-indicator`       |
| `Select.Group`         | `<div>`                        | —                             |
| `Select.GroupLabel`    | `<div>`                        | `select-group-label`          |

| Part             | Prop          | Type                                              | Default      |
| ---------------- | ------------- | ------------------------------------------------- | ------------ |
| `Select`         | `items`       | `Record<string, ReactNode>` or `{label, value}[]` | —            |
| `Select.Trigger` | `variant`     | `"bordered" \| "ghost" \| "danger"`               | `"bordered"` |
| `Select.Trigger` | `size`        | `"sm" \| "md" \| "lg"`                            | `"md"`       |
| `Select.Trigger` | `triggerSize` | `"sm" \| "md" \| "lg"`                            | —            |
| `Select.Trigger` | `icon`        | [`IconProp`](../../basics/conventions.md#icons)  | —            |
| `Select.Popup`   | `side`        | `"top" \| "bottom" \| "left" \| "right"`          | `"bottom"`   |
| `Select.Popup`   | `align`       | `"start" \| "center" \| "end"`                    | `"start"`    |
| `Select.Popup`   | `sideOffset`  | `number`                                          | `4`          |
| `Select.Popup`   | `alignOffset` | `number`                                          | `0`          |

`triggerSize` is the deprecated name for `size`; `size` wins when both are set. Without `items`, `Select.Value` shows the raw value instead of the label. `side`, `align` and both offsets (in px) position the popup relative to the trigger; with `align="start"`, a popup wider than the trigger lines up with its start edge.

Every part also takes its Base UI props — `value` / `defaultValue` / `onValueChange` / `name` / `required` / `disabled` / `multiple` on the root, `value` and `label` on `Item`. Each part takes `className`; `Select` takes no `classNames`, and the positioner's class can't be overridden.

Only the trigger responds to `variant` and `size`. The chevron and `icon` are `1em`, so they scale with the trigger text; the popup and items keep one size. A long value truncates with an ellipsis.

To keep every option visible, use [Radios](radios.md); for actions, [Menus](../menus.md); to switch views, [Tabs](../tabs.md).

### Vanilla

| Class / var             | Effect                                                                                                                           |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `select`                | On a native `<select>`: `0.75rem`/`0.5rem` padding, `text-sm`, bordered surface, and a custom chevron                            |
| `select-ghost`          | Transparent fill and border until hover                                                                                          |
| `select-danger`         | Danger border and focus outline; `[aria-invalid="true"]`, `[data-invalid]`, `:user-invalid` and an invalid `.field` get the same |
| `select-sm`             | `text-xs`, tighter padding, smaller chevron                                                                                      |
| `select-lg`             | `text-base`, looser padding                                                                                                      |
| `select-value`          | React value span; truncates a long value with an ellipsis                                                                        |
| `select-icon`           | React chevron slot, `1em` square, pushed to the trigger end; rotates 180° while the popup is open                                |
| `select-popup`          | React popup: min-width tracks the trigger, `20rem` max width (the trigger's width when wider), `18rem` max height, scrolls       |
| `select-item`           | React option row; states via `[data-highlighted]`, `[data-selected]`, `[data-disabled]`; inset ring on keyboard focus            |
| `select-item-indicator` | React checkmark slot, pushed to the row end                                                                                      |
| `select-group-label`    | React group heading: uppercase, muted, `text-xs`                                                                                 |
| `popup-layer`           | Applied to the React positioner so portaled popups paint above host chrome                                                       |
| `--z-popup`             | Read by `popup-layer`, defaults to `1000`. Set it on any ancestor to re-layer                                                    |

Use `<optgroup>` for groups. A selected `<option value="">` renders muted, like the React placeholder. The native chevron is a background image whose stroke matches the default `text-muted` in light and dark mode; a data URI can't read CSS variables, so it doesn't follow token overrides. The six React-only classes above ship in both bundles but have no native equivalent to attach to.
