# Buttons

> Buttons with variants, sizes, icons, and loading state.

## Contents

- [Examples](#examples)
  - [Variants](#variants)
  - [Sizes](#sizes)
  - [Disabled](#disabled)
  - [Loading](#loading)
  - [Full width](#full-width)
  - [As a link](#as-a-link)
  - [With icons](#with-icons)
  - [Icon-only](#icon-only)
  - [Toggle](#toggle)
  - [Toggle with a hotkey](#toggle-with-a-hotkey)
  - [Hotkey (React only)](#hotkey-react-only)
  - [Group](#group)
  - [Group, full width](#group-full-width)
  - [Group, vertical](#group-vertical)
  - [Group, with variants and icons](#group-with-variants-and-icons)
  - [Group, with toggles](#group-with-toggles)
  - [Group, with indicators](#group-with-indicators)
- [Reference](#reference)
  - [React](#react)
  - [Vanilla](#vanilla)

## Examples

### Variants

**Example**

```html
<button class="btn">Default</button>
<button class="btn btn-primary">Primary</button>
<button class="btn btn-ghost">Ghost</button>
<button class="btn btn-muted">Muted</button>
<button class="btn btn-danger">Danger</button>
```

```tsx
<Button>Default</Button>
<Button variant="primary">Primary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="muted">Muted</Button>
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

**Example**

```html
<button class="btn btn-primary btn-loading" type="button" disabled aria-busy="true">Saving</button>
<button class="btn btn-loading" type="button" disabled aria-busy="true">Loading</button>
```

```tsx
<Button variant="primary" loading>Saving</Button>
<Button loading>Loading</Button>
```

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

**Example**

```html
<a href="/orders/new" class="btn btn-primary">New order</a>
<a href="/reports" class="btn">View reports</a>
```

```tsx
<Button variant="primary" render={<a href="/orders/new" />} nativeButton={false}>New order</Button>
<Button render={<a href="/reports" />} nativeButton={false}>View reports</Button>
```

**Caution** — `disabled` does nothing on an `<a>`. Omit the link or render plain text instead of styling a non-interactive link as disabled.

### With icons

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

### Toggle

**Example**

```html
<button class="btn" type="button" aria-pressed="true">Auto-refresh</button>
<button class="btn" type="button" aria-pressed="false">Auto-refresh</button>
```

```tsx
<ToggleButton defaultPressed>Auto-refresh</ToggleButton>
<ToggleButton>Auto-refresh</ToggleButton>
```

### Toggle with a hotkey

**Example**

```tsx
<ToggleButton hotkey="mod+e" defaultPressed>
  Preview
</ToggleButton>
```

### Hotkey (React only)

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

### Group

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

**Caution** — A group is presentational — each child stays independently focusable, and nothing enforces a single selection. For single-select, use a [boxed tab list](tabs.md) as the segmented control.

### Group, full width

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

### Group, vertical

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

### Group, with variants and icons

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

### Group, with toggles

**Example**

```html
<div class="btn-group">
  <button class="btn" type="button" aria-pressed="true">Stripes</button>
  <button class="btn" type="button" aria-pressed="false">Compact</button>
  <button class="btn" type="button" aria-pressed="false">Wrap text</button>
</div>
```

```tsx
<ButtonGroup>
  <ToggleButton defaultPressed>Stripes</ToggleButton>
  <ToggleButton>Compact</ToggleButton>
  <ToggleButton>Wrap text</ToggleButton>
</ButtonGroup>
```

### Group, with indicators

**Example**

```html
<div class="btn-group">
  <button class="btn">Inbox</button>
  <div class="indicator">
    <span class="indicator-item badge badge-primary badge-sm">3</span>
    <button class="btn">Messages</button>
  </div>
  <button class="btn">Archive</button>
</div>
```

```tsx
<ButtonGroup>
  <Button>Inbox</Button>
  <Indicator label={3} variant="primary">
    <Button>Messages</Button>
  </Indicator>
  <Button>Archive</Button>
</ButtonGroup>
```

## Reference

### React

| Component      | Prop              | Type                                                       | Default        |
| -------------- | ----------------- | ---------------------------------------------------------- | -------------- |
| `Button`       | `variant`         | `"default" \| "primary" \| "ghost" \| "muted" \| "danger"` | `"default"`    |
| `Button`       | `size`            | `"sm" \| "md" \| "lg"`                                     | `"md"`         |
| `Button`       | `fullWidth`       | `boolean`                                                  | `false`        |
| `Button`       | `loading`         | `boolean`                                                  | `false`        |
| `Button`       | `icon`            | [`IconProp`](../basics/conventions.md#icons)              | —              |
| `Button`       | `iconTrailing`    | [`IconProp`](../basics/conventions.md#icons)              | —              |
| `Button`       | `hotkey`          | `string \| readonly string[]`                              | —              |
| `ToggleButton` | `pressed`         | `boolean`                                                  | —              |
| `ToggleButton` | `defaultPressed`  | `boolean`                                                  | `false`        |
| `ToggleButton` | `onPressedChange` | `(pressed: boolean) => void`                               | —              |
| `ButtonGroup`  | `orientation`     | `"horizontal" \| "vertical"`                               | `"horizontal"` |
| `ButtonGroup`  | `fullWidth`       | `boolean`                                                  | `false`        |

`type` defaults to `"button"`, so a button inside a form doesn't submit unless you say so. `loading` implies `disabled` and `aria-busy="true"`, and suppresses the leading icon while keeping a trailing one. A button with an icon and no children gets `btn-square` automatically.

`hotkey` dispatches a native click on the rendered element, so `onClick` fires, `type="submit"` submits, and `render={<a href>}` navigates; it also sets `aria-keyshortcuts` and renders a trailing [Kbd](kbd.md) chip. Pass an array for alternatives — only the first is shown. On a `ToggleButton` it flips the pressed state. For bindings not tied to a control, see [Conventions › Hotkeys](../basics/conventions.md#hotkeys).

`ToggleButton` takes every `Button` prop except `loading`, plus Base UI's pressed state; it wraps [Base UI Toggle](https://base-ui.com/react/components/toggle). `Button` wraps [Base UI Button](https://base-ui.com/react/components/button), so `render` and `nativeButton` come from there — pass both to render an anchor. Plus native `<button>` attributes, and `<div>` on `ButtonGroup`, which also defaults `role="group"`.

### Vanilla

| Class                  | Effect                                                                                            |
| ---------------------- | ------------------------------------------------------------------------------------------------- |
| `btn`                  | `1rem`/`0.5rem` padding, `0.5rem` radius, `text-sm` medium, bordered muted surface, `0.5rem` gap  |
| `btn-primary`          | Brand fill, `primary-content` text, no border colour                                              |
| `btn-ghost`            | No fill or border until hover                                                                     |
| `btn-muted`            | Fills with the page surface so it sits flush rather than raised                                   |
| `btn-danger`           | Danger fill, `danger-content` text                                                                |
| `btn-sm`               | `text-xs`, `0.75rem`/`0.375rem` padding                                                           |
| `btn-lg`               | `text-base`, `1.25rem`/`0.625rem` padding                                                         |
| `btn-full-width`       | `width: 100%`                                                                                     |
| `btn-square`           | Equalises the side padding for an icon-only button                                                |
| `btn-loading`          | Dims, blocks pointer events, and paints a `1em` spinner via `::before`, hiding a leading icon     |
| `btn-group`            | Joins its `btn` children into one strip: square inner corners, `1px` overlap, `currentColor` seam |
| `btn-group-vertical`   | Stacks the strip instead, labels aligned to the start                                             |
| `btn-group-full-width` | Stretches the group; horizontal members split the row evenly                                      |

There is no `btn-default` or `btn-md` — both are the unmodified `btn`. The classes work on `<a>` as well as `<button>`.

`aria-pressed` is the toggle state, with no class involved: any `btn` carrying the attribute grows a leading mini switch, and `"true"` slides it across and adds the selected wash. Flip the attribute yourself. `btn-loading` doesn't disable the button for keyboard users — pair it with the `disabled` attribute. `btn-square` needs an `aria-label`, since there's no text to name it. Both spinners slow rather than stop under `prefers-reduced-motion: reduce`.

Group members can be a `btn`, an [`indicator`](indicator.md) wrapping one, or a `menu` for a split button — the seam and rounding rules drill through those wrappers. A badge on a middle member overhangs its neighbour, so set the indicator offset to `0` for a flush square corner.
