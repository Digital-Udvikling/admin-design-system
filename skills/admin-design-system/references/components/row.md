# Row

> One-dimensional layouts with flex utilities.

There's no `.row` component — for one-dimensional layouts, use Tailwind's flex utilities directly. Vanilla projects get them from the [utilities bundle](../getting-started/vanilla.md#utilities-optional); React projects should [add Tailwind](../getting-started/tailwind.md) so the bare class names resolve. Everything below is those utilities. For 2D layouts, see [Grid](grid.md); for spacing between stacked page sections, [Container](container.md).

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

`items-center` is the common default; `items-start`, `items-end`, and `items-baseline` cover the rest.

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

`flex-1` makes one child absorb the leftover space; the others keep their natural size.

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

The default is a row. `flex-col` stacks vertically; pair it with a responsive prefix to switch axes at a breakpoint — stacked on narrow screens, a row from `sm` up.

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

`divide-x` draws a hairline between children — no border class on each item. Pair it with horizontal padding so the segments breathe.

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

Everything together. `flex-wrap` keeps a packed toolbar from overflowing on narrow screens; `flex-1` on the search field pushes the action cluster to the right edge.

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

Flex also offers `order-*` to reorder children and `content-*` to align wrapped lines on the cross axis — see [Utilities](../getting-started/vanilla.md#utilities-optional).
