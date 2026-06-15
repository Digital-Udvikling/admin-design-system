# Separator

> A styled hr with an optional vertical modifier.

A styled `<hr>` (implicit `role="separator"`). Margins are zeroed — spacing comes from the parent's `gap` or margin utilities.

## Examples

### Horizontal

**Example**

```html
<hr class="separator" />
```

```tsx
<Separator />
```

### Vertical

Set `aria-orientation="vertical"` by hand in vanilla; the React `orientation` prop adds it.

**Example**

```html
<div style="display: flex; align-items: center; gap: 0.75rem;">
  <span>Edit</span>
  <hr class="separator separator-vertical" aria-orientation="vertical" />
  <span>Duplicate</span>
  <hr class="separator separator-vertical" aria-orientation="vertical" />
  <span>Delete</span>
</div>
```

```tsx
<div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
  <span>Edit</span>
  <Separator orientation="vertical" />
  <span>Duplicate</span>
  <Separator orientation="vertical" />
  <span>Delete</span>
</div>
```

### Splitting card sections

**Example**

```html
<div class="card">
  <div class="card-body">
    <h3 class="card-title">Net promoter score</h3>
    <p class="card-description">Last 30 days.</p>
  </div>
  <hr class="separator" />
  <div class="card-body">
    <strong>+42</strong>
  </div>
</div>
```

```tsx
<Card.Container>
  <Card.Body>
    <Card.Title>Net promoter score</Card.Title>
    <Card.Description>Last 30 days.</Card.Description>
  </Card.Body>
  <Separator />
  <Card.Body>
    <strong>+42</strong>
  </Card.Body>
</Card.Container>
```

[Menus](menus.md) and [Breadcrumbs](breadcrumbs.md) keep their own scoped separators.
