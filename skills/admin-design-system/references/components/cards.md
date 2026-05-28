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
      <Button variant="primary" size="sm">
        Get started
      </Button>
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
    <input class="input" placeholder="Email" />
    <input class="input" type="password" placeholder="Password" />
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
      <Button variant="primary">Sign in</Button>
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

### Color variants

A tinted surface signals status — a healthy service, a destructive zone, a heads-up. The title (and any leading icon) picks up the matching accent. Use sparingly; a busy screen of colored cards reads as noise.

A default card sits one step above the page (`surface-strong`) so it reads as a distinct panel. `card-muted` is the exception — it fills with the page background (`surface`) so it sits flush instead of popping out. No accent, no status meaning; reach for it to de-emphasise or visually group panels.

**Example**

```html
<div class="card card-muted">
  <div class="card-body">
    <h3 class="card-title">Muted</h3>
    <p class="card-description">Sits flush with the page background.</p>
  </div>
</div>
<div class="card card-primary">
  <div class="card-body">
    <h3 class="card-title">Primary</h3>
    <p class="card-description">A highlighted, featured card.</p>
  </div>
</div>
<div class="card card-info">
  <div class="card-body">
    <h3 class="card-title">Info</h3>
    <p class="card-description">Neutral, informational context.</p>
  </div>
</div>
<div class="card card-success">
  <div class="card-body">
    <h3 class="card-title">Success</h3>
    <p class="card-description">All systems operational.</p>
  </div>
</div>
<div class="card card-warning">
  <div class="card-body">
    <h3 class="card-title">Warning</h3>
    <p class="card-description">Approaching the rate limit.</p>
  </div>
</div>
<div class="card card-danger">
  <div class="card-body">
    <h3 class="card-title">Danger</h3>
    <p class="card-description">Deleting this is irreversible.</p>
  </div>
</div>
```

```tsx
<>
  <Card variant="muted" title="Muted" description="Sits flush with the page background." />
  <Card variant="primary" title="Primary" description="A highlighted, featured card." />
  <Card variant="info" title="Info" description="Neutral, informational context." />
  <Card variant="success" title="Success" description="All systems operational." />
  <Card variant="warning" title="Warning" description="Approaching the rate limit." />
  <Card variant="danger" title="Danger" description="Deleting this is irreversible." />
</>
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
    <Button variant="primary" size="sm" iconTrailing={IconArrowRight}>
      Open queue
    </Button>
  }
/>
```

### Header toolbar

Pass `toolbar` for trailing header controls — edit, dismiss, anything. It sits at the end of the title row; add as many buttons as you need. These are usually [square icon buttons](../buttons/#icon-only) with an `aria-label`.

**Example**

```html
<div class="card card-bordered">
  <div class="card-body">
    <div class="card-header">
      <h3 class="card-title">Webhook</h3>
      <div class="card-toolbar">
        <button class="btn btn-ghost btn-square btn-sm" type="button" aria-label="Edit">
          <i class="ti ti-pencil" aria-hidden="true"></i>
        </button>
        <button class="btn btn-ghost btn-square btn-sm" type="button" aria-label="Dismiss">
          <i class="ti ti-x" aria-hidden="true"></i>
        </button>
      </div>
    </div>
    <p class="card-description">Fires on every order status change.</p>
  </div>
</div>
```

```tsx
<Card
  bordered
  title="Webhook"
  description="Fires on every order status change."
  toolbar={
    <>
      <Button variant="ghost" size="sm" icon={IconPencil} aria-label="Edit" />
      <Button variant="ghost" size="sm" icon={IconX} aria-label="Dismiss" />
    </>
  }
/>
```

## Advanced: layout with `Card.Container`

`<Card.Container>` renders the bare `.card` and lets you compose sub-parts directly.

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

`<Card.Title>` still accepts the `icon` prop in the advanced path, and `<Card.Header>` + `<Card.Toolbar>` are available for composing a header row by hand.
