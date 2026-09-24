# Empty, loading and error states

> Fill a panel or table while its data is missing.

## Contents

- [Examples](#examples)
  - [Empty panel](#empty-panel)
  - [Empty table](#empty-table)
  - [Loading panel](#loading-panel)
  - [Loading table](#loading-table)
  - [Failed fetch](#failed-fetch)
- [Built from](#built-from)

## Examples

### Empty panel

**Example**

```html
<div class="card">
  <div class="card-body">
    <h3 class="card-title">Webhooks</h3>
    <p class="card-description">No webhooks yet. Add one to post order changes to your endpoint.</p>
    <div class="card-actions">
      <button class="btn btn-primary btn-sm" type="button">
        <i class="ti ti-plus" aria-hidden="true"></i>
        Add webhook
      </button>
    </div>
  </div>
</div>
```

```tsx
<Card
  title="Webhooks"
  description="No webhooks yet. Add one to post order changes to your endpoint."
  actions={
    <Button variant="primary" size="sm" icon={IconPlus}>
      Add webhook
    </Button>
  }
/>
```

### Empty table

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

### Loading panel

**Example**

```html
<div class="card">
  <div class="card-body">
    <h3 class="card-title">Recent orders</h3>
    <output class="spinner" aria-label="Loading orders"></output>
  </div>
</div>
```

```tsx
<Card title="Recent orders">
  <Spinner label="Loading orders" />
</Card>
```

### Loading table

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
      <td class="table-empty" colspan="3">
        <output class="spinner" aria-label="Loading orders"></output>
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
    </Table.Row>
  </Table.Head>
  <Table.Body>
    <Table.Empty colSpan={3}>
      <Spinner label="Loading orders" />
    </Table.Empty>
  </Table.Body>
</Table>
```

### Failed fetch

**Example**

```html
<div class="card">
  <div class="card-body">
    <h3 class="card-title">Recent orders</h3>
    <div class="alert alert-danger" role="alert">
      <i class="ti ti-alert-octagon" aria-hidden="true"></i>
      <strong class="alert-title">Couldn't load orders</strong>
      <p class="alert-description">The server returned 503 Service Unavailable.</p>
      <div class="alert-action">
        <button class="btn btn-sm" type="button">
          <i class="ti ti-refresh" aria-hidden="true"></i>
          Retry
        </button>
      </div>
    </div>
  </div>
</div>
```

```tsx
<Card title="Recent orders">
  <Alert
    variant="danger"
    icon={IconAlertOctagon}
    title="Couldn't load orders"
    description="The server returned 503 Service Unavailable."
    action={
      <Button size="sm" icon={IconRefresh}>
        Retry
      </Button>
    }
  />
</Card>
```

## Built from

[Card](../components/cards.md), [Table](../components/tables.md), [Spinner](../components/spinners.md), [Alert](../components/alerts.md) and [Button](../components/buttons.md). Keep the panel title and table header in place across the states and swap only the body.
