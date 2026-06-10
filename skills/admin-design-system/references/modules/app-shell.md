# App shell

> Page chrome — navbar, optional sidebar, optional footer — around a main content area.

IconHome,
  IconReceipt,
  IconPackage,
  IconChartBar,
  IconSettings,
  IconTruck,
  IconShoppingCart,
  IconHeadset,
} from "@tabler/icons-react";

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
<div class="app-shell" style="min-height: 16rem; --color-system-accent: var(--color-purple-600)">
  <header class="navbar">
    <div class="navbar-brand">
      <span class="brand-tile" aria-hidden>A</span>
      Acme
    </div>
  </header>
  <main class="app-shell-main" style="padding: 1rem">Page content</main>
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
  <AppShell.Main style={{ padding: "1rem" }}>Page content</AppShell.Main>
</AppShell>
```

Add `hasSidebar` for a two-column grid; a `<Footer>` drops into the bottom row automatically.

**Example**

```tsx
<AppShell hasSidebar systemAccent="var(--color-purple-600)" style={{ minHeight: "20rem" }}>
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
<header class="navbar" style="--color-system-accent: var(--color-purple-600)">
  <div class="navbar-brand">
    <span class="brand-tile" aria-hidden>A</span>
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
<Navbar style={{ "--color-system-accent": "var(--color-purple-600)" }}>
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
    <button className="btn btn-ghost btn-sm" type="button">
      Sign out
    </button>
  </Navbar.Actions>
</Navbar>
```

### Dropdowns

`<Navbar.Dropdown>` is a [`<Menu>`](../components/menus.md) styled to fit the navbar.

**Example**

```html
<header class="navbar" style="--color-system-accent: var(--color-purple-600)">
  <div class="navbar-brand">
    <span class="brand-tile" aria-hidden>A</span>
    Acme
  </div>
  <nav class="navbar-items">
    <a class="navbar-item" href="#">Dashboard</a>
    <details class="menu">
      <summary class="menu-trigger navbar-item">Products</summary>
      <div class="menu-popup" role="menu">
        <button class="menu-item" type="button">Catalogue</button>
        <button class="menu-item" type="button">Categories</button>
        <hr class="menu-separator" />
        <button class="menu-item" type="button">Imports</button>
      </div>
    </details>
  </nav>
</header>
```

```tsx
<Navbar style={{ "--color-system-accent": "var(--color-purple-600)" }}>
  <Navbar.Brand>
    <BrandTile monogram="A" />
    Acme
  </Navbar.Brand>
  <Navbar.Items>
    <Navbar.Item href="#">Dashboard</Navbar.Item>
    <Navbar.Dropdown label="Products">
      <Menu.Item>Catalogue</Menu.Item>
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
<header class="navbar" style="--color-system-accent: var(--color-green-600)">
  <div class="navbar-brand">
    <span class="brand-tile" aria-hidden>AO</span>
    AO Retail
  </div>
  <div class="navbar-actions">
    <select class="select select-sm" style="width: auto" aria-label="Shop">
      <option value="billigvvs.dk">BilligVVS.dk</option>
      <option value="lavprisvvs.dk">LavprisVVS.dk</option>
      <option value="elproffs.se">ELproffs.se</option>
    </select>
    <details class="menu">
      <summary class="menu-trigger navbar-item">Nickolaj</summary>
      <div class="menu-popup" role="menu">
        <button class="menu-item" type="button">Profile</button>
        <hr class="menu-separator" />
        <button class="menu-item" type="button">Sign out</button>
      </div>
    </details>
  </div>
</header>
```

```tsx
<Navbar style={{ "--color-system-accent": "var(--color-green-600)" }}>
  <Navbar.Brand>
    <BrandTile monogram="AO" />
    AO Retail
  </Navbar.Brand>
  <Navbar.Actions>
    <Select defaultValue="billigvvs.dk">
      <Select.Trigger triggerSize="sm" aria-label="Shop">
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
    <Navbar.Dropdown label="Nickolaj">
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
        <a class="sidebar-subitem" href="#" aria-current="page">CMS</a>
        <a class="sidebar-subitem" href="#">Kampagner</a>
        <a class="sidebar-subitem" href="#">Søgeord</a>
        <a class="sidebar-subitem" href="#">Redirects</a>
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

`<Sidebar.CollapseToggle>` is a `<label>` wrapping a hidden checkbox; the rail responds to `.sidebar:has(.sidebar-toggle:checked)`. Pass each item's `icon` so it stays visible when collapsed.

React's `<Sidebar>` exposes `collapsed` / `defaultCollapsed` / `onCollapsedChange` for controlled state.

**Example**

```html
<aside class="sidebar" style="height: 20rem">
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
      <input type="checkbox" class="sidebar-toggle" />
      <span class="sr-only">Toggle sidebar</span>
    </label>
  </div>
</aside>
```

```tsx
<Sidebar style={{ height: "20rem" }}>
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

Below `md` the desktop sidebar hides and `<Navbar.MobileToggle>` opens it as a drawer. Esc, backdrop click, and link clicks all dismiss; focus is trapped while open. Override the drawer's accessible label via `<Sidebar drawerLabel="...">`.

`<AppShell>` accepts `mobileDrawerOpen` / `defaultMobileDrawerOpen` / `onMobileDrawerOpenChange` for controlled drawer state — useful when an external trigger (a route guard, a tutorial step) needs to open it.

**Example**

```tsx
<AppShell hasSidebar systemAccent="var(--color-purple-600)" style={{ minHeight: "24rem" }}>
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
<AppShell hasSidebar systemAccent="var(--color-green-600)" style={{ minHeight: "32rem" }}>
  <Navbar>
    <Navbar.MobileToggle />
    <Navbar.Brand>
      <BrandTile monogram="AO" />
      AO Retail
    </Navbar.Brand>
    <Navbar.Actions>
      <Select defaultValue="billigvvs.dk">
        <Select.Trigger triggerSize="sm" aria-label="Shop">
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
      <Navbar.Dropdown label="Nickolaj">
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
<AppShell systemAccent="var(--color-orange-600)" style={{ minHeight: "28rem" }}>
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
      <Navbar.Dropdown label="Nickolaj">
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

## Customization

Two CSS variables on `.app-shell` set the rail width:

| Variable                          | Default | What it controls                       |
| --------------------------------- | ------- | -------------------------------------- |
| `--app-shell-sidebar-w`           | `240px` | Expanded sidebar / drawer width.       |
| `--app-shell-sidebar-w-collapsed` | `56px`  | Width of the icon rail when collapsed. |

```css
.app-shell {
  --app-shell-sidebar-w: 280px;
}
```

## Branding multiple systems

The navbar always renders a 2px bottom stripe driven by `--color-system-accent`; the footer mirrors it with a matching top stripe. Drop a [`<BrandTile>`](../components/brand-tile.md) into `<Navbar.Brand>` and override the variable to tag a system — either app-wide at `:root`, or per-shell via `<AppShell systemAccent>`:

```css
:root {
  --color-system-accent: var(--color-purple-600);
}
```

The default is a neutral gray.

**Example**

```html
<header class="navbar" style="--color-system-accent: var(--color-purple-600)">
  <div class="navbar-brand">
    <span class="brand-tile" aria-hidden>OR</span>
    Orders
  </div>
</header>
```

```tsx
<Navbar style={{ "--color-system-accent": "var(--color-purple-600)" }}>
  <Navbar.Brand>
    <BrandTile monogram="OR" />
    Orders
  </Navbar.Brand>
</Navbar>
```

For derived tokens (`-hover`, `-muted`, `-content`) and the yellow-accent contrast caveat, see [Customize › System accent](../basics/customize.md#system-accent).
