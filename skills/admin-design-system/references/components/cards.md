# Cards

> A container with optional title, description, and actions.

## Examples

### Basic

`<Card>` accepts `title`, `description`, and `actions` props; children render inside an auto-wrapped `<Card.Body>`. For layouts that don't fit (media above the body, multiple bodies, custom header), reach for [`<Card.Container>`](#advanced-layout-with-cardcontainer).

**Example**

```html
<div class="card">
  <div class="card-body">
    <h3 class="card-title">Welcome</h3>
    <p class="card-description">A short description sits here.</p>
    <div class="card-actions">
      <button class="btn btn-primary btn-sm">Get started</button>
      <button class="btn btn-ghost btn-sm">Maybe later</button>
    </div>
  </div>
</div>
```

```tsx
<Card
  title="Welcome"
  description="A short description sits here."
  actions={
    <>
      <Button size="sm">Get started</Button>
      <Button variant="ghost" size="sm">
        Maybe later
      </Button>
    </>
  }
/>
```

### Sign-in form

Free-form content goes as children, between the title and the actions.

**Example**

```html
<div class="card">
  <div class="card-body">
    <h3 class="card-title">Sign in</h3>
    <input class="input input-bordered" placeholder="Email" />
    <input class="input input-bordered" type="password" placeholder="Password" />
    <div class="card-actions">
      <button class="btn btn-primary">Sign in</button>
      <button class="btn btn-ghost">Cancel</button>
    </div>
  </div>
</div>
```

```tsx
<Card
  title="Sign in"
  actions={
    <>
      <Button>Sign in</Button>
      <Button variant="ghost">Cancel</Button>
    </>
  }
>
  <Input placeholder="Email" />
  <Input type="password" placeholder="Password" />
</Card>
```

### Compact + bordered

**Example**

```html
<div class="card card-compact card-bordered">
  <div class="card-body">
    <h3 class="card-title">Flat & dense</h3>
    <p class="card-description">Less padding, stronger border, no shadow.</p>
  </div>
</div>
```

```tsx
<Card
  compact
  bordered
  title="Flat & dense"
  description="Less padding, stronger border, no shadow."
/>
```

### With icon

Pass `icon` — it lands in the title row. See [Icons](../../basics/icons/).

**Example**

```html
<div class="card card-bordered">
  <div class="card-body">
    <h3 class="card-title">
      <i class="ti ti-shopping-bag" aria-hidden="true"></i>
      Today's orders
    </h3>
    <p class="card-description">128 placed, 14 awaiting fulfilment.</p>
    <div class="card-actions">
      <button class="btn btn-primary btn-sm">
        Open queue
        <i class="ti ti-arrow-right" aria-hidden="true"></i>
      </button>
    </div>
  </div>
</div>
```

```tsx
<Card
  bordered
  icon={IconShoppingBag}
  title="Today's orders"
  description="128 placed, 14 awaiting fulfilment."
  actions={
    <Button size="sm" iconTrailing={IconArrowRight}>
      Open queue
    </Button>
  }
/>
```

## Advanced: layout with `Card.Container`

`<Card>` is opinionated — single body, title on top, actions at the bottom. For layouts that don't fit, drop down to `<Card.Container>`: it renders the bare `.card` element (with `bordered`/`compact` modifiers) and lets you compose the sub-parts yourself.

**Example**

```html
<div class="card card-bordered">
  <div class="card-body" style="border-bottom: 1px solid var(--color-border)">
    <h3 class="card-title">Connected</h3>
    <p class="card-description">Last sync 3 minutes ago.</p>
  </div>
  <div class="card-body">
    <div class="card-actions">
      <button class="btn btn-ghost btn-sm">Re-sync now</button>
      <button class="btn btn-danger btn-sm">Disconnect</button>
    </div>
  </div>
</div>
```

```tsx
<Card.Container bordered>
  <Card.Body style={{ borderBottom: "1px solid var(--color-border)" }}>
    <Card.Title>Connected</Card.Title>
    <Card.Description>Last sync 3 minutes ago.</Card.Description>
  </Card.Body>
  <Card.Body>
    <Card.Actions>
      <Button variant="ghost" size="sm">
        Re-sync now
      </Button>
      <Button variant="danger" size="sm">
        Disconnect
      </Button>
    </Card.Actions>
  </Card.Body>
</Card.Container>
```

`<Card.Title>` still accepts the `icon` prop in the advanced path.
