# Buttons

> Buttons with variants, sizes, icons, and loading state.

IconPlus,
  IconTrash,
  IconDownload,
  IconDotsVertical,
  IconPencil,
  IconCopy,
  IconArchive,
  IconDeviceFloppy,
} from "@tabler/icons-react";

## Examples

### Variants

The bare `.btn` / `<Button>` is the low-emphasis default — most buttons on a dense admin screen aren't primary. Reach for `primary` for the single main action, `danger` for destructive ones.

**Example**

```html
<button class="btn">Default</button>
<button class="btn btn-primary">Primary</button>
<button class="btn btn-ghost">Ghost</button>
<button class="btn btn-danger">Danger</button>
```

```tsx
<Button>Default</Button>
<Button variant="primary">Primary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="danger">Danger</Button>
```

### Sizes

**Example**

```html
<button class="btn btn-primary btn-sm">Small</button>
<button class="btn btn-primary">Medium</button>
<button class="btn btn-primary btn-lg">Large</button>
```

```tsx
<Button variant="primary" size="sm">Small</Button>
<Button variant="primary">Medium</Button>
<Button variant="primary" size="lg">Large</Button>
```

### Disabled

**Example**

```html
<button class="btn btn-primary" disabled>Disabled</button>
<button class="btn" disabled>Disabled</button>
```

```tsx
<Button variant="primary" disabled>Disabled</Button>
<Button disabled>Disabled</Button>
```

### Loading

`.btn-loading` paints a spinner in place of the leading icon and freezes interaction. The React `loading` prop also sets `disabled` and `aria-busy="true"`.

**Example**

```html
<button class="btn btn-primary btn-loading" type="button" disabled aria-busy="true">Saving</button>
<button class="btn btn-loading" type="button" disabled aria-busy="true">Loading</button>
```

```tsx
<Button variant="primary" loading>Saving</Button>
<Button loading>Loading</Button>
```

If you pass both `icon` and `loading`, the leading icon is suppressed. A trailing icon stays visible.

### Full width

**Example**

```html
<button class="btn btn-primary btn-full-width">Continue</button>
```

```tsx
<Button variant="primary" fullWidth>
  Continue
</Button>
```

### As a link

The `.btn` classes apply to `<a>` for navigation. In React, pass `render={<a href="…" />}` and `nativeButton={false}` to render an anchor.

**Example**

```html
<a href="/orders/new" class="btn btn-primary">New order</a>
<a href="/reports" class="btn">View reports</a>
```

```tsx
<Button variant="primary" render={<a href="/orders/new" />} nativeButton={false}>New order</Button>
<Button render={<a href="/reports" />} nativeButton={false}>View reports</Button>
```

`disabled` doesn't apply to anchors — omit the link (or render plain text) instead of styling a non-interactive link as disabled.

### With icons

Pass `icon` for a leading icon or `iconTrailing` for a trailing one — rendered at `size={16}` with `aria-hidden`. See [Icons](../basics/icons.md).

**Example**

```html
<button class="btn btn-primary">
  <i class="ti ti-plus" aria-hidden="true"></i>
  New order
</button>
<button class="btn">
  Export
  <i class="ti ti-download" aria-hidden="true"></i>
</button>
<button class="btn btn-danger">
  <i class="ti ti-trash" aria-hidden="true"></i>
  Delete
</button>
```

```tsx
<Button variant="primary" icon={IconPlus}>New order</Button>
<Button iconTrailing={IconDownload}>Export</Button>
<Button variant="danger" icon={IconTrash}>Delete</Button>
```

### Icon-only

Drop the label and pass `aria-label` for a square button — table row controls, toolbar icons, dismiss. React adds `.btn-square` automatically when a button has an icon but no children; vanilla callers add the class themselves.

**Example**

```html
<button class="btn btn-ghost btn-square" type="button" aria-label="More actions">
  <i class="ti ti-dots-vertical" aria-hidden="true"></i>
</button>
<button class="btn btn-square btn-sm" type="button" aria-label="Edit">
  <i class="ti ti-pencil" aria-hidden="true"></i>
</button>
<button class="btn btn-danger btn-square btn-lg" type="button" aria-label="Delete">
  <i class="ti ti-trash" aria-hidden="true"></i>
</button>
```

```tsx
<Button variant="ghost" icon={IconDotsVertical} aria-label="More actions" />
<Button size="sm" icon={IconPencil} aria-label="Edit" />
<Button variant="danger" size="lg" icon={IconTrash} aria-label="Delete" />
```

### Hotkey <StarlightBadge text="React only" variant="caution" />

Bind a chord to the button — pressing it invokes `onClick` and renders a trailing chip. Pass an array for alternatives; only the first is rendered. See [Hotkeys](../basics/hotkeys.md) for page-level bindings.

**Example**

```tsx
<Button hotkey="mod+s" icon={IconDeviceFloppy} onClick={() => console.log("save")}>
  Save
</Button>
```

**Example**

```tsx
<Button hotkey={["mod+s", "mod+enter"]} onClick={() => console.log("save")}>
  Save
</Button>
```

## Groups

Wrap multiple `.btn` children in `.btn-group` to render them as one segmented unit: shared borders, rounded outer corners, square inner corners. Presentational only — each child is an independently focusable button. For single-select toggles, reach for a dedicated segmented control.

### Horizontal

**Example**

```html
<div class="btn-group">
  <button class="btn">Day</button>
  <button class="btn">Week</button>
  <button class="btn">Month</button>
</div>
```

```tsx
<ButtonGroup>
  <Button>Day</Button>
  <Button>Week</Button>
  <Button>Month</Button>
</ButtonGroup>
```

### Full width

`fullWidth` stretches the group across its container; the buttons split the row evenly, so every one is the same width regardless of label length.

**Example**

```html
<div class="btn-group btn-group-full-width">
  <button class="btn">Day</button>
  <button class="btn">Week</button>
  <button class="btn">Month</button>
</div>
```

```tsx
<ButtonGroup fullWidth>
  <Button>Day</Button>
  <Button>Week</Button>
  <Button>Month</Button>
</ButtonGroup>
```

### Vertical

**Example**

```html
<div class="btn-group btn-group-vertical">
  <button class="btn">Up</button>
  <button class="btn">Center</button>
  <button class="btn">Down</button>
</div>
```

```tsx
<ButtonGroup orientation="vertical">
  <Button>Up</Button>
  <Button>Center</Button>
  <Button>Down</Button>
</ButtonGroup>
```

### With variants and icons

A row-action menu stacked into a sidebar — mixed variants, leading icons, primary on top, destructive at the bottom.

**Example**

```html
<div class="btn-group btn-group-vertical">
  <button class="btn btn-primary">
    <i class="ti ti-pencil" aria-hidden="true"></i>
    Edit
  </button>
  <button class="btn">
    <i class="ti ti-copy" aria-hidden="true"></i>
    Duplicate
  </button>
  <button class="btn">
    <i class="ti ti-archive" aria-hidden="true"></i>
    Archive
  </button>
  <button class="btn btn-danger">
    <i class="ti ti-trash" aria-hidden="true"></i>
    Delete
  </button>
</div>
```

```tsx
<ButtonGroup orientation="vertical">
  <Button variant="primary" icon={IconPencil}>
    Edit
  </Button>
  <Button icon={IconCopy}>Duplicate</Button>
  <Button icon={IconArchive}>Archive</Button>
  <Button variant="danger" icon={IconTrash}>
    Delete
  </Button>
</ButtonGroup>
```
