# Tables

> Native table with row selection, sticky headers, and row links.

Native `<table>` semantics. Cells inherit style from descendant selectors — no per-cell class. Modifiers (`striped`, `bordered`, `compact`/`relaxed`, `sticky`, `pinCol`) compose. Default row height is ~32px; `compact` tightens it and `relaxed` opens it up.

## Examples

### Basic

**Example**

```html
<table class="table">
  <thead>
    <tr>
      <th>Name</th>
      <th>Email</th>
      <th>Role</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Ada Lovelace</td>
      <td>ada@example.com</td>
      <td>Admin</td>
    </tr>
    <tr>
      <td>Grace Hopper</td>
      <td>grace@example.com</td>
      <td>Editor</td>
    </tr>
    <tr>
      <td>Alan Turing</td>
      <td>alan@example.com</td>
      <td>Viewer</td>
    </tr>
  </tbody>
</table>
```

```tsx
<Table>
  <Table.Head>
    <Table.Row>
      <Table.HeaderCell>Name</Table.HeaderCell>
      <Table.HeaderCell>Email</Table.HeaderCell>
      <Table.HeaderCell>Role</Table.HeaderCell>
    </Table.Row>
  </Table.Head>
  <Table.Body>
    <Table.Row>
      <Table.Cell>Ada Lovelace</Table.Cell>
      <Table.Cell>ada@example.com</Table.Cell>
      <Table.Cell>Admin</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>Grace Hopper</Table.Cell>
      <Table.Cell>grace@example.com</Table.Cell>
      <Table.Cell>Editor</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>Alan Turing</Table.Cell>
      <Table.Cell>alan@example.com</Table.Cell>
      <Table.Cell>Viewer</Table.Cell>
    </Table.Row>
  </Table.Body>
</Table>
```

### Modifiers

`striped` zebra-stripes the body, `bordered` draws cell borders, `relaxed` increases padding.

**Example**

```html
<table class="table table-striped">
  <thead>
    <tr>
      <th>Order</th>
      <th>Status</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>#1001</td>
      <td>Shipped</td>
    </tr>
    <tr>
      <td>#1002</td>
      <td>Processing</td>
    </tr>
    <tr>
      <td>#1003</td>
      <td>Shipped</td>
    </tr>
    <tr>
      <td>#1004</td>
      <td>Processing</td>
    </tr>
  </tbody>
</table>
```

```tsx
<Table striped>
  <Table.Head>
    <Table.Row>
      <Table.HeaderCell>Order</Table.HeaderCell>
      <Table.HeaderCell>Status</Table.HeaderCell>
    </Table.Row>
  </Table.Head>
  <Table.Body>
    <Table.Row>
      <Table.Cell>#1001</Table.Cell>
      <Table.Cell>Shipped</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>#1002</Table.Cell>
      <Table.Cell>Processing</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>#1003</Table.Cell>
      <Table.Cell>Shipped</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>#1004</Table.Cell>
      <Table.Cell>Processing</Table.Cell>
    </Table.Row>
  </Table.Body>
</Table>
```

**Example**

```html
<table class="table table-bordered table-relaxed">
  <thead>
    <tr>
      <th>SKU</th>
      <th>Name</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>A-001</td>
      <td>Widget</td>
    </tr>
    <tr>
      <td>A-002</td>
      <td>Gadget</td>
    </tr>
  </tbody>
</table>
```

```tsx
<Table bordered relaxed>
  <Table.Head>
    <Table.Row>
      <Table.HeaderCell>SKU</Table.HeaderCell>
      <Table.HeaderCell>Name</Table.HeaderCell>
    </Table.Row>
  </Table.Head>
  <Table.Body>
    <Table.Row>
      <Table.Cell>A-001</Table.Cell>
      <Table.Cell>Widget</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>A-002</Table.Cell>
      <Table.Cell>Gadget</Table.Cell>
    </Table.Row>
  </Table.Body>
</Table>
```

`compact` tightens padding the other way for dense operational tables — pass `density="compact"` (the `relaxed` prop maps to `density="relaxed"`).

**Example**

```html
<table class="table table-compact table-striped">
  <thead>
    <tr>
      <th>SKU</th>
      <th>Name</th>
      <th data-align="right">Qty</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>A-001</td>
      <td>Widget</td>
      <td data-align="right">128</td>
    </tr>
    <tr>
      <td>A-002</td>
      <td>Gadget</td>
      <td data-align="right">64</td>
    </tr>
    <tr>
      <td>A-003</td>
      <td>Sprocket</td>
      <td data-align="right">32</td>
    </tr>
  </tbody>
</table>
```

```tsx
<Table density="compact" striped>
  <Table.Head>
    <Table.Row>
      <Table.HeaderCell>SKU</Table.HeaderCell>
      <Table.HeaderCell>Name</Table.HeaderCell>
      <Table.HeaderCell align="right">Qty</Table.HeaderCell>
    </Table.Row>
  </Table.Head>
  <Table.Body>
    <Table.Row>
      <Table.Cell>A-001</Table.Cell>
      <Table.Cell>Widget</Table.Cell>
      <Table.Cell numeric>128</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>A-002</Table.Cell>
      <Table.Cell>Gadget</Table.Cell>
      <Table.Cell numeric>64</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>A-003</Table.Cell>
      <Table.Cell>Sprocket</Table.Cell>
      <Table.Cell numeric>32</Table.Cell>
    </Table.Row>
  </Table.Body>
</Table>
```

### Sticky header

`sticky` pins the header while the body scrolls. The table doesn't own the scroll region — wrap it in an overflowing container.

**Example**

```html
<div style="overflow: auto; max-height: 240px">
  <table class="table table-sticky">
    <thead>
      <tr>
        <th>ID</th>
        <th>Customer</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>#1001</td>
        <td>Ada</td>
      </tr>
      <tr>
        <td>#1002</td>
        <td>Grace</td>
      </tr>
      <tr>
        <td>#1003</td>
        <td>Alan</td>
      </tr>
      <tr>
        <td>#1004</td>
        <td>Donald</td>
      </tr>
      <tr>
        <td>#1005</td>
        <td>Edsger</td>
      </tr>
      <tr>
        <td>#1006</td>
        <td>Linus</td>
      </tr>
      <tr>
        <td>#1007</td>
        <td>Tony</td>
      </tr>
      <tr>
        <td>#1008</td>
        <td>Margaret</td>
      </tr>
      <tr>
        <td>#1009</td>
        <td>Barbara</td>
      </tr>
      <tr>
        <td>#1010</td>
        <td>Frances</td>
      </tr>
    </tbody>
  </table>
</div>
```

```tsx
<div style={{ overflow: "auto", maxHeight: 240 }}>
  <Table sticky>
    <Table.Head>
      <Table.Row>
        <Table.HeaderCell>ID</Table.HeaderCell>
        <Table.HeaderCell>Customer</Table.HeaderCell>
      </Table.Row>
    </Table.Head>
    <Table.Body>
      {[
        ["#1001", "Ada"],
        ["#1002", "Grace"],
        ["#1003", "Alan"],
        ["#1004", "Donald"],
        ["#1005", "Edsger"],
        ["#1006", "Linus"],
        ["#1007", "Tony"],
        ["#1008", "Margaret"],
        ["#1009", "Barbara"],
        ["#1010", "Frances"],
      ].map(([id, name]) => (
        <Table.Row key={id}>
          <Table.Cell>{id}</Table.Cell>
          <Table.Cell>{name}</Table.Cell>
        </Table.Row>
      ))}
    </Table.Body>
  </Table>
</div>
```

### Pinned column

`pinCol` keeps the first column visible during horizontal scroll. Like the sticky header, the table owns no scroll region — wrap it in an `overflow-x` container.

**Example**

```html
<div style="overflow-x: auto; max-width: 360px">
  <table class="table table-pin-col">
    <thead>
      <tr>
        <th>Name</th>
        <th>Email</th>
        <th>Team</th>
        <th>Role</th>
        <th>Joined</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Ada Lovelace</td>
        <td>ada@example.com</td>
        <td>Platform</td>
        <td>Admin</td>
        <td>2021-04-02</td>
      </tr>
      <tr>
        <td>Grace Hopper</td>
        <td>grace@example.com</td>
        <td>Compilers</td>
        <td>Editor</td>
        <td>2020-11-18</td>
      </tr>
    </tbody>
  </table>
</div>
```

```tsx
<div style={{ overflowX: "auto", maxWidth: 360 }}>
  <Table pinCol>
    <Table.Head>
      <Table.Row>
        <Table.HeaderCell>Name</Table.HeaderCell>
        <Table.HeaderCell>Email</Table.HeaderCell>
        <Table.HeaderCell>Team</Table.HeaderCell>
        <Table.HeaderCell>Role</Table.HeaderCell>
        <Table.HeaderCell>Joined</Table.HeaderCell>
      </Table.Row>
    </Table.Head>
    <Table.Body>
      <Table.Row>
        <Table.Cell>Ada Lovelace</Table.Cell>
        <Table.Cell>ada@example.com</Table.Cell>
        <Table.Cell>Platform</Table.Cell>
        <Table.Cell>Admin</Table.Cell>
        <Table.Cell>2021-04-02</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>Grace Hopper</Table.Cell>
        <Table.Cell>grace@example.com</Table.Cell>
        <Table.Cell>Compilers</Table.Cell>
        <Table.Cell>Editor</Table.Cell>
        <Table.Cell>2020-11-18</Table.Cell>
      </Table.Row>
    </Table.Body>
  </Table>
</div>
```

### Cell alignment

Set `data-align="right"` (or `"center"`) on `<td>`/`<th>` — or pass `align` to `<Table.Cell>` / `<Table.HeaderCell>`. For currency or totals, prefer `numeric` on body cells (right-aligns, adds `tabular-nums`) and `align="right"` on the matching header.

**Example**

```html
<table class="table">
  <thead>
    <tr>
      <th>Item</th>
      <th data-align="right">Qty</th>
      <th data-align="right">Total</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Widget</td>
      <td data-align="right">3</td>
      <td data-align="right">$129.00</td>
    </tr>
    <tr>
      <td>Gadget</td>
      <td data-align="right">12</td>
      <td data-align="right">$1,344.50</td>
    </tr>
  </tbody>
</table>
```

```tsx
<Table>
  <Table.Head>
    <Table.Row>
      <Table.HeaderCell>Item</Table.HeaderCell>
      <Table.HeaderCell align="right">Qty</Table.HeaderCell>
      <Table.HeaderCell align="right">Total</Table.HeaderCell>
    </Table.Row>
  </Table.Head>
  <Table.Body>
    <Table.Row>
      <Table.Cell>Widget</Table.Cell>
      <Table.Cell numeric>3</Table.Cell>
      <Table.Cell numeric>$129.00</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>Gadget</Table.Cell>
      <Table.Cell numeric>12</Table.Cell>
      <Table.Cell numeric>$1,344.50</Table.Cell>
    </Table.Row>
  </Table.Body>
</Table>
```

### Status gutter

A narrow leading cell for row-level status glyphs. `.table-cell-gutter` (or `gutter` prop) centers the icon and uses muted text; colour the icon explicitly when status carries meaning.

**Example**

```html
<table class="table">
  <thead>
    <tr>
      <th class="table-cell-gutter"></th>
      <th>Order</th>
      <th>Customer</th>
      <th data-align="right">Total</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="table-cell-gutter">
        <i class="ti ti-circle-check" style="color: var(--color-success)" aria-hidden="true"></i>
      </td>
      <td>#1001</td>
      <td>Ada Lovelace</td>
      <td data-align="right">$129.00</td>
    </tr>
    <tr>
      <td class="table-cell-gutter"><i class="ti ti-clock" aria-hidden="true"></i></td>
      <td>#1002</td>
      <td>Grace Hopper</td>
      <td data-align="right">$72.50</td>
    </tr>
    <tr>
      <td class="table-cell-gutter">
        <i class="ti ti-circle-x" style="color: var(--color-danger)" aria-hidden="true"></i>
      </td>
      <td>#1003</td>
      <td>Alan Turing</td>
      <td data-align="right">$310.00</td>
    </tr>
  </tbody>
</table>
```

```tsx
<Table>
  <Table.Head>
    <Table.Row>
      <Table.HeaderCell gutter />
      <Table.HeaderCell>Order</Table.HeaderCell>
      <Table.HeaderCell>Customer</Table.HeaderCell>
      <Table.HeaderCell align="right">Total</Table.HeaderCell>
    </Table.Row>
  </Table.Head>
  <Table.Body>
    <Table.Row>
      <Table.Cell gutter>
        <IconCircleCheck size={16} style={{ color: "var(--color-success)" }} aria-hidden />
      </Table.Cell>
      <Table.Cell>#1001</Table.Cell>
      <Table.Cell>Ada Lovelace</Table.Cell>
      <Table.Cell numeric>$129.00</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell gutter>
        <IconClock size={16} aria-hidden />
      </Table.Cell>
      <Table.Cell>#1002</Table.Cell>
      <Table.Cell>Grace Hopper</Table.Cell>
      <Table.Cell numeric>$72.50</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell gutter>
        <IconCircleX size={16} style={{ color: "var(--color-danger)" }} aria-hidden />
      </Table.Cell>
      <Table.Cell>#1003</Table.Cell>
      <Table.Cell>Alan Turing</Table.Cell>
      <Table.Cell numeric>$310.00</Table.Cell>
    </Table.Row>
  </Table.Body>
</Table>
```

### Row selection

Put a [Checkbox](forms/checkboxes.md) in the first cell — the row tint reacts to native `:checked`, Base UI's `[data-checked]`, or the `data-selected` hook (see below). Wire the select-all header checkbox yourself.

**Example**

```html
<table class="table">
  <thead>
    <tr>
      <th class="table-cell-gutter">
        <input type="checkbox" class="checkbox" aria-label="Select all" />
      </th>
      <th>Order</th>
      <th>Customer</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="table-cell-gutter">
        <input type="checkbox" class="checkbox" aria-label="Select #1001" />
      </td>
      <td>#1001</td>
      <td>Ada Lovelace</td>
    </tr>
    <tr>
      <td class="table-cell-gutter">
        <input type="checkbox" class="checkbox" aria-label="Select #1002" checked />
      </td>
      <td>#1002</td>
      <td>Grace Hopper</td>
    </tr>
    <tr>
      <td class="table-cell-gutter">
        <input type="checkbox" class="checkbox" aria-label="Select #1003" />
      </td>
      <td>#1003</td>
      <td>Alan Turing</td>
    </tr>
  </tbody>
</table>
```

```tsx
<Table>
  <Table.Head>
    <Table.Row>
      <Table.HeaderCell gutter>
        <Checkbox aria-label="Select all" />
      </Table.HeaderCell>
      <Table.HeaderCell>Order</Table.HeaderCell>
      <Table.HeaderCell>Customer</Table.HeaderCell>
    </Table.Row>
  </Table.Head>
  <Table.Body>
    <Table.Row>
      <Table.Cell gutter>
        <Checkbox aria-label="Select #1001" />
      </Table.Cell>
      <Table.Cell>#1001</Table.Cell>
      <Table.Cell>Ada Lovelace</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell gutter>
        <Checkbox aria-label="Select #1002" defaultChecked />
      </Table.Cell>
      <Table.Cell>#1002</Table.Cell>
      <Table.Cell>Grace Hopper</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell gutter>
        <Checkbox aria-label="Select #1003" />
      </Table.Cell>
      <Table.Cell>#1003</Table.Cell>
      <Table.Cell>Alan Turing</Table.Cell>
    </Table.Row>
  </Table.Body>
</Table>
```

For programmatic selection without a checkbox, use `<Table.Row selected>` — it sets `data-selected` and applies the same tint.

**Example**

```html
<table class="table">
  <tbody>
    <tr>
      <td>#1001</td>
      <td>Ada</td>
    </tr>
    <tr data-selected>
      <td>#1002</td>
      <td>Grace</td>
    </tr>
    <tr>
      <td>#1003</td>
      <td>Alan</td>
    </tr>
  </tbody>
</table>
```

```tsx
<Table>
  <Table.Body>
    <Table.Row>
      <Table.Cell>#1001</Table.Cell>
      <Table.Cell>Ada</Table.Cell>
    </Table.Row>
    <Table.Row selected>
      <Table.Cell>#1002</Table.Cell>
      <Table.Cell>Grace</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>#1003</Table.Cell>
      <Table.Cell>Alan</Table.Cell>
    </Table.Row>
  </Table.Body>
</Table>
```

### Whole-row link

Add `.table-row-link` to the `<tr>` (or `asLink` on `<Table.Row>`) and put the link in the first cell. CSS expands the anchor's hit area via `::after`, so the whole row is clickable and keyboard-focusable through the real `<a>`. Other in-row buttons and links stay clickable because they sit above the pseudo-element.

**Example**

```html
<table class="table">
  <thead>
    <tr>
      <th>Order</th>
      <th>Customer</th>
      <th data-align="right">Total</th>
    </tr>
  </thead>
  <tbody>
    <tr class="table-row-link">
      <td><a href="#1001">#1001</a></td>
      <td>Ada Lovelace</td>
      <td data-align="right">$129.00</td>
    </tr>
    <tr class="table-row-link">
      <td><a href="#1002">#1002</a></td>
      <td>Grace Hopper</td>
      <td data-align="right">$72.50</td>
    </tr>
    <tr class="table-row-link">
      <td><a href="#1003">#1003</a></td>
      <td>Alan Turing</td>
      <td data-align="right">$310.00</td>
    </tr>
  </tbody>
</table>
```

```tsx
<Table>
  <Table.Head>
    <Table.Row>
      <Table.HeaderCell>Order</Table.HeaderCell>
      <Table.HeaderCell>Customer</Table.HeaderCell>
      <Table.HeaderCell align="right">Total</Table.HeaderCell>
    </Table.Row>
  </Table.Head>
  <Table.Body>
    <Table.Row asLink>
      <Table.Cell>
        <a href="#1001">#1001</a>
      </Table.Cell>
      <Table.Cell>Ada Lovelace</Table.Cell>
      <Table.Cell numeric>$129.00</Table.Cell>
    </Table.Row>
    <Table.Row asLink>
      <Table.Cell>
        <a href="#1002">#1002</a>
      </Table.Cell>
      <Table.Cell>Grace Hopper</Table.Cell>
      <Table.Cell numeric>$72.50</Table.Cell>
    </Table.Row>
    <Table.Row asLink>
      <Table.Cell>
        <a href="#1003">#1003</a>
      </Table.Cell>
      <Table.Cell>Alan Turing</Table.Cell>
      <Table.Cell numeric>$310.00</Table.Cell>
    </Table.Row>
  </Table.Body>
</Table>
```

### Footer row

`<Table.Foot>` (or `<tfoot>`) rows are semibold, and the first footer row gets a strong top divider against the body.

**Example**

```html
<table class="table">
  <thead>
    <tr>
      <th>Item</th>
      <th data-align="right">Total</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Widget</td>
      <td data-align="right">$129.00</td>
    </tr>
    <tr>
      <td>Gadget</td>
      <td data-align="right">$72.50</td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <td>Total</td>
      <td data-align="right">$201.50</td>
    </tr>
  </tfoot>
</table>
```

```tsx
<Table>
  <Table.Head>
    <Table.Row>
      <Table.HeaderCell>Item</Table.HeaderCell>
      <Table.HeaderCell align="right">Total</Table.HeaderCell>
    </Table.Row>
  </Table.Head>
  <Table.Body>
    <Table.Row>
      <Table.Cell>Widget</Table.Cell>
      <Table.Cell numeric>$129.00</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>Gadget</Table.Cell>
      <Table.Cell numeric>$72.50</Table.Cell>
    </Table.Row>
  </Table.Body>
  <Table.Foot>
    <Table.Row>
      <Table.Cell>Total</Table.Cell>
      <Table.Cell numeric>$201.50</Table.Cell>
    </Table.Row>
  </Table.Foot>
</Table>
```

Every footer row is semibold; the divider lands above the first. For an invoice-style breakdown, stack subtotal, tax, and total rows.

**Example**

```html
<table class="table">
  <thead>
    <tr>
      <th>Item</th>
      <th data-align="right">Amount</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Widget</td>
      <td data-align="right">$129.00</td>
    </tr>
    <tr>
      <td>Gadget</td>
      <td data-align="right">$72.50</td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <td>Subtotal</td>
      <td data-align="right">$201.50</td>
    </tr>
    <tr>
      <td>Tax</td>
      <td data-align="right">$20.15</td>
    </tr>
    <tr>
      <td>
        Total
        <span class="badge badge-success badge-soft">
          <i class="ti ti-trending-up" aria-hidden="true"></i>
          +12%
        </span>
      </td>
      <td data-align="right">$221.65</td>
    </tr>
  </tfoot>
</table>
```

```tsx
<Table>
  <Table.Head>
    <Table.Row>
      <Table.HeaderCell>Item</Table.HeaderCell>
      <Table.HeaderCell align="right">Amount</Table.HeaderCell>
    </Table.Row>
  </Table.Head>
  <Table.Body>
    <Table.Row>
      <Table.Cell>Widget</Table.Cell>
      <Table.Cell numeric>$129.00</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>Gadget</Table.Cell>
      <Table.Cell numeric>$72.50</Table.Cell>
    </Table.Row>
  </Table.Body>
  <Table.Foot>
    <Table.Row>
      <Table.Cell>Subtotal</Table.Cell>
      <Table.Cell numeric>$201.50</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>Tax</Table.Cell>
      <Table.Cell numeric>$20.15</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>
        Total{" "}
        <Badge variant="success" soft icon={IconTrendingUp}>
          +12%
        </Badge>
      </Table.Cell>
      <Table.Cell numeric>$221.65</Table.Cell>
    </Table.Row>
  </Table.Foot>
</Table>
```

### Empty state

`<Table.Empty>` (or a `.table-empty` cell) renders a centered, muted message spanning the table. Set `colspan` to the column count.

**Example**

```html
<table class="table">
  <thead>
    <tr>
      <th>Order</th>
      <th>Customer</th>
      <th data-align="right">Total</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="table-empty" colspan="3">No orders match your filters.</td>
    </tr>
  </tbody>
</table>
```

```tsx
<Table>
  <Table.Head>
    <Table.Row>
      <Table.HeaderCell>Order</Table.HeaderCell>
      <Table.HeaderCell>Customer</Table.HeaderCell>
      <Table.HeaderCell align="right">Total</Table.HeaderCell>
    </Table.Row>
  </Table.Head>
  <Table.Body>
    <Table.Empty colSpan={3}>No orders match your filters.</Table.Empty>
  </Table.Body>
</Table>
```

## Horizontal overflow

`<Table>` doesn't wrap itself in a scroll container. Wrap explicitly when you need horizontal scroll on narrow viewports:

```html
<div style="overflow-x: auto">
  <table class="table">
    …
  </table>
</div>
```
