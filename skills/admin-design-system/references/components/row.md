# Row

> One-dimensional layouts with flex utilities.

## Contents

- [Examples](#examples)
  - [Basic](#basic)
  - [Alignment](#alignment)
  - [Distribution](#distribution)
  - [Grow to fill](#grow-to-fill)
  - [Wrap](#wrap)
  - [Direction](#direction)
  - [Dividers](#dividers)
  - [Toolbar](#toolbar)
- [Reference](#reference)

## Examples

### Basic

**Example**

```html
<div class="flex w-full gap-2">
  <button class="btn btn-primary">Save</button>
  <button class="btn">Cancel</button>
</div>
```

```tsx
<div className="flex w-full gap-2">
  <Button variant="primary">Save</Button>
  <Button>Cancel</Button>
</div>
```

### Alignment

**Example**

```html
<div class="flex w-full items-center gap-2">
  <i class="ti ti-circle-check" style="color: var(--color-success)" aria-hidden="true"></i>
  <span>Deploy finished</span>
  <span class="badge badge-success">live</span>
</div>
```

```tsx
<div className="flex w-full items-center gap-2">
  <IconCircleCheck size={16} style={{ color: "var(--color-success)" }} aria-hidden />
  <span>Deploy finished</span>
  <Badge variant="success">live</Badge>
</div>
```

### Distribution

**Example**

```html
<div class="flex w-full flex-col gap-4">
  <div class="flex items-center justify-between">
    <span class="font-semibold">Team members</span>
    <button class="btn btn-primary btn-sm">Invite</button>
  </div>
  <div class="flex justify-end gap-2">
    <button class="btn">Cancel</button>
    <button class="btn btn-primary">Save changes</button>
  </div>
</div>
```

```tsx
<div className="flex w-full flex-col gap-4">
  <div className="flex items-center justify-between">
    <span className="font-semibold">Team members</span>
    <Button variant="primary" size="sm">
      Invite
    </Button>
  </div>
  <div className="flex justify-end gap-2">
    <Button>Cancel</Button>
    <Button variant="primary">Save changes</Button>
  </div>
</div>
```

### Grow to fill

**Example**

```html
<div class="flex w-full gap-2">
  <input class="input flex-1" type="search" placeholder="Search orders" />
  <button class="btn">Filter</button>
</div>
```

```tsx
<div className="flex w-full gap-2">
  <Input type="search" placeholder="Search orders" className="flex-1" />
  <Button>Filter</Button>
</div>
```

### Wrap

**Example**

```html
<div class="flex w-full flex-wrap gap-2">
  <span class="badge">Status: Active</span>
  <span class="badge">Region: EU</span>
  <span class="badge">Plan: Pro</span>
  <span class="badge">Updated: 24h</span>
</div>
```

```tsx
<div className="flex w-full flex-wrap gap-2">
  <Badge>Status: Active</Badge>
  <Badge>Region: EU</Badge>
  <Badge>Plan: Pro</Badge>
  <Badge>Updated: 24h</Badge>
</div>
```

### Direction

**Example**

```html
<div class="flex w-full flex-col gap-3 sm:flex-row sm:items-center">
  <div class="card flex-1">
    <div class="card-body"><h3 class="card-title">First</h3></div>
  </div>
  <div class="card flex-1">
    <div class="card-body"><h3 class="card-title">Second</h3></div>
  </div>
</div>
```

```tsx
<div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center">
  <Card title="First" className="flex-1" />
  <Card title="Second" className="flex-1" />
</div>
```

### Dividers

**Example**

```html
<div class="flex w-full divide-x divide-border">
  <div class="px-4">
    <p class="text-text-muted text-xs">Users</p>
    <p class="font-semibold">1,204</p>
  </div>
  <div class="px-4">
    <p class="text-text-muted text-xs">Active</p>
    <p class="font-semibold">312</p>
  </div>
  <div class="px-4">
    <p class="text-text-muted text-xs">Errors</p>
    <p class="font-semibold">3</p>
  </div>
</div>
```

```tsx
<div className="flex w-full divide-x divide-border">
  <div className="px-4">
    <p className="text-text-muted text-xs">Users</p>
    <p className="font-semibold">1,204</p>
  </div>
  <div className="px-4">
    <p className="text-text-muted text-xs">Active</p>
    <p className="font-semibold">312</p>
  </div>
  <div className="px-4">
    <p className="text-text-muted text-xs">Errors</p>
    <p className="font-semibold">3</p>
  </div>
</div>
```

### Toolbar

**Example**

```html
<div class="flex w-full flex-wrap items-center gap-3">
  <span class="font-semibold">Orders</span>
  <span class="badge">128</span>
  <input class="input flex-1" type="search" placeholder="Search" />
  <div class="flex gap-2">
    <button class="btn btn-sm"><i class="ti ti-filter" aria-hidden="true"></i> Filter</button>
    <button class="btn btn-primary btn-sm">
      <i class="ti ti-plus" aria-hidden="true"></i> New order
    </button>
  </div>
</div>
```

```tsx
<div className="flex w-full flex-wrap items-center gap-3">
  <span className="font-semibold">Orders</span>
  <Badge>128</Badge>
  <Input type="search" placeholder="Search" className="flex-1" />
  <div className="flex gap-2">
    <Button size="sm" icon={IconFilter}>
      Filter
    </Button>
    <Button variant="primary" size="sm" icon={IconPlus}>
      New order
    </Button>
  </div>
</div>
```

## Reference

There is no `.row` class — see [Conventions › Layout](../basics/conventions.md#layout) for where the utilities come from. The class names are identical in both bundles, so the two tabs above differ only in `class` vs `className`.

| Utility     | Effect                                                                           |
| ----------- | -------------------------------------------------------------------------------- |
| `flex`      | Lays children out on one line                                                    |
| `flex-col`  | Stacks them instead. Pair with `sm:flex-row` to switch axes at a breakpoint      |
| `gap-*`     | Space between children                                                           |
| `items-*`   | Cross-axis alignment: `center` is the usual one, plus `start`, `end`, `baseline` |
| `justify-*` | Main-axis distribution: `between`, `end`, `center`, `around`                     |
| `flex-1`    | One child absorbs the leftover space; the others keep their natural size         |
| `flex-wrap` | Overflowing children move to a new line                                          |
| `divide-x`  | Hairline between children, no border class on each. Add `px-*` to the children   |
| `order-*`   | Reorders children visually                                                       |
| `content-*` | Aligns wrapped lines on the cross axis                                           |

For two-dimensional layouts see [Grid](grid.md); for spacing between stacked page sections, [Container](container.md). The full utility set is Tailwind's — these are the ones an admin layout reaches for.
