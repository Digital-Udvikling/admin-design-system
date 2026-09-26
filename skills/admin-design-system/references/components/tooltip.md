# Tooltips

> Transient hints anchored to a trigger.

## Contents

- [Examples](#examples)
  - [Basic](#basic)
  - [Sides](#sides)
  - [Sizes](#sizes)
  - [Group delay (React only)](#group-delay-react-only)
  - [Rich content](#rich-content)
  - [Disabled trigger](#disabled-trigger)
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
<span class="tooltip-wrap tooltip-wrap-end">
  <button type="button" class="btn">End</button>
  <span class="tooltip" role="tooltip">End</span>
</span>
<span class="tooltip-wrap tooltip-wrap-bottom">
  <button type="button" class="btn">Bottom</button>
  <span class="tooltip" role="tooltip">Bottom</span>
</span>
<span class="tooltip-wrap tooltip-wrap-start">
  <button type="button" class="btn">Start</button>
  <span class="tooltip" role="tooltip">Start</span>
</span>
```

```tsx
<>
  <Tooltip content="Top" side="top">
    <Button>Top (default)</Button>
  </Tooltip>
  <Tooltip content="End" side="inline-end">
    <Button>End</Button>
  </Tooltip>
  <Tooltip content="Bottom" side="bottom">
    <Button>Bottom</Button>
  </Tooltip>
  <Tooltip content="Start" side="inline-start">
    <Button>Start</Button>
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

### Disabled trigger

A disabled button gets no pointer events, so `<Tooltip>` needs an `inline-flex` wrapper to take the hover; a plain inline `<span>` only covers the middle of the button. The vanilla `tooltip-wrap` already is one. A disabled button can't take focus either, so keyboard users never see this hint.

**Example**

```html
<span class="tooltip-wrap">
  <button type="button" class="btn btn-danger" disabled>Delete</button>
  <span class="tooltip" role="tooltip">Needs the admin role</span>
</span>
```

```tsx
<Tooltip content="Needs the admin role">
  <span style={{ display: "inline-flex" }}>
    <Button variant="danger" disabled>
      Delete
    </Button>
  </span>
</Tooltip>
```

**Caution** — In browsers without CSS anchor positioning, an ancestor with non-visible `overflow` (`hidden`, `auto`, `scroll`, `clip`) clips the vanilla tooltip. The React popup is portaled.

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
| `Tooltip`          | `delay`      | `number`                                      | `600`        |
| `Tooltip`          | `closeDelay` | `number`                                      | `0`          |
| `Tooltip`          | `classNames` | [slots](../basics/conventions.md#classnames) | —            |
| `Tooltip.Provider` | `delay`      | `number`                                      | —            |
| `Tooltip.Provider` | `closeDelay` | `number`                                      | —            |

`Tooltip` is the shorthand: `content` plus a single child element, which must be one React element so Base UI can merge trigger props and refs into it. Reach for the parts when the shorthand isn't enough — `Root` / `Trigger` / `Popup` map onto [Base UI Tooltip](https://base-ui.com/react/components/tooltip), which owns the open state, hover and focus delays, dismissal, and collision handling that flips `side` when there's no room.

`Tooltip.Provider` shares timing across a group: once one tooltip in a toolbar has opened, its neighbours open instantly until the pointer rests. `delay` and `closeDelay` on `Tooltip` override the Provider's for that tooltip; left unset, the Provider's apply, then Base UI's `600` / `0`. The vanilla bubble opens after `200ms`. `content` takes JSX, so a shortcut hint via [Kbd](kbd.md) needs no escape hatch. `classNames` covers `popup`.

A tooltip is not an accessible name. An icon-only trigger still needs its own `aria-label`.

Keep tooltip content to text; put links and controls in a [Menu](menus.md) or on the page.

### Vanilla

| Class                 | Effect                                                                                                                                    |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `tooltip`             | The bubble: inverted `text`-on-`surface` fill, `0.5rem`/`0.25rem` padding, `text-xs`, `20rem` max-width, long tokens break, click-through |
| `tooltip-sm`          | Tighter padding                                                                                                                           |
| `tooltip-wrap`        | Reveals a nested `tooltip` on `:hover` and keyboard focus, positioned above and centred                                                   |
| `tooltip-wrap-bottom` | Below the trigger                                                                                                                         |
| `tooltip-wrap-start`  | Before the trigger on the inline axis (left in LTR)                                                                                       |
| `tooltip-wrap-end`    | After the trigger on the inline axis (right in LTR)                                                                                       |

The vanilla path needs no JavaScript: the wrapper reveals the bubble after a `200ms` delay on hover and on keyboard focus (a `:focus-visible` descendant). A mouse click doesn't open it, as in Base UI. Write `role="tooltip"` on the bubble yourself.

Above is the default, so there is no `tooltip-wrap-top`. In browsers with CSS anchor positioning the bubble is `position: fixed` against the wrapper: it escapes ancestor overflow, flips to the opposite side when its own has no room, and shifts to stay inside the viewport. A transformed ancestor, such as an open drawer, still contains it. Other browsers position it absolutely with no flip, so pick a side that has room. React's positioner handles collisions in every browser, and its popup transitions per side from Base UI's `[data-side]` and `[data-starting-style]` attributes, which is why one class covers both paths.

Both bundles ship `popup-layer` for the portaled popup, and the vanilla bubble reads the same `--z-popup`; see [Theming › Popup layering](../basics/theming.md#popup-layering).
