# Master-detail

> Pick a row and show its record beside the list.

## Contents

- [Examples](#examples)
  - [Table and detail card](#table-and-detail-card)
  - [Nothing selected](#nothing-selected)
- [Built from](#built-from)

## Examples

### Table and detail card

**Example**

```html
<div class="grid w-full grid-cols-1 gap-4 sm:grid-cols-5">
  <div class="sm:col-span-3">
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
        <tr class="table-row-link" data-selected>
          <td><a href="#1002" aria-current="true">#1002</a></td>
          <td>Grace Hopper</td>
          <td data-align="right">$72.50</td>
        </tr>
        <tr class="table-row-link">
          <td><a href="#1003">#1003</a></td>
          <td>Alan Turing</td>
          <td data-align="right">$18.00</td>
        </tr>
      </tbody>
    </table>
  </div>
  <div class="card sm:col-span-2">
    <div class="card-body">
      <div class="card-header">
        <h3 class="card-title">Order #1002</h3>
        <div class="card-toolbar">
          <button class="btn btn-ghost btn-square btn-sm" type="button" aria-label="Edit">
            <i class="ti ti-pencil" aria-hidden="true"></i>
          </button>
        </div>
      </div>
      <section class="property-list property-list-compact">
        <dl class="property-list-items">
          <dt class="property-list-label">Customer</dt>
          <dd class="property-list-value">Grace Hopper</dd>
          <dt class="property-list-label">Status</dt>
          <dd class="property-list-value">
            <span class="badge badge-success badge-soft">Paid</span>
          </dd>
          <dt class="property-list-label">Placed</dt>
          <dd class="property-list-value">2026-09-20</dd>
          <dt class="property-list-label">Total</dt>
          <dd class="property-list-value property-list-value-numeric">$72.50</dd>
        </dl>
      </section>
    </div>
  </div>
</div>
```

```tsx
<div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-5">
  <div className="sm:col-span-3">
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
          <Table.Cell align="right">$129.00</Table.Cell>
        </Table.Row>
        <Table.Row asLink selected>
          <Table.Cell>
            <a href="#1002" aria-current="true">
              #1002
            </a>
          </Table.Cell>
          <Table.Cell>Grace Hopper</Table.Cell>
          <Table.Cell align="right">$72.50</Table.Cell>
        </Table.Row>
        <Table.Row asLink>
          <Table.Cell>
            <a href="#1003">#1003</a>
          </Table.Cell>
          <Table.Cell>Alan Turing</Table.Cell>
          <Table.Cell align="right">$18.00</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  </div>
  <Card
    className="sm:col-span-2"
    title="Order #1002"
    toolbar={<Button variant="ghost" size="sm" icon={IconPencil} aria-label="Edit" />}
  >
    <PropertyList compact>
      <PropertyList.Item label="Customer" value="Grace Hopper" />
      <PropertyList.Item
        label="Status"
        value={
          <Badge variant="success" soft>
            Paid
          </Badge>
        }
      />
      <PropertyList.Item label="Placed" value="2026-09-20" />
      <PropertyList.Item label="Total" value="$72.50" numeric />
    </PropertyList>
  </Card>
</div>
```

### Nothing selected

**Example**

```html
<div class="grid w-full grid-cols-1 gap-4 sm:grid-cols-5">
  <div class="sm:col-span-3">
    <table class="table">
      <thead>
        <tr>
          <th>Order</th>
          <th>Customer</th>
        </tr>
      </thead>
      <tbody>
        <tr class="table-row-link">
          <td><a href="#1001">#1001</a></td>
          <td>Ada Lovelace</td>
        </tr>
        <tr class="table-row-link">
          <td><a href="#1002">#1002</a></td>
          <td>Grace Hopper</td>
        </tr>
      </tbody>
    </table>
  </div>
  <div class="card card-muted sm:col-span-2">
    <div class="card-body">
      <p class="card-description">Select an order to see its details.</p>
    </div>
  </div>
</div>
```

```tsx
<div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-5">
  <div className="sm:col-span-3">
    <Table>
      <Table.Head>
        <Table.Row>
          <Table.HeaderCell>Order</Table.HeaderCell>
          <Table.HeaderCell>Customer</Table.HeaderCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        <Table.Row asLink>
          <Table.Cell>
            <a href="#1001">#1001</a>
          </Table.Cell>
          <Table.Cell>Ada Lovelace</Table.Cell>
        </Table.Row>
        <Table.Row asLink>
          <Table.Cell>
            <a href="#1002">#1002</a>
          </Table.Cell>
          <Table.Cell>Grace Hopper</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  </div>
  <Card
    variant="muted"
    className="sm:col-span-2"
    description="Select an order to see its details."
  />
</div>
```

## Built from

[Table](../components/tables.md), [Card](../components/cards.md), [PropertyList](../components/property-list.md) and [Badge](../components/badges.md) in a [Grid](../components/grid.md), whose utilities vanilla pages load from the [utilities bundle](../getting-started/vanilla.md#utilities-optional). Selection is yours to wire: put `aria-current="true"` on the active row's link, which also tints the row (use `selected` / `[data-selected]` for a row without a link), and render that record in the detail pane. Below the `sm` breakpoint the pane stacks under the table.
