# Tables

> Native table with row selection, sticky headers, and row links.

## Contents

- [Examples](#examples)
  - [Basic](#basic)
  - [Filter toolbar](#filter-toolbar)
  - [Sortable columns](#sortable-columns)
  - [Modifiers](#modifiers)
  - [Sticky header](#sticky-header)
  - [Pinned column](#pinned-column)
  - [Cell alignment](#cell-alignment)
  - [Status gutter](#status-gutter)
  - [Row selection](#row-selection)
  - [Whole-row link](#whole-row-link)
  - [Footer row](#footer-row)
  - [Empty state](#empty-state)
- [Reference](#reference)
  - [React](#react)
  - [Vanilla](#vanilla)

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

### Filter toolbar

Markup only; wire the filtering logic yourself. The layout is a flex [toolbar](row.md#toolbar) above the table.

**Example**

```html
<div class="flex w-full flex-col gap-3">
  <div class="flex flex-wrap items-center gap-2">
    <input class="input input-sm flex-1" type="search" placeholder="Search orders" />
    <button type="button" class="btn btn-sm" commandfor="orders-filters" command="show-modal">
      <i class="ti ti-filter" aria-hidden="true"></i> Filters
    </button>
    <button type="button" class="btn btn-primary btn-sm">
      <i class="ti ti-plus" aria-hidden="true"></i> New order
    </button>
  </div>
  <table class="table table-striped">
    <thead>
      <tr>
        <th>Order</th>
        <th>Customer</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>#1001</td>
        <td>Ada Lovelace</td>
        <td>Shipped</td>
      </tr>
      <tr>
        <td>#1002</td>
        <td>Grace Hopper</td>
        <td>Processing</td>
      </tr>
      <tr>
        <td>#1003</td>
        <td>Alan Turing</td>
        <td>Shipped</td>
      </tr>
    </tbody>
  </table>
</div>

<dialog id="orders-filters" class="dialog drawer" closedby="any">
  <form method="dialog">
    <div class="dialog-header">
      <h2 class="dialog-title">Filters</h2>
    </div>
    <div class="dialog-body flex flex-col gap-4">
      <div class="field">
        <label class="field-label" for="filter-customer">Customer</label>
        <input class="input" id="filter-customer" type="search" placeholder="Any" />
      </div>
      <div class="field">
        <label class="field-label">
          <input type="checkbox" class="checkbox" /> Unfulfilled only
        </label>
      </div>
    </div>
    <div class="dialog-footer">
      <button type="submit" class="btn btn-ghost" value="reset" formnovalidate>Reset</button>
      <button type="submit" class="btn btn-primary" value="apply">Apply</button>
    </div>
  </form>
</dialog>
```

```tsx
<div className="flex w-full flex-col gap-3">
  <div className="flex flex-wrap items-center gap-2">
    <Input type="search" placeholder="Search orders" inputSize="sm" className="flex-1" />
    <Button size="sm" icon={IconFilter} commandfor="orders-filters-r" command="show-modal">
      Filters
    </Button>
    <Button variant="primary" size="sm" icon={IconPlus}>
      New order
    </Button>
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
</div>

<Drawer.Container id="orders-filters-r">
  <form method="dialog">
    <Drawer.Header>
      <Drawer.Title>Filters</Drawer.Title>
    </Drawer.Header>
    <Drawer.Body className="flex flex-col gap-4">
      <Field>
        <Field.Label>Customer</Field.Label>
        <Input type="search" placeholder="Any" />
      </Field>
      <Field>
        <Field.Label>
          <Checkbox /> Unfulfilled only
        </Field.Label>
      </Field>
    </Drawer.Body>
    <Drawer.Footer>
      <Button variant="ghost" value="reset" type="submit" formNoValidate>
        Reset
      </Button>
      <Button variant="primary" value="apply" type="submit">
        Apply
      </Button>
    </Drawer.Footer>
  </form>
</Drawer.Container>
```

### Sortable columns

**Example**

```html
<table class="table">
  <thead>
    <tr>
      <th aria-sort="ascending">
        <button type="button" class="table-sort">Name</button>
      </th>
      <th>
        <button type="button" class="table-sort">Created</button>
      </th>
      <th data-align="right">
        <button type="button" class="table-sort">Total</button>
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Ada Lovelace</td>
      <td>2024-01-12</td>
      <td class="table-cell-numeric">$129.00</td>
    </tr>
    <tr>
      <td>Alan Turing</td>
      <td>2024-03-04</td>
      <td class="table-cell-numeric">$310.00</td>
    </tr>
    <tr>
      <td>Grace Hopper</td>
      <td>2024-05-21</td>
      <td class="table-cell-numeric">$72.50</td>
    </tr>
  </tbody>
</table>
```

```tsx
<Table>
  <Table.Head>
    <Table.Row>
      <Table.HeaderCell sort="ascending">Name</Table.HeaderCell>
      <Table.HeaderCell sort="none">Created</Table.HeaderCell>
      <Table.HeaderCell sort="none" align="right">
        Total
      </Table.HeaderCell>
    </Table.Row>
  </Table.Head>
  <Table.Body>
    <Table.Row>
      <Table.Cell>Ada Lovelace</Table.Cell>
      <Table.Cell>2024-01-12</Table.Cell>
      <Table.Cell numeric>$129.00</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>Alan Turing</Table.Cell>
      <Table.Cell>2024-03-04</Table.Cell>
      <Table.Cell numeric>$310.00</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>Grace Hopper</Table.Cell>
      <Table.Cell>2024-05-21</Table.Cell>
      <Table.Cell numeric>$72.50</Table.Cell>
    </Table.Row>
  </Table.Body>
</Table>
```

**Caution** — `table-sort` draws the indicator from the cell's `aria-sort`; the click handler and ordering are yours. Set `aria-sort` to `ascending` or `descending` on the sorted column **only**; leaving it on every column tells a screen reader they are all sorted. React's `sort` prop sets it for you and omits it for `"none"`.

### Modifiers

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
      <td class="table-cell-numeric">128</td>
    </tr>
    <tr>
      <td>A-002</td>
      <td>Gadget</td>
      <td class="table-cell-numeric">64</td>
    </tr>
    <tr>
      <td>A-003</td>
      <td>Sprocket</td>
      <td class="table-cell-numeric">32</td>
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

**Example**

```html
<section class="table-scroll" tabindex="0" aria-label="Orders" style="max-height: 240px">
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
</section>
```

```tsx
<Table.Scroll aria-label="Orders" style={{ maxHeight: 240 }}>
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
</Table.Scroll>
```

### Pinned column

**Example**

```html
<section class="table-scroll" tabindex="0" aria-label="Customers" style="max-width: 360px">
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
</section>
```

```tsx
<Table.Scroll aria-label="Customers" style={{ maxWidth: 360 }}>
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
</Table.Scroll>
```

### Cell alignment

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
      <td class="table-cell-numeric">3</td>
      <td class="table-cell-numeric">$129.00</td>
    </tr>
    <tr>
      <td>Gadget</td>
      <td class="table-cell-numeric">12</td>
      <td class="table-cell-numeric">$1,344.50</td>
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

When the icon is the only carrier of status, give it `role="img"` and an `aria-label`, and label the header cell.

**Example**

```html
<table class="table">
  <thead>
    <tr>
      <th class="table-cell-gutter" aria-label="Status"></th>
      <th>Order</th>
      <th>Customer</th>
      <th data-align="right">Total</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="table-cell-gutter">
        <i
          class="ti ti-circle-check"
          style="color: var(--color-success)"
          role="img"
          aria-label="Shipped"
        ></i>
      </td>
      <td>#1001</td>
      <td>Ada Lovelace</td>
      <td class="table-cell-numeric">$129.00</td>
    </tr>
    <tr>
      <td class="table-cell-gutter">
        <i class="ti ti-clock" role="img" aria-label="Processing"></i>
      </td>
      <td>#1002</td>
      <td>Grace Hopper</td>
      <td class="table-cell-numeric">$72.50</td>
    </tr>
    <tr>
      <td class="table-cell-gutter">
        <i
          class="ti ti-circle-x"
          style="color: var(--color-danger)"
          role="img"
          aria-label="Cancelled"
        ></i>
      </td>
      <td>#1003</td>
      <td>Alan Turing</td>
      <td class="table-cell-numeric">$310.00</td>
    </tr>
  </tbody>
</table>
```

```tsx
<Table>
  <Table.Head>
    <Table.Row>
      <Table.HeaderCell gutter aria-label="Status" />
      <Table.HeaderCell>Order</Table.HeaderCell>
      <Table.HeaderCell>Customer</Table.HeaderCell>
      <Table.HeaderCell align="right">Total</Table.HeaderCell>
    </Table.Row>
  </Table.Head>
  <Table.Body>
    <Table.Row>
      <Table.Cell gutter>
        <IconCircleCheck
          size={16}
          style={{ color: "var(--color-success)" }}
          role="img"
          aria-label="Shipped"
        />
      </Table.Cell>
      <Table.Cell>#1001</Table.Cell>
      <Table.Cell>Ada Lovelace</Table.Cell>
      <Table.Cell numeric>$129.00</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell gutter>
        <IconClock size={16} role="img" aria-label="Processing" />
      </Table.Cell>
      <Table.Cell>#1002</Table.Cell>
      <Table.Cell>Grace Hopper</Table.Cell>
      <Table.Cell numeric>$72.50</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell gutter>
        <IconCircleX
          size={16}
          style={{ color: "var(--color-danger)" }}
          role="img"
          aria-label="Cancelled"
        />
      </Table.Cell>
      <Table.Cell>#1003</Table.Cell>
      <Table.Cell>Alan Turing</Table.Cell>
      <Table.Cell numeric>$310.00</Table.Cell>
    </Table.Row>
  </Table.Body>
</Table>
```

### Row selection

Put a [Checkbox](forms/checkboxes.md) in the first cell. Wire the select-all header checkbox yourself.

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

**Example**

```html
<table class="table">
  <thead>
    <tr>
      <th>Order</th>
      <th>Customer</th>
      <th data-align="right">Total</th>
      <th aria-label="Actions"></th>
    </tr>
  </thead>
  <tbody>
    <tr class="table-row-link">
      <td><a href="#1001">#1001</a></td>
      <td>Ada Lovelace</td>
      <td class="table-cell-numeric">$129.00</td>
      <td class="table-cell-actions">
        <button type="button" class="btn btn-sm">Approve</button>
      </td>
    </tr>
    <tr class="table-row-link">
      <td><a href="#1002">#1002</a></td>
      <td>Grace Hopper</td>
      <td class="table-cell-numeric">$72.50</td>
      <td class="table-cell-actions">
        <button type="button" class="btn btn-sm">Approve</button>
      </td>
    </tr>
    <tr class="table-row-link">
      <td><a href="#1003">#1003</a></td>
      <td>Alan Turing</td>
      <td class="table-cell-numeric">$310.00</td>
      <td class="table-cell-actions">
        <button type="button" class="btn btn-sm">Approve</button>
      </td>
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
      <Table.HeaderCell aria-label="Actions" />
    </Table.Row>
  </Table.Head>
  <Table.Body>
    {[
      ["#1001", "Ada Lovelace", "$129.00"],
      ["#1002", "Grace Hopper", "$72.50"],
      ["#1003", "Alan Turing", "$310.00"],
    ].map(([id, name, total]) => (
      <Table.Row key={id} asLink>
        <Table.Cell>
          <a href={id}>{id}</a>
        </Table.Cell>
        <Table.Cell>{name}</Table.Cell>
        <Table.Cell numeric>{total}</Table.Cell>
        <Table.Cell actions>
          <Button size="sm">Approve</Button>
        </Table.Cell>
      </Table.Row>
    ))}
  </Table.Body>
</Table>
```

**Caution** — The row-filling hit area is a `::before` on the row's first `<a>` in document order, so a row-actions menu or other control with links goes after the row link. Buttons, form controls and later links in the row sit above it and stay clickable. Keyboard focus on that link rings the row. With `table-pin-col`, put the link in a later column; the pinned cell stays outside the row's hit area.

### Footer row

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
      <td class="table-cell-numeric">$129.00</td>
    </tr>
    <tr>
      <td>Gadget</td>
      <td class="table-cell-numeric">$72.50</td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <td>Total</td>
      <td class="table-cell-numeric">$201.50</td>
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
      <td class="table-cell-numeric">$129.00</td>
    </tr>
    <tr>
      <td>Gadget</td>
      <td class="table-cell-numeric">$72.50</td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <td>Subtotal</td>
      <td class="table-cell-numeric">$201.50</td>
    </tr>
    <tr>
      <td>Tax</td>
      <td class="table-cell-numeric">$20.15</td>
    </tr>
    <tr>
      <td>
        Total
        <span class="badge badge-success badge-soft">
          <i class="ti ti-trending-up" aria-hidden="true"></i>
          +12%
        </span>
      </td>
      <td class="table-cell-numeric">$221.65</td>
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

**Caution** — A table never owns a scroll region. `sticky`, `pinCol`, and horizontal overflow on narrow viewports all need a scrolling ancestor. Wrap the table in `table-scroll` (React `Table.Scroll`) and give it a `max-height` for `sticky`. Make the wrapper a named `<section>` with `tabindex="0"` so it scrolls by keyboard; `Table.Scroll` renders the `<section>` and `tabIndex` and requires `aria-label` or `aria-labelledby`:

```html
<section class="table-scroll" tabindex="0" aria-label="Orders" style="max-height: 240px">
  <table class="table table-sticky">
    …
  </table>
</section>
```

## Reference

### React

| Part               | Renders                 | Class                                                |
| ------------------ | ----------------------- | ---------------------------------------------------- |
| `Table`            | `<table>`               | `table`                                              |
| `Table.Head`       | `<thead>`               | —                                                    |
| `Table.Body`       | `<tbody>`               | —                                                    |
| `Table.Foot`       | `<tfoot>`               | —                                                    |
| `Table.Row`        | `<tr>`                  | `table-row-link` when `asLink`                       |
| `Table.HeaderCell` | `<th scope="col">`      | `table-header-cell`; `table-cell` when `scope="row"` |
| `Table.Cell`       | `<td>`                  | `table-cell`                                         |
| `Table.Empty`      | its own `<tr>` + `<td>` | `table-empty`                                        |
| `Table.Scroll`     | `<section>`             | `table-scroll`                                       |

| Part                             | Prop       | Type                                    | Default     |
| -------------------------------- | ---------- | --------------------------------------- | ----------- |
| `Table`                          | `striped`  | `boolean`                               | `false`     |
| `Table`                          | `bordered` | `boolean`                               | `false`     |
| `Table`                          | `density`  | `"compact" \| "default" \| "relaxed"`   | `"default"` |
| `Table`                          | `relaxed`  | `boolean`                               | `false`     |
| `Table`                          | `sticky`   | `boolean`                               | `false`     |
| `Table`                          | `pinCol`   | `boolean`                               | `false`     |
| `Table.Row`                      | `selected` | `boolean`                               | `false`     |
| `Table.Row`                      | `asLink`   | `boolean`                               | `false`     |
| `Table.Cell`, `Table.HeaderCell` | `align`    | `"left" \| "right" \| "center"`         | `"left"`    |
| `Table.Cell`, `Table.HeaderCell` | `gutter`   | `boolean`                               | `false`     |
| `Table.Cell`                     | `numeric`  | `boolean`                               | `false`     |
| `Table.Cell`                     | `actions`  | `boolean`                               | `false`     |
| `Table.HeaderCell`               | `sort`     | `"ascending" \| "descending" \| "none"` | —           |
| `Table.HeaderCell`               | `onSort`   | `MouseEventHandler<HTMLButtonElement>`  | —           |

`relaxed` is deprecated — use `density="relaxed"`. `sticky` and `pinCol` need a scrolling ancestor such as `Table.Scroll`, a `<section>` with `tabIndex={0}` that requires `aria-label` or `aria-labelledby`. `sort` wraps the header's children in a `table-sort` button that calls `onSort`; any value but `"none"` also sets `aria-sort`. `selected` sets `[data-selected]` for checkbox-less selection; `asLink` styles the row but you still supply the `<a>`. `align="left"` and `density="default"` emit nothing. Set `gutter` on the header cell too so the column lines up, and `Table.Empty` takes a `colSpan` — set it to the column count.

Plus each element's native attributes. `Table` takes no `classNames` — every part accepts `className`. `Table.Empty` renders its own `<tr>`, so drop it straight into `Table.Body`.

### Vanilla

| Class / var          | Effect                                                                                                                  |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `table`              | Full width, `text-sm`, collapsed borders; cells get `0.75rem`/`0.375rem` padding and a bottom divider (~32px rows)      |
| `table-striped`      | Tints even `<tbody>` rows                                                                                               |
| `table-bordered`     | Border around the table and between columns                                                                             |
| `table-compact`      | `0.5rem`/`0.25rem` padding, `text-xs`                                                                                   |
| `table-relaxed`      | `1rem`/`0.75rem` padding                                                                                                |
| `table-sticky`       | Pins `<thead>` cells to the top of the scroll region                                                                    |
| `table-pin-col`      | Pins the first cell of every row against horizontal scroll, with a divider on its edge                                  |
| `table-header-cell`  | Header styling for a cell outside `<thead>`                                                                             |
| `table-cell`         | Cell styling for markup that isn't a real `<td>`                                                                        |
| `table-cell-numeric` | Right-aligns, uses tabular figures and doesn't wrap                                                                     |
| `table-cell-gutter`  | `1.5rem` centered status column with muted text — colour the icon yourself when status carries meaning                  |
| `table-cell-actions` | Trailing row-actions column: shrinks to its controls, right-aligned, no block padding                                   |
| `table-empty`        | Centered muted message cell; set `colspan` to the column count                                                          |
| `table-row-link`     | Row-filling hit area taken from the row's first `<a>`                                                                   |
| `table-sort`         | Text button for a sortable header; its indicator follows the cell's `aria-sort`                                         |
| `table-scroll`       | Scroll region for wide tables; the scrolling ancestor `table-sticky` and `table-pin-col` need                           |
| `--surface-current`  | Fill painted under the pinned column and sticky header; containers such as `card` set it. Defaults to `--color-surface` |

Modifiers compose — `striped` with `sticky` with `relaxed` is fine.

A `table` that is a direct child of a `card` (in React, a `Card.Container`), or of a `table-scroll` there, pads its first and last cells to the card's `1rem` inset, `0.75rem` under `card-compact`, so the columns line up with the card title.

Plain `<th>` and `<td>` need no class: descendant selectors style them, and `<tfoot>` rows are semibold with a strong top divider on the first automatically. `[data-align="right"]` or `[data-align="center"]` on a cell aligns it; left is the default. The row tint responds to `input[type="checkbox"]:checked`, `.checkbox[data-checked]`, `[data-selected]` on the `<tr>`, or a link with `aria-current` in the row; a switch in the row doesn't tint it. A `<th scope="row">` in `<tbody>` styles as a body cell in medium weight.

Striping, hover and selection are scoped to `<tbody>`, and `table-pin-col` pins `:first-child` — so the pinned column must literally be first, and a loose `<tr>` outside `<tbody>` won't stripe.
