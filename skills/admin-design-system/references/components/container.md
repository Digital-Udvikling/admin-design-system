# Container

> A centered, max-width page region that spaces its sections.

The page body you drop inside `<AppShell.Main>` (which has no padding of its own). It centers content at an admin-wide max-width and puts a consistent gap between stacked sections, so pages don't each re-invent their spacing.

Not to be confused with the `.Container` escape hatch on compound components like [`Card.Container`](../cards/#advanced-layout-with-cardcontainer) — `<Container>` is a standalone page region, not a bare-primitive sub-part.

## Examples

### Basic

Children stack with the container's `gap` — the space between cards below is the container's, not the cards'.

**Example**

```html
<div class="container">
  <div class="card">
    <div class="card-body">
      <h3 class="card-title">Overview</h3>
      <p class="card-description">
        The container centers this column and spaces the sections within it.
      </p>
    </div>
  </div>
  <div class="card">
    <div class="card-body">
      <h3 class="card-title">Activity</h3>
      <p class="card-description">A second section, evenly spaced from the first.</p>
    </div>
  </div>
</div>
```

```tsx
<Container>
  <Card
    title="Overview"
    description="The container centers this column and spaces the sections within it."
  />
  <Card title="Activity" description="A second section, evenly spaced from the first." />
</Container>
```

### Sizes

Widths run wide for admin UIs: `sm` caps at 60rem (forms, settings), the default `md` at 90rem, `lg` at 115rem (wide tables, dashboards), and `fluid` drops the cap entirely. A cap only takes effect once the viewport is wider than it, so in this narrow preview they all fill the available width.

**Example**

```html
<div class="container container-sm">
  <div class="card">
    <div class="card-body"><h3 class="card-title">sm — 60rem</h3></div>
  </div>
</div>
<div class="container container-lg">
  <div class="card">
    <div class="card-body"><h3 class="card-title">lg — 115rem</h3></div>
  </div>
</div>
<div class="container container-fluid">
  <div class="card">
    <div class="card-body"><h3 class="card-title">fluid — no cap</h3></div>
  </div>
</div>
```

```tsx
<>
  <Container size="sm">
    <Card title="sm — 60rem" />
  </Container>
  <Container size="lg">
    <Card title="lg — 115rem" />
  </Container>
  <Container size="fluid">
    <Card title="fluid — no cap" />
  </Container>
</>
```

### Compact

Tightens the vertical rhythm and block padding for dense screens.

**Example**

```html
<div class="container container-compact">
  <div class="card">
    <div class="card-body"><h3 class="card-title">Tighter rhythm</h3></div>
  </div>
  <div class="card">
    <div class="card-body"><h3 class="card-title">Less air between sections</h3></div>
  </div>
</div>
```

```tsx
<Container compact>
  <Card title="Tighter rhythm" />
  <Card title="Less air between sections" />
</Container>
```

### Custom width

Every preset just sets `--container-max`. Override it inline for a one-off width — here a narrow reading column, capped at 40rem and centered.

**Example**

```html
<div class="container" style="--container-max: 40rem">
  <div class="card">
    <div class="card-body">
      <h3 class="card-title">Release notes</h3>
      <p class="card-description">Capped at 40rem and centered in the available space.</p>
    </div>
  </div>
</div>
```

```tsx
<Container style={{ "--container-max": "40rem" } as React.CSSProperties}>
  <Card title="Release notes" description="Capped at 40rem and centered in the available space." />
</Container>
```

### In an app shell

Place a `<Container>` inside `<AppShell.Main>`. See [App shell](../../modules/app-shell/).

**Example**

```html
<div class="app-shell" style="min-height: 16rem; --color-system-accent: var(--color-purple-600)">
  <header class="navbar">
    <div class="navbar-brand">
      <span class="brand-tile" aria-hidden>A</span>
      Acme
    </div>
  </header>
  <main class="app-shell-main">
    <div class="container container-sm">
      <div class="card">
        <div class="card-body">
          <h3 class="card-title">Settings</h3>
          <p class="card-description">
            The container gives main its width cap, padding, and section spacing.
          </p>
        </div>
      </div>
    </div>
  </main>
</div>
```

```tsx
<AppShell systemAccent="var(--color-purple-600)" style={{ minHeight: "16rem" }}>
  <Navbar>
    <Navbar.Brand>
      <BrandTile monogram="A" />
      Acme
    </Navbar.Brand>
  </Navbar>
  <AppShell.Main>
    <Container size="sm">
      <Card
        title="Settings"
        description="The container gives main its width cap, padding, and section spacing."
      />
    </Container>
  </AppShell.Main>
</AppShell>
```
