# Input groups

> Combine inputs, addons, and buttons into a flush row.

## Contents

- [Examples](#examples)
  - [Prepended addon](#prepended-addon)
  - [Appended addon](#appended-addon)
  - [Both ends](#both-ends)
  - [With a button](#with-a-button)
  - [With a select](#with-a-select)
  - [Sizes](#sizes)
  - [With icon addons](#with-icon-addons)
- [Reference](#reference)
  - [React](#react)
  - [Vanilla](#vanilla)

## Examples

### Prepended addon

**Example**

```html
<div class="input-group">
  <span class="input-group-addon">$</span>
  <input class="input" type="number" placeholder="0.00" />
</div>
```

```tsx
<InputGroup>
  <InputGroup.Addon>$</InputGroup.Addon>
  <Input type="number" placeholder="0.00" />
</InputGroup>
```

### Appended addon

**Example**

```html
<div class="input-group">
  <input class="input" type="text" placeholder="subdomain" />
  <span class="input-group-addon">.example.com</span>
</div>
```

```tsx
<InputGroup>
  <Input placeholder="subdomain" />
  <InputGroup.Addon>.example.com</InputGroup.Addon>
</InputGroup>
```

### Both ends

**Example**

```html
<div class="input-group">
  <span class="input-group-addon">$</span>
  <input class="input" type="number" placeholder="0.00" />
  <span class="input-group-addon">USD</span>
</div>
```

```tsx
<InputGroup>
  <InputGroup.Addon>$</InputGroup.Addon>
  <Input type="number" placeholder="0.00" />
  <InputGroup.Addon>USD</InputGroup.Addon>
</InputGroup>
```

### With a button

**Example**

```html
<div class="input-group">
  <input class="input" type="search" placeholder="Search orders…" />
  <button class="btn btn-primary" type="submit">Search</button>
</div>
```

```tsx
<InputGroup>
  <Input type="search" placeholder="Search orders…" />
  <Button variant="primary" type="submit">
    Search
  </Button>
</InputGroup>
```

### With a select

**Example**

```html
<div class="input-group">
  <input class="input" type="number" placeholder="0.00" aria-label="Amount" />
  <select class="select" aria-label="Currency">
    <option>DKK</option>
    <option>EUR</option>
    <option>USD</option>
  </select>
</div>
```

```tsx
<InputGroup>
  <Input type="number" placeholder="0.00" aria-label="Amount" />
  <Select defaultValue="DKK" items={{ DKK: "DKK", EUR: "EUR", USD: "USD" }}>
    <Select.Trigger aria-label="Currency">
      <Select.Value />
      <Select.Icon />
    </Select.Trigger>
    <Select.Popup>
      <Select.Item value="DKK">DKK</Select.Item>
      <Select.Item value="EUR">EUR</Select.Item>
      <Select.Item value="USD">USD</Select.Item>
    </Select.Popup>
  </Select>
</InputGroup>
```

### Sizes

**Example**

```html
<div class="input-group">
  <span class="input-group-addon">https://</span>
  <input class="input input-sm" type="text" placeholder="example.com" />
  <button class="btn btn-sm" type="button">Check</button>
</div>
<div class="input-group">
  <span class="input-group-addon">https://</span>
  <input class="input" type="text" placeholder="example.com" />
  <button class="btn" type="button">Check</button>
</div>
<div class="input-group">
  <span class="input-group-addon">https://</span>
  <input class="input input-lg" type="text" placeholder="example.com" />
  <button class="btn btn-lg" type="button">Check</button>
</div>
```

```tsx
<InputGroup>
  <InputGroup.Addon>https://</InputGroup.Addon>
  <Input size="sm" placeholder="example.com" />
  <Button size="sm">Check</Button>
</InputGroup>
<InputGroup>
  <InputGroup.Addon>https://</InputGroup.Addon>
  <Input placeholder="example.com" />
  <Button>Check</Button>
</InputGroup>
<InputGroup>
  <InputGroup.Addon>https://</InputGroup.Addon>
  <Input size="lg" placeholder="example.com" />
  <Button size="lg">Check</Button>
</InputGroup>
```

### With icon addons

**Example**

```html
<div class="input-group">
  <span class="input-group-addon" aria-hidden="true"><i class="ti ti-search"></i></span>
  <input class="input" type="search" placeholder="Search products…" />
</div>
<div class="input-group">
  <span class="input-group-addon" aria-hidden="true"><i class="ti ti-at"></i></span>
  <input class="input" type="email" placeholder="you@example.com" />
</div>
<div class="input-group">
  <input class="input" type="text" placeholder="Enter command" />
  <button class="btn btn-primary btn-square" type="submit" aria-label="Run">
    <i class="ti ti-arrow-right" aria-hidden="true"></i>
  </button>
</div>
```

```tsx
<InputGroup>
  <InputGroup.Addon aria-hidden>
    <IconSearch size="1em" />
  </InputGroup.Addon>
  <Input type="search" placeholder="Search products…" />
</InputGroup>
<InputGroup>
  <InputGroup.Addon aria-hidden>
    <IconAt size="1em" />
  </InputGroup.Addon>
  <Input type="email" placeholder="you@example.com" />
</InputGroup>
<InputGroup>
  <Input placeholder="Enter command" />
  <Button variant="primary" type="submit" icon={IconArrowRight} aria-label="Run" />
</InputGroup>
```

## Reference

### React

| Part               | Renders  | Class               |
| ------------------ | -------- | ------------------- |
| `InputGroup`       | `<div>`  | `input-group`       |
| `InputGroup.Addon` | `<span>` | `input-group-addon` |

No props of its own — each part takes the native attributes of its element. Any child works: `Input`, `Select`, `NumberInput`, `FileInput`, `Button`, `Addon`, or your own element.

### Vanilla

| Class               | Effect                                                                                                                                                    |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `input-group`       | Joins its children into one flush row: square inner corners, `1px` overlap, hovered, invalid and focused children lifted above the seam                   |
| `input-group-addon` | Static segment: `0.75rem` side padding, `text-sm` muted on a muted fill, bordered, no wrapping. `text-xs` beside `-sm` controls, `text-base` beside `-lg` |

The seam rules target _every_ direct child, not a specific class, so an `input`, a `select`, a `number-input`, a `btn`, an addon, or anything else joins the row in source order. The first and last child keep their outer radius; a trailing hidden `<input>` (`type="hidden"` or `aria-hidden="true"`, as Base UI renders after a Select) doesn't count as the last child. A hovered or invalid child is lifted above its neighbour's overlapping edge, and a focused one above both, so a coloured border or the focus ring isn't covered. The group is its own stacking context, so the lifts stay inside it; while a child `menu` is open, the group sits at `z-index: 30` so the popup clears what follows.

Buttons, menus, selects and addons keep their content width on one line; the `input`, `input-icon`, `number-input` or `file-input` takes the remaining width unless it has a width of its own. A select with no field beside it keeps its full width. A React `Select.Trigger` sizes to its selected label; give it a width through `className` when option labels differ in length.

An addon takes any content, including an icon — mark a decorative one `aria-hidden`. For a borderless glyph floating _inside_ the field instead, use [input icons](inputs.md#with-icons).
