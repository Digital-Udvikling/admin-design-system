# List

> Compact rows for settings, members, and notifications.

## Contents

- [Examples](#examples)
  - [Settings rows](#settings-rows)
  - [With media](#with-media)
  - [Whole-row link](#whole-row-link)
  - [Sizes](#sizes)

A low-chrome row — leading media, a title and description, trailing actions. Use `Item` when each row is a small record with an action or two. For tabular data with columns, use a [Table](tables.md); for a self-contained panel, use a [Card](cards.md).

## Examples

### Settings rows

**Example**

```html
<div class="item-group item-group-bordered">
  <div class="item">
    <div class="item-content">
      <div class="item-title">Two-factor authentication</div>
      <div class="item-description">Add a second step when signing in.</div>
    </div>
    <div class="item-actions">
      <button class="btn btn-sm" type="button">Configure</button>
    </div>
  </div>
  <div class="item">
    <div class="item-content">
      <div class="item-title">Active sessions</div>
      <div class="item-description">3 devices.</div>
    </div>
    <div class="item-actions">
      <button class="btn btn-sm" type="button">Manage</button>
    </div>
  </div>
</div>
```

```tsx
<ItemGroup bordered>
  <Item
    title="Two-factor authentication"
    description="Add a second step when signing in."
    actions={<Button size="sm">Configure</Button>}
  />
  <Item
    title="Active sessions"
    description="3 devices."
    actions={<Button size="sm">Manage</Button>}
  />
</ItemGroup>
```

### With media

`media` takes an avatar or thumbnail; `icon` drops a glyph in the same slot.

**Example**

```html
<div class="item-group">
  <div class="item">
    <div class="item-media"><span class="avatar avatar-sm">AL</span></div>
    <div class="item-content">
      <div class="item-title">Ada Lovelace</div>
      <div class="item-description">Admin · ada@example.com</div>
    </div>
    <div class="item-actions"><span class="badge badge-success badge-soft">Active</span></div>
  </div>
  <div class="item">
    <div class="item-media"><span class="avatar avatar-sm">GH</span></div>
    <div class="item-content">
      <div class="item-title">Grace Hopper</div>
      <div class="item-description">Editor · grace@example.com</div>
    </div>
    <div class="item-actions"><span class="badge badge-soft">Invited</span></div>
  </div>
</div>
```

```tsx
<ItemGroup>
  <Item
    media={<Avatar initials="AL" size="sm" />}
    title="Ada Lovelace"
    description="Admin · ada@example.com"
    actions={
      <Badge variant="success" soft>
        Active
      </Badge>
    }
  />
  <Item
    media={<Avatar initials="GH" size="sm" />}
    title="Grace Hopper"
    description="Editor · grace@example.com"
    actions={<Badge soft>Invited</Badge>}
  />
</ItemGroup>
```

### Whole-row link

Set `asLink` and put the link in the title — its hit area fills the row while the trailing action stays clickable.

**Example**

```html
<div class="item-group item-group-bordered">
  <div class="item item-link">
    <div class="item-content">
      <div class="item-title"><a href="#ada">Ada Lovelace</a></div>
      <div class="item-description">ada@example.com</div>
    </div>
    <div class="item-actions">
      <button class="btn btn-sm btn-ghost" type="button" aria-label="More">
        <i class="ti ti-dots" aria-hidden="true"></i>
      </button>
    </div>
  </div>
</div>
```

```tsx
<ItemGroup bordered>
  <Item
    asLink
    title={<a href="#ada">Ada Lovelace</a>}
    description="ada@example.com"
    actions={<Button size="sm" variant="ghost" icon={IconDots} aria-label="More" />}
  />
</ItemGroup>
```

### Sizes

**Example**

```html
<div class="item-group item-group-bordered">
  <div class="item item-sm">
    <div class="item-content"><div class="item-title">Small</div></div>
  </div>
  <div class="item">
    <div class="item-content"><div class="item-title">Medium</div></div>
  </div>
  <div class="item item-lg">
    <div class="item-content"><div class="item-title">Large</div></div>
  </div>
</div>
```

```tsx
<ItemGroup bordered>
  <Item size="sm" title="Small" />
  <Item title="Medium" />
  <Item size="lg" title="Large" />
</ItemGroup>
```
