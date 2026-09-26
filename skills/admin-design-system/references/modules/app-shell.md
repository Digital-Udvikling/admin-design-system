# App shell

> Page chrome — navbar, optional sidebar, optional footer — around a main content area.

## Contents

- [Anatomy](#anatomy)
- [Quick start](#quick-start)
- [Navbar](#navbar)
  - [Dropdowns](#dropdowns)
  - [Actions slot](#actions-slot)
  - [Mobile toggle](#mobile-toggle)
- [Sidebar](#sidebar)
  - [Items and groups](#items-and-groups)
  - [Tree navigation](#tree-navigation)
  - [Click to collapse](#click-to-collapse)
  - [Mobile drawer](#mobile-drawer)
- [Footer](#footer)
- [Examples](#examples)
  - [Classic admin](#classic-admin)
  - [Top-nav heavy](#top-nav-heavy)
  - [Dashboard](#dashboard)
- [Customization](#customization)
- [Branding multiple systems](#branding-multiple-systems)
- [Reference](#reference)
  - [React](#react)
  - [Vanilla](#vanilla)

A CSS grid with named areas — `header`, `sidebar`, `main`, `footer` — plus a small React context that wires `<Navbar.MobileToggle>` to the sidebar drawer. The composed pieces (navbar, sidebar, footer) also work standalone.

## Anatomy

```text
+--------------------------------------------+
|                    navbar                  |
+----------+---------------------------------+
|          |                                 |
| sidebar  |              main               |
|  (opt.)  |                                 |
|          |                                 |
+----------+---------------------------------+
|                    footer (opt.)           |
+--------------------------------------------+
```

## Quick start

**Example**

```html
<div
  class="app-shell"
  style="min-height: 16rem; --color-system-accent: light-dark(var(--color-purple-600), var(--color-purple-400))"
>
  <header class="navbar">
    <div class="navbar-brand">
      <span class="brand-tile" aria-hidden="true">A</span>
      Acme
    </div>
  </header>
  <main class="app-shell-main" style="padding: 1rem">Page content</main>
</div>
```

```tsx
<AppShell
  systemAccent="light-dark(var(--color-purple-600), var(--color-purple-400))"
  style={{ minHeight: "16rem" }}
>
  <Navbar>
    <Navbar.Brand>
      <BrandTile monogram="A" />
      Acme
    </Navbar.Brand>
  </Navbar>
  <AppShell.Main style={{ padding: "1rem" }}>Page content</AppShell.Main>
</AppShell>
```

A `<Sidebar>` placed directly in the shell adds the sidebar column; a `<Footer>` drops into the bottom row. Both are placed by structure, so `hasSidebar` is optional.

**Example**

```tsx
<AppShell
  systemAccent="light-dark(var(--color-purple-600), var(--color-purple-400))"
  style={{ minHeight: "20rem" }}
>
  <Navbar>
    <Navbar.Brand>
      <BrandTile monogram="A" />
      Acme
    </Navbar.Brand>
  </Navbar>
  <Sidebar>
    <Sidebar.Nav>
      <Sidebar.Item href="#" active icon={IconHome}>
        Dashboard
      </Sidebar.Item>
      <Sidebar.Item href="#" icon={IconReceipt}>
        Orders
      </Sidebar.Item>
    </Sidebar.Nav>
  </Sidebar>
  <AppShell.Main style={{ padding: "1rem" }}>Page content</AppShell.Main>
  <Footer>
    <Footer.Meta>© Acme</Footer.Meta>
  </Footer>
</AppShell>
```

## Navbar

48px-tall flex row: `<Navbar.Brand>` and `<Navbar.Items>` on the left, `<Navbar.Actions>` on the right. `active` on an item sets `aria-current="page"`. Items accept a leading `icon` prop.

**Example**

```html
<header
  class="navbar"
  style="--color-system-accent: light-dark(var(--color-purple-600), var(--color-purple-400))"
>
  <div class="navbar-brand">
    <span class="brand-tile" aria-hidden="true">A</span>
    Acme
  </div>
  <nav class="navbar-items">
    <a class="navbar-item" href="#" aria-current="page">
      <i class="ti ti-home" aria-hidden="true"></i>
      Dashboard
    </a>
    <a class="navbar-item" href="#">
      <i class="ti ti-receipt" aria-hidden="true"></i>
      Orders
    </a>
    <a class="navbar-item" href="#">Customers</a>
  </nav>
  <div class="navbar-actions">
    <button class="btn btn-ghost btn-sm" type="button">Sign out</button>
  </div>
</header>
```

```tsx
<Navbar systemAccent="light-dark(var(--color-purple-600), var(--color-purple-400))">
  <Navbar.Brand>
    <BrandTile monogram="A" />
    Acme
  </Navbar.Brand>
  <Navbar.Items>
    <Navbar.Item href="#" active icon={IconHome}>
      Dashboard
    </Navbar.Item>
    <Navbar.Item href="#" icon={IconReceipt}>
      Orders
    </Navbar.Item>
    <Navbar.Item href="#">Customers</Navbar.Item>
  </Navbar.Items>
  <Navbar.Actions>
    <Button variant="ghost" size="sm">
      Sign out
    </Button>
  </Navbar.Actions>
</Navbar>
```

### Dropdowns

`<Navbar.Dropdown>` is a [`<Menu>`](../components/menus.md) styled to fit the navbar. A `menu-item` with `aria-current="page"` is filled in the open menu and marks its trigger. For a page in the section that isn't one of the items, pass `active` (vanilla: `data-active` on the trigger). In `Navbar.Actions`, pass `align="end"`; the vanilla popup there aligns to the trigger's end edge without a class.

**Example**

```html
<header
  class="navbar"
  style="--color-system-accent: light-dark(var(--color-purple-600), var(--color-purple-400))"
>
  <div class="navbar-brand">
    <span class="brand-tile" aria-hidden="true">A</span>
    Acme
  </div>
  <nav class="navbar-items">
    <a class="navbar-item" href="#">Dashboard</a>
    <div class="menu">
      <button type="button" class="menu-trigger navbar-item" popovertarget="navbar-products">
        Products
      </button>
      <div class="menu-popup" id="navbar-products" popover>
        <a class="menu-item" href="#" aria-current="page">Catalogue</a>
        <button class="menu-item" type="button">Categories</button>
        <hr class="menu-separator" />
        <button class="menu-item" type="button">Imports</button>
      </div>
    </div>
  </nav>
</header>
```

```tsx
<Navbar systemAccent="light-dark(var(--color-purple-600), var(--color-purple-400))">
  <Navbar.Brand>
    <BrandTile monogram="A" />
    Acme
  </Navbar.Brand>
  <Navbar.Items>
    <Navbar.Item href="#">Dashboard</Navbar.Item>
    <Navbar.Dropdown label="Products">
      <Menu.Item href="#" aria-current="page">
        Catalogue
      </Menu.Item>
      <Menu.Item>Categories</Menu.Item>
      <Menu.Separator />
      <Menu.Item>Imports</Menu.Item>
    </Navbar.Dropdown>
  </Navbar.Items>
</Navbar>
```

### Actions slot

The vanilla example uses a native `<select>`; React's `<Select>` is preferable when option rows need custom rendering (icons, two lines, etc.).

**Example**

```html
<header
  class="navbar"
  style="--color-system-accent: light-dark(var(--color-green-600), var(--color-green-400))"
>
  <div class="navbar-brand">
    <span class="brand-tile" aria-hidden="true">AO</span>
    AO Retail
  </div>
  <div class="navbar-actions">
    <select class="select select-sm" style="width: auto" aria-label="Shop">
      <option value="billigvvs.dk">BilligVVS.dk</option>
      <option value="lavprisvvs.dk">LavprisVVS.dk</option>
      <option value="elproffs.se">ELproffs.se</option>
    </select>
    <div class="menu">
      <button type="button" class="menu-trigger navbar-item" popovertarget="navbar-account">
        Nickolaj
      </button>
      <div class="menu-popup" id="navbar-account" popover>
        <button class="menu-item" type="button">Profile</button>
        <hr class="menu-separator" />
        <button class="menu-item" type="button">Sign out</button>
      </div>
    </div>
  </div>
</header>
```

```tsx
<Navbar systemAccent="light-dark(var(--color-green-600), var(--color-green-400))">
  <Navbar.Brand>
    <BrandTile monogram="AO" />
    AO Retail
  </Navbar.Brand>
  <Navbar.Actions>
    <Select
      defaultValue="billigvvs.dk"
      items={{
        "billigvvs.dk": "BilligVVS.dk",
        "lavprisvvs.dk": "LavprisVVS.dk",
        "elproffs.se": "ELproffs.se",
      }}
    >
      <Select.Trigger size="sm" aria-label="Shop">
        <Select.Value />
        <Select.Icon />
      </Select.Trigger>
      <Select.Popup>
        <Select.Item value="billigvvs.dk">
          <Select.ItemText>BilligVVS.dk</Select.ItemText>
        </Select.Item>
        <Select.Item value="lavprisvvs.dk">
          <Select.ItemText>LavprisVVS.dk</Select.ItemText>
        </Select.Item>
        <Select.Item value="elproffs.se">
          <Select.ItemText>ELproffs.se</Select.ItemText>
        </Select.Item>
      </Select.Popup>
    </Select>
    <Navbar.Dropdown label="Nickolaj" align="end">
      <Menu.Item>Profile</Menu.Item>
      <Menu.Separator />
      <Menu.Item>Sign out</Menu.Item>
    </Navbar.Dropdown>
  </Navbar.Actions>
</Navbar>
```

### Mobile toggle

`<Navbar.MobileToggle>` is hidden at ≥ 48rem (Tailwind `md`) and flips `<AppShell>`'s mobile drawer state — it's a no-op outside `<AppShell>`. The default `aria-label` is `"Open menu"`; override via `label`.

**Example**

```html
<button class="navbar-mobile-toggle" type="button" aria-label="Open menu"></button>
```

```tsx
<Navbar.MobileToggle />
```

See [mobile drawer](#mobile-drawer) below.

## Sidebar

Flat items, tree groups, and click-to-collapse, driven by native HTML.

### Items and groups

`<Sidebar.Item>` is a leaf link; `active` marks the current route, `icon` shows a leading glyph, `badge` adds a trailing count or pill. `<Sidebar.Group>` clusters items under an optional `<Sidebar.GroupLabel>` that hides when collapsed. `<Sidebar.Header>` is the slot for an app logo or product switcher above the nav.

**Example**

```tsx
<Sidebar style={{ height: "20rem" }}>
  <Sidebar.Nav>
    <Sidebar.Group>
      <Sidebar.GroupLabel>Workspace</Sidebar.GroupLabel>
      <Sidebar.Item href="#" active icon={IconHome}>
        Dashboard
      </Sidebar.Item>
      <Sidebar.Item href="#" icon={IconReceipt} badge="12">
        Orders
      </Sidebar.Item>
    </Sidebar.Group>
    <Sidebar.Group>
      <Sidebar.GroupLabel>Catalogue</Sidebar.GroupLabel>
      <Sidebar.Item href="#" icon={IconPackage}>
        Products
      </Sidebar.Item>
      <Sidebar.Item href="#" icon={IconChartBar}>
        Categories
      </Sidebar.Item>
    </Sidebar.Group>
  </Sidebar.Nav>
</Sidebar>
```

### Tree navigation

`<Sidebar.Collapsible>` is a `<details>` revealing `<Sidebar.SubItem>` rows. Pass `defaultOpen` to start expanded, or `open` + `onOpenChange` for controlled state. Override the trigger entirely with `trigger`.

**Example**

```html
<aside class="sidebar" style="height: 22rem">
  <nav class="sidebar-nav">
    <a class="sidebar-item" href="#">
      <span class="sidebar-icon"><i class="ti ti-receipt" aria-hidden="true"></i></span>
      <span class="sidebar-label">Ordrer</span>
    </a>
    <details class="sidebar-collapsible" open>
      <summary class="sidebar-collapsible-trigger">
        <span class="sidebar-icon"><i class="ti ti-shopping-cart" aria-hidden="true"></i></span>
        <span class="sidebar-label">Webshop</span>
      </summary>
      <div class="sidebar-collapsible-panel">
        <a class="sidebar-subitem" href="#" aria-current="page">
          <span class="sidebar-label">CMS</span>
        </a>
        <a class="sidebar-subitem" href="#">
          <span class="sidebar-label">Kampagner</span>
        </a>
        <a class="sidebar-subitem" href="#">
          <span class="sidebar-label">Søgeord</span>
        </a>
        <a class="sidebar-subitem" href="#">
          <span class="sidebar-label">Redirects</span>
        </a>
      </div>
    </details>
    <a class="sidebar-item" href="#">
      <span class="sidebar-icon"><i class="ti ti-package" aria-hidden="true"></i></span>
      <span class="sidebar-label">Lager</span>
    </a>
  </nav>
</aside>
```

```tsx
<Sidebar style={{ height: "22rem" }}>
  <Sidebar.Nav>
    <Sidebar.Item href="#" icon={IconReceipt}>
      Ordrer
    </Sidebar.Item>
    <Sidebar.Collapsible defaultOpen icon={IconShoppingCart} label="Webshop">
      <Sidebar.SubItem href="#" active>
        CMS
      </Sidebar.SubItem>
      <Sidebar.SubItem href="#">Kampagner</Sidebar.SubItem>
      <Sidebar.SubItem href="#">Søgeord</Sidebar.SubItem>
      <Sidebar.SubItem href="#">Redirects</Sidebar.SubItem>
    </Sidebar.Collapsible>
    <Sidebar.Item href="#" icon={IconPackage}>
      Lager
    </Sidebar.Item>
  </Sidebar.Nav>
</Sidebar>
```

### Click to collapse

`<Sidebar.CollapseToggle>` is a `<label>` wrapping a hidden checkbox; the rail responds to `.sidebar:has(.sidebar-toggle:checked)`. Pass each item's `icon` so it stays visible when collapsed, and wrap header text in `<Sidebar.Label>` so it hides with the item labels.

React's `<Sidebar>` exposes `collapsed` / `defaultCollapsed` / `onCollapsedChange` for controlled state.

**Example**

```html
<aside class="sidebar" style="height: 20rem">
  <div class="sidebar-header">
    <span class="brand-tile" aria-hidden="true">AO</span>
    <span class="sidebar-label">AO Retail</span>
  </div>
  <nav class="sidebar-nav">
    <a class="sidebar-item" href="#" aria-current="page">
      <span class="sidebar-icon">
        <i class="ti ti-home" aria-hidden="true"></i>
      </span>
      <span class="sidebar-label">Dashboard</span>
    </a>
    <a class="sidebar-item" href="#">
      <span class="sidebar-icon">
        <i class="ti ti-receipt" aria-hidden="true"></i>
      </span>
      <span class="sidebar-label">Orders</span>
    </a>
  </nav>
  <div class="sidebar-footer">
    <label class="sidebar-collapse-toggle">
      <input type="checkbox" class="sidebar-toggle" aria-label="Toggle sidebar" />
    </label>
  </div>
</aside>
```

```tsx
<Sidebar style={{ height: "20rem" }}>
  <Sidebar.Header>
    <BrandTile monogram="AO" />
    <Sidebar.Label>AO Retail</Sidebar.Label>
  </Sidebar.Header>
  <Sidebar.Nav>
    <Sidebar.Item href="#" active icon={IconHome}>
      Dashboard
    </Sidebar.Item>
    <Sidebar.Item href="#" icon={IconReceipt}>
      Orders
    </Sidebar.Item>
  </Sidebar.Nav>
  <Sidebar.Footer>
    <Sidebar.CollapseToggle />
  </Sidebar.Footer>
</Sidebar>
```

### Mobile drawer

Below `md` the desktop sidebar hides and `<Navbar.MobileToggle>` opens it as a drawer. Esc, backdrop click, and link clicks all dismiss; focus is trapped while open. The drawer hides `<Sidebar.CollapseToggle>`, and a `<Sidebar.Footer>` that holds only the toggle. Override the drawer's accessible label via `<Sidebar drawerLabel="...">`. In vanilla the drawer is a `<dialog>`; see [Vanilla](#vanilla).

`<AppShell>` accepts `mobileDrawerOpen` / `defaultMobileDrawerOpen` / `onMobileDrawerOpenChange` for controlled drawer state — useful when an external trigger (a route guard, a tutorial step) needs to open it.

**Example**

```tsx
<AppShell
  systemAccent="light-dark(var(--color-purple-600), var(--color-purple-400))"
  style={{ minHeight: "24rem" }}
>
  <Navbar>
    <Navbar.MobileToggle />
    <Navbar.Brand>
      <BrandTile monogram="A" />
      Acme
    </Navbar.Brand>
  </Navbar>
  <Sidebar>
    <Sidebar.Nav>
      <Sidebar.Item href="#" active icon={IconHome}>
        Dashboard
      </Sidebar.Item>
      <Sidebar.Item href="#" icon={IconReceipt}>
        Orders
      </Sidebar.Item>
    </Sidebar.Nav>
  </Sidebar>
  <AppShell.Main style={{ padding: "1rem" }}>
    Resize below 768px and tap the hamburger.
  </AppShell.Main>
</AppShell>
```

## Footer

`<Footer.Links>` on the left, `<Footer.Meta>` on the right; both wrap on narrow viewports.

**Example**

```html
<footer class="footer">
  <div class="footer-links">
    <a class="footer-link" href="#">Docs</a>
    <a class="footer-link" href="#">Status</a>
    <a class="footer-link" href="#">Support</a>
  </div>
  <div class="footer-meta">v1.4.0 · © Acme</div>
</footer>
```

```tsx
<Footer>
  <Footer.Links>
    <Footer.Link href="#">Docs</Footer.Link>
    <Footer.Link href="#">Status</Footer.Link>
    <Footer.Link href="#">Support</Footer.Link>
  </Footer.Links>
  <Footer.Meta>v1.4.0 · © Acme</Footer.Meta>
</Footer>
```

## Examples

### Classic admin

**Example**

```tsx
<AppShell
  systemAccent="light-dark(var(--color-green-600), var(--color-green-400))"
  style={{ minHeight: "32rem" }}
>
  <Navbar>
    <Navbar.MobileToggle />
    <Navbar.Brand>
      <BrandTile monogram="AO" />
      AO Retail
    </Navbar.Brand>
    <Navbar.Actions>
      <Select
        defaultValue="billigvvs.dk"
        items={{
          "billigvvs.dk": "BilligVVS.dk",
          "lavprisvvs.dk": "LavprisVVS.dk",
          "elproffs.se": "ELproffs.se",
          "vvskupp.no": "VVSkupp.no",
        }}
      >
        <Select.Trigger size="sm" aria-label="Shop">
          <Select.Value />
          <Select.Icon />
        </Select.Trigger>
        <Select.Popup>
          <Select.Item value="billigvvs.dk">
            <Select.ItemText>BilligVVS.dk</Select.ItemText>
          </Select.Item>
          <Select.Item value="lavprisvvs.dk">
            <Select.ItemText>LavprisVVS.dk</Select.ItemText>
          </Select.Item>
          <Select.Item value="elproffs.se">
            <Select.ItemText>ELproffs.se</Select.ItemText>
          </Select.Item>
          <Select.Item value="vvskupp.no">
            <Select.ItemText>VVSkupp.no</Select.ItemText>
          </Select.Item>
        </Select.Popup>
      </Select>
      <Navbar.Dropdown label="Nickolaj" align="end">
        <Menu.Item>Profile</Menu.Item>
        <Menu.Separator />
        <Menu.Item>Sign out</Menu.Item>
      </Navbar.Dropdown>
    </Navbar.Actions>
  </Navbar>
  <Sidebar>
    <Sidebar.Nav>
      <Sidebar.Item href="#" icon={IconSettings}>
        Indstillinger
      </Sidebar.Item>
      <Sidebar.Item href="#" icon={IconReceipt}>
        Ordrer
      </Sidebar.Item>
      <Sidebar.Item href="#" icon={IconHeadset}>
        Kundeservice
      </Sidebar.Item>
      <Sidebar.Item href="#" icon={IconPackage}>
        Produkter
      </Sidebar.Item>
      <Sidebar.Collapsible defaultOpen icon={IconShoppingCart} label="Webshop">
        <Sidebar.SubItem href="#" active>
          CMS
        </Sidebar.SubItem>
        <Sidebar.SubItem href="#">Kampagner</Sidebar.SubItem>
        <Sidebar.SubItem href="#">Søgeord</Sidebar.SubItem>
        <Sidebar.SubItem href="#">Redirects</Sidebar.SubItem>
      </Sidebar.Collapsible>
      <Sidebar.Item href="#" icon={IconTruck}>
        Lager
      </Sidebar.Item>
      <Sidebar.Item href="#" icon={IconChartBar}>
        Statistik
      </Sidebar.Item>
    </Sidebar.Nav>
    <Sidebar.Footer>
      <Sidebar.CollapseToggle />
    </Sidebar.Footer>
  </Sidebar>
  <AppShell.Main style={{ padding: "1rem" }}>Page content</AppShell.Main>
  <Footer>
    <Footer.Links>
      <Footer.Link href="#">Docs</Footer.Link>
      <Footer.Link href="#">Status</Footer.Link>
    </Footer.Links>
    <Footer.Meta>© AO Retail</Footer.Meta>
  </Footer>
</AppShell>
```

### Top-nav heavy

No sidebar — primary navigation in the navbar via `<Navbar.Dropdown>`. For tools with few top-level destinations and per-destination tabs in `main`.

**Example**

```tsx
<AppShell
  systemAccent="light-dark(var(--color-orange-600), var(--color-orange-400))"
  style={{ minHeight: "28rem" }}
>
  <Navbar>
    <Navbar.Brand>
      <BrandTile icon={IconChartBar} />
      Insights
    </Navbar.Brand>
    <Navbar.Items>
      <Navbar.Item href="#" active>
        Dashboard
      </Navbar.Item>
      <Navbar.Dropdown label="Reports">
        <Menu.Item>Sales</Menu.Item>
        <Menu.Item>Returns</Menu.Item>
        <Menu.Item>Inventory</Menu.Item>
        <Menu.Separator />
        <Menu.Item>Custom…</Menu.Item>
      </Navbar.Dropdown>
      <Navbar.Dropdown label="Customers">
        <Menu.Item>Segments</Menu.Item>
        <Menu.Item>Lifetime value</Menu.Item>
      </Navbar.Dropdown>
      <Navbar.Item href="#">Settings</Navbar.Item>
    </Navbar.Items>
    <Navbar.Actions>
      <Navbar.Dropdown label="Nickolaj" align="end">
        <Menu.Item>Profile</Menu.Item>
        <Menu.Separator />
        <Menu.Item>Sign out</Menu.Item>
      </Navbar.Dropdown>
    </Navbar.Actions>
  </Navbar>
  <AppShell.Main style={{ padding: "1rem" }}>Page content</AppShell.Main>
  <Footer>
    <Footer.Links>
      <Footer.Link href="#">Docs</Footer.Link>
      <Footer.Link href="#">Changelog</Footer.Link>
      <Footer.Link href="#">Support</Footer.Link>
    </Footer.Links>
    <Footer.Meta>v2.1.0</Footer.Meta>
  </Footer>
</AppShell>
```

### Dashboard

[`<Container>`](../components/container.md) goes inside `<AppShell.Main>`, which has no padding of its own, and stacks the page sections. For the search-and-filter row that usually sits above the table, see [Tables › Filter toolbar](../components/tables.md#filter-toolbar).

**Example**

```tsx
<AppShell
  systemAccent="light-dark(var(--color-blue-600), var(--color-blue-400))"
  style={{ minHeight: "30rem" }}
>
  <Navbar>
    <Navbar.Brand>
      <BrandTile monogram="A" />
      Acme Admin
    </Navbar.Brand>
  </Navbar>
  <Sidebar>
    <Sidebar.Nav>
      <Sidebar.Item href="#" active icon={IconHome}>
        Dashboard
      </Sidebar.Item>
      <Sidebar.Item href="#" icon={IconReceipt}>
        Orders
      </Sidebar.Item>
    </Sidebar.Nav>
  </Sidebar>
  <AppShell.Main>
    <Container>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          icon={IconShoppingCart}
          label="Orders today"
          value="128"
          detail="14 awaiting fulfilment"
        />
        <StatCard icon={IconCash} label="Revenue" value="$8.4k" detail="+8% vs target" />
        <StatCard label="Failed jobs" value="3" detail="last 24h" />
      </div>
      <Table striped>
        <Table.Head>
          <Table.Row>
            <Table.HeaderCell>Order</Table.HeaderCell>
            <Table.HeaderCell>Customer</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          <Table.Row>
            <Table.Cell>#1001</Table.Cell>
            <Table.Cell>Ada Lovelace</Table.Cell>
            <Table.Cell>Shipped</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>#1002</Table.Cell>
            <Table.Cell>Grace Hopper</Table.Cell>
            <Table.Cell>Processing</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>#1003</Table.Cell>
            <Table.Cell>Alan Turing</Table.Cell>
            <Table.Cell>Shipped</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </Container>
  </AppShell.Main>
  <Footer>
    <Footer.Meta>© Acme</Footer.Meta>
  </Footer>
</AppShell>
```

## Customization

Two CSS variables set the rail width. Set them on `:root`: a value on `.app-shell` sizes the rail, but the React mobile drawer portals outside the shell and keeps the default.

| Variable                          | Default | What it controls                       |
| --------------------------------- | ------- | -------------------------------------- |
| `--app-shell-sidebar-w`           | `240px` | Expanded sidebar / drawer width.       |
| `--app-shell-sidebar-w-collapsed` | `56px`  | Width of the icon rail when collapsed. |

```css
:root {
  --app-shell-sidebar-w: 280px;
}
```

## Branding multiple systems

The navbar renders a 2px bottom stripe driven by `--color-system-accent`; the footer mirrors it with a matching top stripe. Setting that variable [app-wide](../basics/theming.md#system-accent) retints both. To tag several systems in one app, set it per shell instead: `<AppShell systemAccent>` covers the navbar and footer, `<Navbar systemAccent>` the navbar alone, and in vanilla an inline style on either element does the same. Pass a `light-dark()` pair (the `-600` tone for light, `-400` for dark) so the stripe and soft tiles stay legible on the dark navbar. Then drop a [`<BrandTile>`](../components/brand-tile.md) into `<Navbar.Brand>`:

**Example**

```html
<header
  class="navbar"
  style="--color-system-accent: light-dark(var(--color-purple-600), var(--color-purple-400))"
>
  <div class="navbar-brand">
    <span class="brand-tile" aria-hidden="true">OR</span>
    Orders
  </div>
</header>
```

```tsx
<Navbar systemAccent="light-dark(var(--color-purple-600), var(--color-purple-400))">
  <Navbar.Brand>
    <BrandTile monogram="OR" />
    Orders
  </Navbar.Brand>
</Navbar>
```

For the derived tokens (`-hover`, `-muted`, `-content`) and the bright-accent contrast caveat, see [Theming › System accent](../basics/theming.md#system-accent).

## Reference

### React

Four independent compounds. `<AppShell>` supplies only the grid and the mobile-drawer wiring — `<Navbar>`, `<Sidebar>` and `<Footer>` each work standalone.

| Part                     | Renders          | Class                                       |
| ------------------------ | ---------------- | ------------------------------------------- |
| `AppShell`               | `<div>`          | `app-shell`                                 |
| `AppShell.Main`          | `<main>`         | `app-shell-main`                            |
| `Navbar`                 | `<header>`       | `navbar`                                    |
| `Navbar.Brand`           | `<div>`          | `navbar-brand`                              |
| `Navbar.Items`           | `<nav>`          | `navbar-items`                              |
| `Navbar.Item`            | `<a>`            | `navbar-item`                               |
| `Navbar.Dropdown`        | `<div>` (`Menu`) | `menu`, with `navbar-item` on the trigger   |
| `Navbar.Actions`         | `<div>`          | `navbar-actions`                            |
| `Navbar.MobileToggle`    | `<button>`       | `navbar-mobile-toggle`                      |
| `Sidebar`                | `<aside>`        | `sidebar`                                   |
| `Sidebar.Header`         | `<div>`          | `sidebar-header`                            |
| `Sidebar.Nav`            | `<nav>`          | `sidebar-nav`                               |
| `Sidebar.Group`          | `<div>`          | `sidebar-group`                             |
| `Sidebar.GroupLabel`     | `<div>`          | `sidebar-group-label`                       |
| `Sidebar.Item`           | `<a>`            | `sidebar-item`                              |
| `Sidebar.Icon`           | `<span>`         | `sidebar-icon`                              |
| `Sidebar.Label`          | `<span>`         | `sidebar-label`                             |
| `Sidebar.Badge`          | `<span>`         | `sidebar-badge`                             |
| `Sidebar.Collapsible`    | `<details>`      | `sidebar-collapsible`                       |
| `Sidebar.SubItem`        | `<a>`            | `sidebar-subitem`                           |
| `Sidebar.Footer`         | `<div>`          | `sidebar-footer`                            |
| `Sidebar.CollapseToggle` | `<label>`        | `sidebar-collapse-toggle`, `sidebar-toggle` |
| `Footer`                 | `<footer>`       | `footer`                                    |
| `Footer.Links`           | `<div>`          | `footer-links`                              |
| `Footer.Link`            | `<a>`            | `footer-link`                               |
| `Footer.Meta`            | `<div>`          | `footer-meta`                               |

| Part                     | Prop                        | Type                           | Default                  |
| ------------------------ | --------------------------- | ------------------------------ | ------------------------ |
| `AppShell`               | `hasSidebar`                | `boolean`                      | `false`                  |
| `AppShell`               | `systemAccent`              | `string` (CSS color)           | inherited                |
| `AppShell`               | `mobileDrawerOpen`          | `boolean`                      | uncontrolled             |
| `AppShell`               | `defaultMobileDrawerOpen`   | `boolean`                      | `false`                  |
| `AppShell`               | `onMobileDrawerOpenChange`  | `(open: boolean) => void`      | —                        |
| `Navbar`                 | `systemAccent`              | `string` (CSS color)           | inherited                |
| `Navbar.Item`            | `active`                    | `boolean`                      | `false`                  |
| `Navbar.Item`            | `icon`                      | component or element           | —                        |
| `Navbar.Item`            | `render`                    | `ReactElement`                 | —                        |
| `Navbar.Dropdown`        | `label`                     | `ReactNode`                    | required                 |
| `Navbar.Dropdown`        | `active`                    | `boolean`                      | an item's `aria-current` |
| `Navbar.Dropdown`        | `icon`                      | component or element           | —                        |
| `Navbar.Dropdown`        | `align`                     | `"start" \| "center" \| "end"` | `"start"`                |
| `Navbar.MobileToggle`    | `label`                     | `string`                       | `"Open menu"`            |
| `Sidebar`                | `collapsed`                 | `boolean`                      | uncontrolled             |
| `Sidebar`                | `defaultCollapsed`          | `boolean`                      | `false`                  |
| `Sidebar`                | `onCollapsedChange`         | `(collapsed: boolean) => void` | —                        |
| `Sidebar`                | `drawerLabel`               | `string`                       | `"Navigation"`           |
| `Sidebar.Item`           | `active`                    | `boolean`                      | `false`                  |
| `Sidebar.Item`           | `icon`                      | component or element           | —                        |
| `Sidebar.Item`           | `badge`                     | `ReactNode`                    | —                        |
| `Sidebar.Item`           | `render`                    | `ReactElement`                 | —                        |
| `Sidebar.Collapsible`    | `icon`                      | component or element           | —                        |
| `Sidebar.Collapsible`    | `label`                     | `ReactNode`                    | —                        |
| `Sidebar.Collapsible`    | `trigger`                   | `ReactNode`                    | icon + label             |
| `Sidebar.Collapsible`    | `open` / `defaultOpen`      | `boolean`                      | uncontrolled             |
| `Sidebar.Collapsible`    | `onOpenChange`              | `(open: boolean) => void`      | —                        |
| `Sidebar.SubItem`        | `active` / `icon` / `badge` | as `Sidebar.Item`              | —                        |
| `Sidebar.SubItem`        | `render`                    | `ReactElement`                 | —                        |
| `Sidebar.CollapseToggle` | `label`                     | `string`                       | `"Toggle sidebar"`       |

`active` writes `aria-current="page"`, except on `Navbar.Dropdown`, where it sets `data-active` on the trigger. `render` on `Navbar.Item`, `Sidebar.Item` and `Sidebar.SubItem` renders the item onto a router link and keeps `active` (see [Conventions › `render`](../basics/conventions.md#render)). Each part also takes the native attributes of its element, and `Navbar.Dropdown`, `Sidebar`, `Sidebar.Item`, `Sidebar.SubItem`, `Sidebar.Collapsible` and `Sidebar.CollapseToggle` take [`classNames`](../basics/conventions.md#classnames).

`<Navbar.MobileToggle>` and `<Sidebar>`'s drawer both read `<AppShell>`'s context, so the toggle is inert outside a shell. When the drawer opens, `<Sidebar>` **moves** its children into the drawer rather than duplicating them — state held in a sidebar child does not survive crossing that breakpoint.

### Vanilla

| Class                         | Effect                                                                                                                                                                                               |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `app-shell`                   | `min-height: 100vh` grid, one `minmax(0, 1fr)` column, rows `auto 1fr auto` as areas `header` / `main` / `footer`                                                                                    |
| `app-shell-with-sidebar`      | Adds a leading column sized to the sidebar's own width; below `48rem` drops back to one column. A direct-child `sidebar` applies the same layout without the class                                   |
| `app-shell-main`              | Claims the `main` area with `min-width: 0`, so a wide table scrolls instead of stretching the grid                                                                                                   |
| `navbar`                      | `3rem` flex row, `1rem` side padding, muted surface, 2px bottom stripe in `--color-system-accent`                                                                                                    |
| `navbar-brand`                | Semibold `text-sm` row that never shrinks                                                                                                                                                            |
| `navbar-items`                | Flex row, `0.125rem` gap                                                                                                                                                                             |
| `navbar-item`                 | `text-sm` row, `0.375rem` radius, fills on hover; primary-on-muted with `aria-current="page"`, `[data-active]` or a `menu-item[aria-current="page"]` (filled too) in its menu in `navbar-items`      |
| `navbar-actions`              | Flex row pushed right with `margin-left: auto`; a `menu` inside opens aligned to its trigger's right edge                                                                                            |
| `navbar-mobile-toggle`        | `2.25rem` square hamburger drawn from one `::before` bar plus two box-shadow strokes; hidden at ≥ `48rem`                                                                                            |
| `sidebar`                     | Column flex rail at `--app-shell-sidebar-w` (`240px`), muted surface, right border, 150ms width transition; a direct `drawer` child fills it at rail width and hides `sidebar-collapse-toggle`       |
| `sidebar-toggle`              | 1px visually-hidden checkbox — `.sidebar:has(.sidebar-toggle:checked)` is what drives the collapsed state                                                                                            |
| `sidebar-header`              | `3rem` row above the nav, `1rem` side padding, bottom border, for a logo or product switcher; centred in the collapsed rail                                                                          |
| `sidebar-nav`                 | Scrolling column that fills the remaining height, `0.125rem` gap                                                                                                                                     |
| `sidebar-group`               | Column of items; a following group gets `0.5rem` of top margin                                                                                                                                       |
| `sidebar-group-label`         | `text-xs` uppercase muted heading; hidden when collapsed                                                                                                                                             |
| `sidebar-item`                | `text-sm` row, `1.75rem` min height, `0.5rem` gap, inset focus ring; active state adds a primary-muted fill and medium weight                                                                        |
| `sidebar-icon`                | `1rem` muted glyph box — the one part that stays visible in the collapsed rail; turns primary when active                                                                                            |
| `sidebar-label`               | Truncating text on a `1.25rem` line that fills the row; visually hidden when collapsed, so it still names the link                                                                                   |
| `sidebar-badge`               | `1.25rem` pill pushed to the row's trailing edge; hidden when collapsed                                                                                                                              |
| `sidebar-collapsible`         | `<details>` wrapper; height animates via `::details-content` and `interpolate-size: allow-keywords`                                                                                                  |
| `sidebar-collapsible-trigger` | `<summary>` styled as an item, native marker removed; chevron points right when closed, down when open; takes the active fill while it hides the current sub-item (closed, or in the collapsed rail) |
| `sidebar-collapsible-panel`   | Sub-item column indented `1.5rem`, so sub-item text lines up with the trigger's label; hidden when collapsed                                                                                         |
| `sidebar-subitem`             | Like `sidebar-item` at a `1.5rem` min height; wrap the text in `sidebar-label` so it truncates, optional `sidebar-icon`                                                                              |
| `sidebar-footer`              | Bottom column with a top border                                                                                                                                                                      |
| `sidebar-collapse-toggle`     | `1.75rem` square `<label>` whose chevron flips direction when the inner `sidebar-toggle` is checked; centred in the collapsed rail                                                                   |
| `sidebar-drawer`              | Fixed leading panel at `min(--app-shell-sidebar-w, 80vw)`, sliding in from fully off-screen; hides `sidebar-collapse-toggle` and a `sidebar-footer` that holds only the toggle                       |
| `sidebar-drawer-backdrop`     | Fixed scrim over the page that fades in with the drawer                                                                                                                                              |
| `footer`                      | Wrapping `space-between` row, `text-xs` muted, 2px top stripe in `--color-system-accent`                                                                                                             |
| `footer-links`                | Wrapping row, `0.75rem` gap                                                                                                                                                                          |
| `footer-link`                 | Muted, no underline; brightens and underlines on hover                                                                                                                                               |
| `footer-meta`                 | Muted text block                                                                                                                                                                                     |

The grid areas are assigned by child class — `.app-shell > .navbar`, `> .sidebar`, `> main`, `> .footer` — so all four must be **direct** children. Wrapping one in a `<div>` drops it out of its area. `app-shell-main` exists for markup that can't use a bare `<main>`; `.app-shell > main` already claims the area. Rail widths come from two custom properties, see [Customization](#customization).

The collapsed rail needs no JavaScript: check the hidden `sidebar-toggle` and `:has()` does the rest. Write `aria-current="page"` and the toggle's `aria-label` yourself.

Below `48rem` a direct-child `sidebar` is hidden. `sidebar-drawer` and `sidebar-drawer-backdrop` are the React drawer, styled for Base UI's `[data-starting-style]` / `[data-ending-style]` transition hooks. In vanilla, put a copy of the sidebar in a [`<dialog class="dialog drawer drawer-start">`](../components/drawer.md) and open it from `navbar-mobile-toggle` with invoker commands; a `sidebar` directly inside a `drawer` fills it at the rail width, capped at `80vw`:

```html
<button
  class="navbar-mobile-toggle"
  type="button"
  aria-label="Open menu"
  commandfor="nav-drawer"
  command="show-modal"
></button>

<dialog id="nav-drawer" class="dialog drawer drawer-start" closedby="any" aria-label="Navigation">
  <aside class="sidebar">
    <nav class="sidebar-nav">
      <a class="sidebar-item" href="#" aria-current="page">
        <i class="sidebar-icon ti ti-home" aria-hidden="true"></i>
        <span class="sidebar-label">Dashboard</span>
      </a>
      <a class="sidebar-item" href="#">
        <i class="sidebar-icon ti ti-receipt" aria-hidden="true"></i>
        <span class="sidebar-label">Orders</span>
      </a>
    </nav>
  </aside>
</dialog>
```
