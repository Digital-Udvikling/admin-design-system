# Avatar

> Image with a no-JS initials fallback, plus a group stack.

## Contents

- [Examples](#examples)
  - [Basic](#basic)
  - [Sizes](#sizes)
  - [Square](#square)
  - [Image fallback](#image-fallback)
  - [Group](#group)
  - [Status](#status)
- [Reference](#reference)
  - [React](#react)
  - [Vanilla](#vanilla)

## Examples

### Basic

**Example**

```html
<span class="avatar">OR</span>
<span class="avatar">ARJ</span>
<span class="avatar">
  <img src="https://i.pravatar.cc/64?img=12" alt="Ada Lovelace" />
</span>
```

```tsx
<Avatar initials="OR" />
<Avatar initials="ARJ" />
<Avatar src="https://i.pravatar.cc/64?img=12" alt="Ada Lovelace" />
```

### Sizes

**Example**

```html
<span class="avatar avatar-sm">OR</span>
<span class="avatar">OR</span>
<span class="avatar avatar-lg">OR</span>
```

```tsx
<Avatar initials="OR" size="sm" />
<Avatar initials="OR" />
<Avatar initials="OR" size="lg" />
```

### Square

**Example**

```html
<span class="avatar avatar-square">OR</span>
<span class="avatar avatar-square avatar-lg">
  <img src="https://i.pravatar.cc/64?img=5" alt="Grace Hopper" />
</span>
```

```tsx
<Avatar initials="OR" shape="square" />
<Avatar src="https://i.pravatar.cc/64?img=5" alt="Grace Hopper" size="lg" shape="square" />
```

### Image fallback

**Example**

```html
<span class="avatar">
  AT
  <img src="https://i.pravatar.cc/64?img=8" alt="Alan Turing" />
</span>
```

```tsx
<Avatar src="https://i.pravatar.cc/64?img=8" alt="Alan Turing" initials="AT" />
```

### Group

**Example**

```html
<div class="avatar-group">
  <span class="avatar">
    <img src="https://i.pravatar.cc/64?img=1" alt="Ada Lovelace" />
  </span>
  <span class="avatar">
    <img src="https://i.pravatar.cc/64?img=2" alt="Grace Hopper" />
  </span>
  <span class="avatar">
    <img src="https://i.pravatar.cc/64?img=3" alt="Alan Turing" />
  </span>
  <span class="avatar avatar-more" aria-label="+3 more">+3</span>
</div>
```

```tsx
<AvatarGroup max={3}>
  <Avatar src="https://i.pravatar.cc/64?img=1" alt="Ada Lovelace" />
  <Avatar src="https://i.pravatar.cc/64?img=2" alt="Grace Hopper" />
  <Avatar src="https://i.pravatar.cc/64?img=3" alt="Alan Turing" />
  <Avatar src="https://i.pravatar.cc/64?img=4" alt="Katherine Johnson" />
  <Avatar src="https://i.pravatar.cc/64?img=5" alt="Edsger Dijkstra" />
  <Avatar src="https://i.pravatar.cc/64?img=6" alt="Barbara Liskov" />
</AvatarGroup>
```

### Status

**Example**

```html
<div class="indicator">
  <span class="indicator-item indicator-dot indicator-dot-success" aria-label="Online"></span>
  <span class="avatar avatar-lg">
    <img src="https://i.pravatar.cc/64?img=12" alt="Ada Lovelace" />
  </span>
</div>
```

```tsx
<Indicator variant="success" aria-label="Online">
  <Avatar src="https://i.pravatar.cc/64?img=12" alt="Ada Lovelace" size="lg" />
</Indicator>
```

**Caution** — For an initials-only avatar sitting beside a visible name, mark it `aria-hidden` so the name isn't announced twice.

## Reference

### React

| Component     | Prop       | Type                   | Default    |
| ------------- | ---------- | ---------------------- | ---------- |
| `Avatar`      | `src`      | `string`               | —          |
| `Avatar`      | `alt`      | `string`               | —          |
| `Avatar`      | `initials` | `string`               | —          |
| `Avatar`      | `size`     | `"sm" \| "md" \| "lg"` | `"md"`     |
| `Avatar`      | `shape`    | `"circle" \| "square"` | `"circle"` |
| `AvatarGroup` | `max`      | `number`               | —          |
| `AvatarGroup` | `size`     | `"sm" \| "md" \| "lg"` | `"md"`     |

`initials` wants 1–3 letters and is ignored when `children` is given. Wraps [Base UI Avatar](https://base-ui.com/react/components/avatar), which adds one thing the CSS can't: on an image _error_ it falls back to the initials, not just during loading.

`AvatarGroup` keeps the first `max` children and collapses the remainder into a trailing `avatar-more` tile labelled `+N more`. Its `size` only sizes that surplus tile — match it to the avatars inside, since the group doesn't resize its children.

Plus native `<span>` attributes on `Avatar`, `<div>` on `AvatarGroup`.

### Vanilla

| Class           | Effect                                                                                       |
| --------------- | -------------------------------------------------------------------------------------------- |
| `avatar`        | `2rem` circle, `surface-strong` fill, `text-xs` centred initials, clipped                    |
| `avatar-sm`     | `1.5rem`, `0.625rem` text                                                                    |
| `avatar-lg`     | `2.5rem`, `text-sm`                                                                          |
| `avatar-square` | `0.375rem` radius instead of a circle                                                        |
| `avatar-group`  | Inline row that overlaps its `avatar` children by `0.5rem`, each ringed `2px` in the surface |
| `avatar-more`   | Surplus tile styling for the trailing `+N`; tabular figures. Combine with `avatar`           |

There is no `avatar-md` or `avatar-circle` — both are the unmodified `avatar`. A direct `<img>` child is layered over the initials and fills the tile, so the initials show until it loads with no JS involved; if the URL may be dead, omit the `<img>` rather than rely on a fallback. Later children in a group paint on top. The surplus tile and its `aria-label` are yours to write.

[Indicator](indicator.md) knows this component's sizes and shapes, so a presence dot lands on the right corner without an explicit offset.
