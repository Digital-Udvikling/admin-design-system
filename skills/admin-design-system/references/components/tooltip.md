# Tooltips

> Transient hints anchored to a trigger.

## Contents

- [Examples](#examples)
  - [Basic](#basic)
  - [Sides](#sides)
  - [Sizes](#sizes)
  - [Group delay (React only)](#group-delay-react-only)
  - [Rich content](#rich-content)
- [Reference](#reference)
  - [React](#react)
  - [Vanilla](#vanilla)

## Examples

### Basic

**Example**

```html
<span class="tooltip-wrap">
  <button type="button" class="btn btn-square" aria-label="Save">
    <i class="ti ti-device-floppy" aria-hidden="true"></i>
  </button>
  <span class="tooltip" role="tooltip">Save</span>
</span>
```

```tsx
<Tooltip content="Save">
  <Button aria-label="Save" icon={IconDeviceFloppy} />
</Tooltip>
```

### Sides

**Example**

```html
<span class="tooltip-wrap">
  <button type="button" class="btn">Top (default)</button>
  <span class="tooltip" role="tooltip">Top</span>
</span>
<span class="tooltip-wrap tooltip-wrap-right">
  <button type="button" class="btn">Right</button>
  <span class="tooltip" role="tooltip">Right</span>
</span>
<span class="tooltip-wrap tooltip-wrap-bottom">
  <button type="button" class="btn">Bottom</button>
  <span class="tooltip" role="tooltip">Bottom</span>
</span>
<span class="tooltip-wrap tooltip-wrap-left">
  <button type="button" class="btn">Left</button>
  <span class="tooltip" role="tooltip">Left</span>
</span>
```

```tsx
<>
  <Tooltip content="Top" side="top">
    <Button>Top (default)</Button>
  </Tooltip>
  <Tooltip content="Right" side="right">
    <Button>Right</Button>
  </Tooltip>
  <Tooltip content="Bottom" side="bottom">
    <Button>Bottom</Button>
  </Tooltip>
  <Tooltip content="Left" side="left">
    <Button>Left</Button>
  </Tooltip>
</>
```

### Sizes

**Example**

```html
<span class="tooltip-wrap">
  <button type="button" class="btn btn-sm">sm</button>
  <span class="tooltip tooltip-sm" role="tooltip">Small</span>
</span>
<span class="tooltip-wrap">
  <button type="button" class="btn">md</button>
  <span class="tooltip" role="tooltip">Medium</span>
</span>
```

```tsx
<>
  <Tooltip content="Small" size="sm">
    <Button size="sm">sm</Button>
  </Tooltip>
  <Tooltip content="Medium">
    <Button>md</Button>
  </Tooltip>
</>
```

### Group delay (React only)

**Example**

```tsx
<Tooltip.Provider delay={500} closeDelay={0}>
  <Tooltip content="Edit">
    <Button aria-label="Edit" icon={IconPencil} />
  </Tooltip>
  <Tooltip content="Duplicate">
    <Button aria-label="Duplicate" icon={IconCopy} />
  </Tooltip>
  <Tooltip content="Delete">
    <Button variant="danger" aria-label="Delete" icon={IconTrash} />
  </Tooltip>
</Tooltip.Provider>
```

### Rich content

**Example**

```html
<span class="tooltip-wrap">
  <button type="button" class="btn">Save</button>
  <span class="tooltip" role="tooltip">
    Save changes
    <span class="kbd-group">
      <kbd class="kbd">Ctrl</kbd>
      <kbd class="kbd">S</kbd>
    </span>
  </span>
</span>
```

```tsx
<Tooltip
  content={
    <>
      Save changes <Kbd keys="mod+s" />
    </>
  }
>
  <Button>Save</Button>
</Tooltip>
```

**Caution** — The vanilla tooltip lives in the trigger's stacking context, so an ancestor `overflow: hidden` clips it. The React popup is portaled and isn't affected.

## Reference

### React

| Part               | Renders                       | Class                    |
| ------------------ | ----------------------------- | ------------------------ |
| `Tooltip`          | trigger + portaled popup      | `tooltip`                |
| `Tooltip.Provider` | nothing — shares open timing  | —                        |
| `Tooltip.Root`     | nothing — provides context    | —                        |
| `Tooltip.Trigger`  | its child                     | —                        |
| `Tooltip.Popup`    | portal → positioner → `<div>` | `popup-layer`, `tooltip` |

| Part               | Prop         | Type                                          | Default      |
| ------------------ | ------------ | --------------------------------------------- | ------------ |
| `Tooltip`          | `content`    | `ReactNode`                                   | — (required) |
| `Tooltip`          | `side`       | `"top" \| "right" \| "bottom" \| "left"`      | `"top"`      |
| `Tooltip`          | `align`      | `"start" \| "center" \| "end"`                | `"center"`   |
| `Tooltip`          | `sideOffset` | `number`                                      | `6`          |
| `Tooltip`          | `size`       | `"sm" \| "md"`                                | `"md"`       |
| `Tooltip`          | `classNames` | [slots](../basics/conventions.md#classnames) | —            |
| `Tooltip.Provider` | `delay`      | `number`                                      | —            |
| `Tooltip.Provider` | `closeDelay` | `number`                                      | —            |

`Tooltip` is the shorthand: `content` plus a single child element, which must be one React element so Base UI can merge trigger props and refs into it. Reach for the parts when the shorthand isn't enough — `Root` / `Trigger` / `Popup` map onto [Base UI Tooltip](https://base-ui.com/react/components/tooltip), which owns the open state, hover and focus delays, dismissal, and collision handling that flips `side` when there's no room.

`Tooltip.Provider` shares timing across a group: once one tooltip in a toolbar has opened, its neighbours open instantly until the pointer rests. `content` takes JSX, so a shortcut hint via [Kbd](kbd.md) needs no escape hatch. `classNames` covers `popup`.

A tooltip is not an accessible name. An icon-only trigger still needs its own `aria-label`.

### Vanilla

| Class                 | Effect                                                                                                                                    |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `tooltip`             | The bubble: inverted `text`-on-`surface` fill, `0.5rem`/`0.25rem` padding, `text-xs`, `20rem` max-width, balanced wrapping, click-through |
| `tooltip-sm`          | Tighter padding                                                                                                                           |
| `tooltip-wrap`        | Reveals a nested `tooltip` on `:hover` / `:focus-within`, positioned above and centred                                                    |
| `tooltip-wrap-bottom` | Below the trigger                                                                                                                         |
| `tooltip-wrap-left`   | To the inline start                                                                                                                       |
| `tooltip-wrap-right`  | To the inline end                                                                                                                         |

The vanilla path needs no JavaScript: the wrapper reveals the bubble on hover and on `:focus-within`, so keyboard users get it too, after a `200ms` open delay. Write `role="tooltip"` on the bubble yourself.

Above is the default, so there is no `tooltip-wrap-top`. There is no auto-flip either — a side modifier is absolute, so pick one that has room. React's positioner handles collisions instead, and its popup transitions per side from Base UI's `[data-side]` and `[data-starting-style]` attributes, which is why one class covers both paths.

Both bundles ship `popup-layer` for the portaled popup; see [Theming › Popup layering](../basics/theming.md#popup-layering).
