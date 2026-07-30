# Indicator

> Place a badge, count, or dot on the corner of another element.

## Contents

- [Examples](#examples)
  - [Count on a button](#count-on-a-button)
  - [Count overflow](#count-overflow)
  - [Status dot](#status-dot)
  - [Placements](#placements)
  - [Multiple items](#multiple-items)
- [Reference](#reference)
  - [React](#react)
  - [Vanilla](#vanilla)

## Examples

### Count on a button

**Example**

```html
<div class="indicator">
  <span class="indicator-item badge badge-danger badge-sm">3</span>
  <button class="btn btn-primary">
    <i class="ti ti-inbox" aria-hidden="true"></i>
    Inbox
  </button>
</div>
```

```tsx
<Indicator label="3" variant="danger">
  <Button variant="primary" icon={IconInbox}>
    Inbox
  </Button>
</Indicator>
```

### Count overflow

**Example**

```html
<div class="indicator">
  <span class="indicator-item badge badge-danger badge-sm">99+</span>
  <button class="btn btn-primary">
    <i class="ti ti-inbox" aria-hidden="true"></i>
    Inbox
  </button>
</div>
```

```tsx
<Indicator label={128} max={99} variant="danger">
  <Button variant="primary" icon={IconInbox}>
    Inbox
  </Button>
</Indicator>
```

### Status dot

**Example**

```html
<div class="indicator">
  <span
    class="indicator-item indicator-dot indicator-dot-success"
    role="status"
    aria-label="Online"
  ></span>
  <button class="btn btn-primary">
    <i class="ti ti-user" aria-hidden="true"></i>
    Account
  </button>
</div>
```

```tsx
<Indicator variant="success" aria-label="Online">
  <Button variant="primary" icon={IconUser}>
    Account
  </Button>
</Indicator>
```

### Placements

**Example**

```html
<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem;">
  <div class="indicator">
    <span class="indicator-item indicator-top indicator-start badge badge-primary badge-sm"
      >TS</span
    >
    <div class="card card-bordered" style="width: 6rem; height: 4rem;"></div>
  </div>
  <div class="indicator">
    <span class="indicator-item indicator-top indicator-center badge badge-primary badge-sm"
      >TC</span
    >
    <div class="card card-bordered" style="width: 6rem; height: 4rem;"></div>
  </div>
  <div class="indicator">
    <span class="indicator-item badge badge-primary badge-sm">TE</span>
    <div class="card card-bordered" style="width: 6rem; height: 4rem;"></div>
  </div>
  <div class="indicator">
    <span class="indicator-item indicator-middle indicator-start badge badge-primary badge-sm"
      >MS</span
    >
    <div class="card card-bordered" style="width: 6rem; height: 4rem;"></div>
  </div>
  <div class="indicator">
    <span class="indicator-item indicator-middle indicator-center badge badge-primary badge-sm"
      >MC</span
    >
    <div class="card card-bordered" style="width: 6rem; height: 4rem;"></div>
  </div>
  <div class="indicator">
    <span class="indicator-item indicator-middle indicator-end badge badge-primary badge-sm"
      >ME</span
    >
    <div class="card card-bordered" style="width: 6rem; height: 4rem;"></div>
  </div>
  <div class="indicator">
    <span class="indicator-item indicator-bottom indicator-start badge badge-primary badge-sm"
      >BS</span
    >
    <div class="card card-bordered" style="width: 6rem; height: 4rem;"></div>
  </div>
  <div class="indicator">
    <span class="indicator-item indicator-bottom indicator-center badge badge-primary badge-sm"
      >BC</span
    >
    <div class="card card-bordered" style="width: 6rem; height: 4rem;"></div>
  </div>
  <div class="indicator">
    <span class="indicator-item indicator-bottom indicator-end badge badge-primary badge-sm"
      >BE</span
    >
    <div class="card card-bordered" style="width: 6rem; height: 4rem;"></div>
  </div>
</div>
```

```tsx
<div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2rem" }}>
  {(
    [
      "top-start",
      "top-center",
      "top-end",
      "middle-start",
      "middle-center",
      "middle-end",
      "bottom-start",
      "bottom-center",
      "bottom-end",
    ] as const
  ).map((placement) => (
    <Indicator
      key={placement}
      placement={placement}
      variant="primary"
      label={placement
        .split("-")
        .map((part) => part[0]!.toUpperCase())
        .join("")}
    >
      <Card.Container bordered style={{ width: "6rem", height: "4rem" }} />
    </Indicator>
  ))}
</div>
```

### Multiple items

**Example**

```html
<div class="indicator">
  <span class="indicator-item badge badge-danger badge-sm">12</span>
  <span
    class="indicator-item indicator-bottom indicator-end indicator-dot indicator-dot-success"
    role="status"
    aria-label="Online"
  ></span>
  <button class="btn btn-primary">
    <i class="ti ti-inbox" aria-hidden="true"></i>
    Inbox
  </button>
</div>
```

## Reference

### React

| Prop         | Type                                                                     | Default     |
| ------------ | ------------------------------------------------------------------------ | ----------- |
| `label`      | `ReactNode`                                                              | —           |
| `variant`    | `"neutral" \| "info" \| "success" \| "warning" \| "danger" \| "primary"` | `"neutral"` |
| `size`       | `"sm" \| "md" \| "lg"`                                                   | `"sm"`      |
| `icon`       | [`IconProp`](../basics/conventions.md#icons)                            | —           |
| `placement`  | `` `${"top" \| "middle" \| "bottom"}-${"start" \| "center" \| "end"}` `` | `"top-end"` |
| `offset`     | `number`                                                                 | auto        |
| `max`        | `number`                                                                 | —           |
| `aria-label` | `string`                                                                 | —           |

The anchor goes in `children`; the floating element is built from the props. With `label` or `icon` it is a [Badge](badges.md) and `size` applies; with neither it is a label-less dot and `size` is ignored. `max` clamps a numeric `label` to `${max}+`.

`aria-label` names the floating element, not the wrapper, and a dot gets `role="status"` only when you pass one — without it the dot is decorative. One `Indicator` carries one item; for two on the same anchor, compose the classes as in the last example.

Plus native `<div>` attributes.

### Vanilla

| Class / var                                                                                                         | Effect                                                                               |
| ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| `indicator`                                                                                                         | Wrapper: `position: relative`, inline, shrink-wrapped to the anchor                  |
| `indicator-item`                                                                                                    | The floating child. Absolute, `z-index: 1`, half-overflowing the top-end corner      |
| `indicator-start`                                                                                                   | Pin to the inline start                                                              |
| `indicator-center`                                                                                                  | Centre on the inline axis                                                            |
| `indicator-end`                                                                                                     | Pin to the inline end (default)                                                      |
| `indicator-top`                                                                                                     | Pin to the top (default)                                                             |
| `indicator-middle`                                                                                                  | Centre on the block axis                                                             |
| `indicator-bottom`                                                                                                  | Pin to the bottom                                                                    |
| `indicator-dot`                                                                                                     | `0.5rem` round dot in the muted text colour — an empty `badge` would still be a pill |
| `indicator-dot-info` `indicator-dot-success` `indicator-dot-warning` `indicator-dot-danger` `indicator-dot-primary` | Status fill for the dot                                                              |
| `--indicator-offset`                                                                                                | Pixels to pull the item back toward the anchor's centre                              |

One vertical and one horizontal modifier compose, so placement is nine combinations from six classes rather than a 3×3 selector grid. Both defaults are omitted: a bare `indicator-item` is top-end.

`--indicator-offset` aligns the item with the _visual_ corner of a rounded anchor, and `:has()` sets it from the direct child: `2px` for `btn`, `input` and `avatar-square`, `6px` for `card` and `avatar-lg`, `5px` for `avatar`, `3px` for `avatar-sm`. Any other anchor gets `0`, which centres the item exactly on the geometric corner — set the property (or React's `offset`) yourself for a rounded one.
