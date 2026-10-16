# Command palette

> Cmd+K search, navigation and commands.

## Contents

- [Without React](#without-react)
- [Examples](#examples)
  - [Page commands (React only)](#page-commands-react-only)
  - [Trigger](#trigger)
  - [Async sources](#async-sources)
  - [Anatomy](#anatomy)
- [Behavior](#behavior)
- [Registry](#registry)
- [Reference](#reference)
  - [React](#react)
  - [Standalone](#standalone)
  - [Command](#command)
  - [Source](#source)
  - [Vanilla](#vanilla)

The palette ships in its own package, `@aortl/admin-palette`, built on `@aortl/admin-react`, with a standalone build for pages without React. Its classes are in `@aortl/admin-css`.

```fish
npm install @aortl/admin-palette @aortl/admin-react react react-dom
```

Render one `<CommandPalette>` per document inside `<AdminRoot>`, from a client component: commands carry functions. Triggers, `useCommands` and `useCommandPalette` reach it from anywhere in the page.

## Without React

The standalone build takes the same options as `<CommandPalette>`. Its entry is about 1 kB: it binds the hotkey and `data-admin-palette` triggers, and loads the palette, React included (about 120 kB gzipped), on first open.

```html
<button type="button" class="palette-trigger" data-admin-palette aria-haspopup="dialog">
  <i class="ti ti-search" aria-hidden="true"></i>
  <span class="palette-trigger-label">Search</span>
  <span class="kbd-group"><kbd class="kbd">Ctrl</kbd><kbd class="kbd">K</kbd></span>
</button>

<script type="module">
  import { init } from "https://unpkg.com/@aortl/admin-palette/dist/standalone/palette.js";

  init({
    stylesheets: ["https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3/dist/tabler-icons.min.css"],
    commands: [
      { id: "orders", title: "Orders", icon: "package", href: "/orders/" },
      {
        id: "logout",
        title: "Sign out",
        icon: "logout",
        perform: () => document.forms.logout.submit(),
      },
    ],
  });
</script>
```

The palette renders in a shadow root with its own copy of the scoped CSS, so the page's CSS doesn't reach it. `stylesheets` load into that root; the Tabler webfont CSS is needed there for string icons. Semantic color tokens the page sets on `<html>`, such as `--color-primary` and `--color-system-accent`, carry into it; palette tones such as `--color-blue-600` don't, so a Tailwind page's own palette stays out. Dark mode follows a `color-scheme` the page forces on `<html>`, as `data-theme` does. Pin a version in production; see [Stability](../getting-started/stability.md).

`window.AdminPalette` holds the same functions for templates that can't import a module: `AdminPalette.open({ page: "theme" })`.

## Examples

### Page commands (React only)

This site's search is a `CommandPalette`. The example adds commands to it while this page is open: open it, then type `status`, or `find` and a number. Before anything is typed they list under "This page", after Recent and Suggested.

**Example**

```tsx
function OrderCommands() {
  useCommands([
    { id: "demo-refund", title: "Refund order 1042", icon: IconReceiptRefund, perform: () => {} },
    {
      id: "demo-export",
      title: "Export orders",
      description: "CSV of the current filter",
      icon: IconFileExport,
      shortcut: "mod+shift+e",
      perform: () => {},
    },
    {
      id: "demo-status",
      title: "Set order status",
      icon: IconTruck,
      children: [
        { id: "demo-status-packed", title: "Packed", perform: () => {} },
        { id: "demo-status-shipped", title: "Shipped", perform: () => {} },
        { id: "demo-status-delivered", title: "Delivered", perform: () => {} },
      ],
    },
    {
      id: "demo-find",
      title: "Find order",
      icon: IconPackage,
      children: {
        id: "demo-orders",
        search: async (query: string) =>
          /^\d+$/.test(query)
            ? [
                {
                  id: `demo-order-${query}`,
                  title: `Order ${query}`,
                  description: "Placed 14 Oct · 3 items · Shipped",
                  href: `#order-${query}`,
                },
              ]
            : [],
      },
    },
  ]);
  return <CommandPalette.Trigger />;
}

<OrderCommands />;
```

The palette itself goes once in the app shell:

```tsx
<AdminRoot>
  <CommandPalette
    commands={[
      { id: "orders", title: "Orders", group: "Navigate", icon: IconPackage, href: "/orders" },
    ]}
    sources={[orders]}
    suggested={["orders"]}
    onNavigate={(href) => router.push(href)}
  />
  {children}
</AdminRoot>
```

### Trigger

Any element with `data-admin-palette` opens the palette; a value opens straight into that command's page. `CommandPalette.Trigger` renders the field-shaped button with no handler, so a Server Component can render it.

**Example**

```html
<button type="button" class="palette-trigger" data-admin-palette aria-haspopup="dialog">
  <i class="ti ti-search" aria-hidden="true"></i>
  <span class="palette-trigger-label">Search</span>
  <span class="kbd-group"><kbd class="kbd">Ctrl</kbd><kbd class="kbd">K</kbd></span>
</button>
```

```tsx
<CommandPalette.Trigger />
```

### Async sources

A `Source` searches as the user types. Its group is placed by `priority` against the matched commands' tiers; a result's own `group` splits the results into groups, such as one per page. A source at the root needs a query of `minQuery` characters (default 1) that matches `pattern`, so a lookup only runs on input that could be an id. A source as a command's `children` searches inside that page, on entry too.

```tsx
const orders: Source = {
  id: "orders",
  group: "Orders",
  pattern: /^\d{6,}$/,
  priority: 10,
  async search(query, { signal }) {
    const res = await fetch(`/api/orders?number=${query}`, { signal });
    const rows: { number: string; customer: string }[] = await res.json();
    return rows.map((row) => ({
      id: `order-${row.number}`,
      title: `Order ${row.number}`,
      description: row.customer,
      href: `/orders/${row.number}`,
    }));
  },
};
```

### Anatomy

The markup `CommandPalette` renders inside its `<dialog class="dialog palette">`, shown inline.

**Example**

```html
<div class="palette" style="width: 100%">
  <div class="palette-header">
    <i class="ti ti-search" aria-hidden="true"></i>
    <button type="button" class="palette-crumb">Change theme</button>
    <input
      class="palette-input"
      type="text"
      role="combobox"
      aria-expanded="true"
      aria-label="Command palette"
      placeholder="Search or jump to…"
    />
  </div>
  <div class="palette-list" role="listbox" aria-label="Command palette">
    <div class="palette-group" role="group" aria-labelledby="anatomy-mode">
      <div class="palette-group-label" id="anatomy-mode">Mode</div>
      <div class="item palette-item" role="option" aria-selected="true" data-highlighted>
        <span class="item-media"><i class="ti ti-sun" aria-hidden="true"></i></span>
        <span class="item-content"><span class="item-title">Light</span></span>
      </div>
      <div class="item palette-item" role="option" aria-selected="false">
        <span class="item-media"><i class="ti ti-moon" aria-hidden="true"></i></span>
        <span class="item-content">
          <span class="item-title"><span class="palette-item-path">Theme › </span>Dark</span>
          <span class="item-description">Follows the OS until changed</span>
        </span>
        <span class="item-actions"
          ><span class="kbd-group"><kbd class="kbd">Ctrl</kbd><kbd class="kbd">D</kbd></span></span
        >
      </div>
    </div>
    <output class="palette-status"></output>
  </div>
  <div class="palette-footer">
    <span><kbd class="kbd">↑</kbd><kbd class="kbd">↓</kbd> Move</span>
    <span><kbd class="kbd">↵</kbd> Open</span>
    <span><kbd class="kbd">Esc</kbd> Back</span>
  </div>
</div>
```

## Behavior

| Key                  | Action                                                                  |
| -------------------- | ----------------------------------------------------------------------- |
| `↑` `↓`              | Move the highlight                                                      |
| `Enter`              | Run the highlighted command, or open its page                           |
| `Ctrl/Cmd` + `Enter` | Open a link in a new tab; the palette stays open                        |
| `Esc`                | Leave the nested page, or close at the root                             |
| `Backspace`          | Leave the nested page when the input is empty                           |
| A command's chord    | Run that command, while the palette is open; the chord needs a modifier |

Until an arrow key moves it, the highlight follows the top result, async results included, and Enter waits for pending sources before it runs the top result. After an arrow key it stays on that item as results arrive. A link row is a real `<a>`: middle-click and modified clicks open tabs natively.

A query matches titles first, then `keywords`, then descriptions, in match-sorter tiers: exact, prefix, word prefix, substring, acronym, fuzzy. A group ranks by its best match; ties go to page commands, then system commands, then sources. Children of a static page match from the root, shown with their path, at most three per parent.

Before anything is typed the palette lists Recent (the last five commands run, in `localStorage` per origin), then `suggested`, then "This page". A recent link is stored whole; a recent action only shows while a command with its id is registered.

## Registry

A registry lists other systems' commands and search endpoints, so each system's palette reaches the others without the list living in its code. Pass the document, or where to fetch it:

```tsx
<CommandPalette registry={{ url: "https://admin.example.com/palette/registry.json" }} />
```

```json
{
  "$schema": "https://unpkg.com/@aortl/admin-palette/dist/registry.schema.json",
  "protocol": 1,
  "systems": [
    {
      "id": "oms",
      "name": "OMS",
      "url": "https://oms.example.com",
      "icon": "package",
      "commands": [
        { "id": "orders", "title": "Orders", "href": "/orders/" },
        { "id": "order", "title": "Order {q}", "href": "/orders/{q}", "pattern": "^\\d{6,}$" },
        { "id": "customers", "title": "Customers", "children": { "search": "/palette/customers/" } }
      ],
      "sources": [
        { "id": "lookup", "search": "/palette/lookup/", "pattern": "^[#\\d]", "priority": 10 }
      ]
    }
  ]
}
```

Each system's commands list under its name, their ids prefixed with the system id (`oms.orders`); a local command with the same id replaces one. `href` and `search` resolve against the system's `url`. A link to another origin is a full navigation and carries an arrow; a same-origin one goes through `onNavigate`. A `pattern` command lists only when the query matches, with `{q}` filled in. `filter` drops commands, for example those of systems the user can't open.

A URL is fetched on first open, or earlier when the pointer or focus reaches a trigger or Ctrl/Cmd goes down, and kept in `sessionStorage`: later pages in the tab render from the copy and refresh it after five minutes. When the fetch fails the palette lists its local commands and notes that other systems are unavailable.

A search endpoint answers `GET <search>?q=<query>` with items in the same shape, their `href` relative to the endpoint. It needs CORS for every admin origin, without credentials.

```json
{
  "protocol": 1,
  "items": [
    {
      "id": "123456",
      "title": "Order 123456",
      "description": "Jane Doe · Shipped",
      "href": "/orders/123456/"
    }
  ]
}
```

An endpoint or the registry that names a `resource` is requested with `Authorization: Bearer <token>`, the token from the palette's `token(resource)`, cached per resource until a request answers 401.

Within `protocol` 1 changes are additive: the palette ignores fields it doesn't know and skips commands it can't run. A document in another version is treated as unavailable. `registry.schema.json` and `search.schema.json` in the package validate a server's output.

## Reference

### React

| Part                     | Renders    | Class             |
| ------------------------ | ---------- | ----------------- |
| `CommandPalette`         | `<dialog>` | `dialog palette`  |
| `CommandPalette.Trigger` | `<button>` | `palette-trigger` |

| Part                     | Prop          | Type                                                    | Default                |
| ------------------------ | ------------- | ------------------------------------------------------- | ---------------------- |
| `CommandPalette`         | `commands`    | `readonly Command[]`                                    | —                      |
| `CommandPalette`         | `sources`     | `readonly Source[]`                                     | —                      |
| `CommandPalette`         | `suggested`   | `readonly string[]`                                     | —                      |
| `CommandPalette`         | `hotkey`      | `string \| readonly string[] \| false`                  | `"mod+k"`              |
| `CommandPalette`         | `onNavigate`  | `(href: string) => void`                                | `location.assign`      |
| `CommandPalette`         | `registry`    | `PaletteRegistry \| { url: string; resource?: string }` | —                      |
| `CommandPalette`         | `filter`      | `(command: Command, system: string) => boolean`         | —                      |
| `CommandPalette`         | `token`       | `(resource: string) => Promise<string>`                 | —                      |
| `CommandPalette`         | `placeholder` | `string`                                                | `"Search or jump to…"` |
| `CommandPalette`         | `aria-label`  | `string`                                                | `"Command palette"`    |
| `CommandPalette.Trigger` | `page`        | `string`                                                | —                      |
| `CommandPalette.Trigger` | `keys`        | `string \| null`                                        | `"mod+k"`              |

`commands` list under "Commands" unless they name a `group`. `suggested` holds command ids. `hotkey` takes [`useHotkey`](../basics/conventions.md#hotkeys) syntax and toggles the palette. Pass your router's navigate as `onNavigate` so same-app links skip a full load. `CommandPalette.Trigger` takes native `<button>` attributes; `keys` is the hint only and should match `hotkey`.

| Hook                  | Returns                       |
| --------------------- | ----------------------------- |
| `useCommands(list)`   | Adds `list` while mounted     |
| `useCommandPalette()` | `{ open(options?), close() }` |

`open` takes `{ page, query }`: `page` is the id of a command with `children`.

### Standalone

| Function             | Effect                                                                            |
| -------------------- | --------------------------------------------------------------------------------- |
| `init(options)`      | Binds `hotkey` and triggers; once. Options: `CommandPalette` props, `stylesheets` |
| `open(options?)`     | Opens, loading the palette first; `{ page, query }` as `useCommandPalette`        |
| `close()`            | Closes                                                                            |
| `register(commands)` | Adds page commands; returns a function that removes them                          |

### Command

| Field         | Type                           | Notes                                                                                         |
| ------------- | ------------------------------ | --------------------------------------------------------------------------------------------- |
| `id`          | `string`                       | Unique across the palette; recents and `suggested` use it                                     |
| `title`       | `string`                       | —                                                                                             |
| `description` | `string`                       | One muted line, clamped at two                                                                |
| `group`       | `string`                       | Results heading                                                                               |
| `keywords`    | `readonly string[]`            | Extra match terms                                                                             |
| `icon`        | `IconProp \| string`           | A string is a Tabler name: `"package"` → `ti ti-package`                                      |
| `shortcut`    | `string`                       | `useHotkey` chord, bound while the palette is open; not one the app binds itself, or both run |
| `href`        | `string`                       | Navigates                                                                                     |
| `pattern`     | `RegExp`                       | Lists the command only when the query matches; `{q}` in `title` and `href` becomes the query  |
| `perform`     | `() => void`                   | Runs after the palette closes; ignored with `href`                                            |
| `children`    | `readonly Command[] \| Source` | Opens a nested page                                                                           |

### Source

| Field      | Type                                                 | Default                        |
| ---------- | ---------------------------------------------------- | ------------------------------ |
| `id`       | `string`                                             | —                              |
| `search`   | `(query, { signal }) => Promise<readonly Command[]>` | —                              |
| `group`    | `string`                                             | `"Results"` at the root        |
| `priority` | `number`                                             | `0`, below every command match |
| `minQuery` | `number`                                             | `1` at the root, `0` in a page |
| `pattern`  | `RegExp`                                             | —                              |
| `debounce` | `number` (ms)                                        | `150`                          |
| `timeout`  | `number` (ms)                                        | `3000`                         |

`priority` uses the tier scale: 7 is a case-sensitive exact title, 5 a prefix, 1 a fuzzy match. `signal` aborts when the query changes, the palette closes or the timeout passes; a failed or timed-out source shows its group as unavailable.

### Vanilla

| Class                   | Effect                                                                                                     |
| ----------------------- | ---------------------------------------------------------------------------------------------------------- |
| `palette`               | The panel: surface, border, column. On a `.dialog`, pinned near the top; a full-screen sheet below `40rem` |
| `palette-header`        | The input row: search icon, crumbs, input, spinner                                                         |
| `palette-crumb`         | One nested page in the header; a button                                                                    |
| `palette-input`         | The borderless search input                                                                                |
| `palette-list`          | The scrolling results                                                                                      |
| `palette-group`         | One results group; a rule between groups                                                                   |
| `palette-group-label`   | Sticky group heading                                                                                       |
| `palette-item`          | Dense row on `.item`; `[data-highlighted]` tints it                                                        |
| `palette-item-path`     | Muted ancestor titles before a nested match                                                                |
| `palette-status`        | Muted one-line message; hidden while empty                                                                 |
| `palette-footer`        | Key hints; hidden on phones                                                                                |
| `palette-trigger`       | Search-field-shaped button; the `kbd-group` hint hides on touch                                            |
| `palette-trigger-label` | The trigger's label, truncated first                                                                       |

The rows reuse `item-media`, `item-content`, `item-title`, `item-description` and `item-actions` from [List](../components/list.md).
