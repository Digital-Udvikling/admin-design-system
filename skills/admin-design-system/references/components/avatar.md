# Avatar

> Image with a no-JS initials fallback, plus a group stack.

## Contents

- [Examples](#examples)
- [Sizes](#sizes)
- [Square](#square)
- [Image fallback](#image-fallback)
- [Group](#group)
- [Status](#status)

The `<img>` overlays the initials, so they show while it loads. A broken-image fallback to initials is React-only; vanilla consumers omit the `<img>` when the URL may be dead. For an initials-only avatar beside a visible name, mark it `aria-hidden` so the name is not read twice.

## Examples

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

## Sizes

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

## Square

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

## Image fallback

The initials sit underneath the image and show through when it has not loaded.

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

## Group

Later avatars paint on top. Pass `max` to cap the visible avatars; the rest collapse into a trailing `avatar-more` tile. Vanilla consumers write the surplus tile themselves.

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

## Status

Compose with [`<Indicator>`](indicator.md) for a presence dot. The offset is auto-detected per size and shape.

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
