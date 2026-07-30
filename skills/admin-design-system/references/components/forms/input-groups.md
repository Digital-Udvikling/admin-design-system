# Input groups

> Combine inputs, addons, and buttons into a flush row.

## Contents

- [Examples](#examples)
  - [Prepended addon](#prepended-addon)
  - [Appended addon](#appended-addon)
  - [Both ends](#both-ends)
  - [With a button](#with-a-button)
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
  <button class="btn btn-primary" type="submit" aria-label="Run">
    <i class="ti ti-arrow-right" aria-hidden="true"></i>
  </button>
</div>
```

```tsx
<InputGroup>
  <InputGroup.Addon aria-hidden>
    <IconSearch size={16} />
  </InputGroup.Addon>
  <Input type="search" placeholder="Search products…" />
</InputGroup>
<InputGroup>
  <InputGroup.Addon aria-hidden>
    <IconAt size={16} />
  </InputGroup.Addon>
  <Input type="email" placeholder="you@example.com" />
</InputGroup>
<InputGroup>
  <Input placeholder="Enter command" />
  <Button variant="primary" type="submit" aria-label="Run">
    <IconArrowRight size={16} aria-hidden />
  </Button>
</InputGroup>
```

## Reference

### React

| Part               | Renders  | Class               |
| ------------------ | -------- | ------------------- |
| `InputGroup`       | `<div>`  | `input-group`       |
| `InputGroup.Addon` | `<span>` | `input-group-addon` |

No props of its own — each part takes the native attributes of its element. Any child works: `Input`, `Button`, `Addon`, or your own element.

### Vanilla

| Class               | Effect                                                                                                  |
| ------------------- | ------------------------------------------------------------------------------------------------------- |
| `input-group`       | Joins its children into one flush row: square inner corners, `1px` overlap, focus lifted above the seam |
| `input-group-addon` | Static segment: `0.75rem` side padding, `text-sm` muted on a muted fill, bordered, no wrapping          |

The seam rules target _every_ direct child, not a specific class, so an `input`, a `btn`, an addon, or anything else joins the row in source order. The first and last child keep their outer radius. A focused child is lifted above its neighbour's overlapping edge so the focus ring isn't clipped.

An addon takes any content, including an icon — mark a decorative one `aria-hidden`. For a borderless glyph floating _inside_ the field instead, use [input icons](inputs.md#with-icons).
