# Section header

> Title a list or table with a count and actions.

## Contents

- [Examples](#examples)
  - [Above a table](#above-a-table)
  - [Above a list](#above-a-list)
  - [Inside a card](#inside-a-card)
- [Built from](#built-from)

## Examples

### Above a table

**Example**

```html
<section class="flex w-full flex-col gap-3">
  <div class="flex flex-wrap items-center justify-between gap-3">
    <div class="flex items-center gap-2">
      <h2 class="text-lg font-semibold">Orders</h2>
      <span class="badge">128</span>
    </div>
    <div class="flex gap-2">
      <button class="btn btn-sm" type="button">
        <i class="ti ti-download" aria-hidden="true"></i>
        Export
      </button>
      <button class="btn btn-primary btn-sm" type="button">
        <i class="ti ti-plus" aria-hidden="true"></i>
        New order
      </button>
    </div>
  </div>
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
        <td>#1001</td>
        <td>Ada Lovelace</td>
        <td data-align="right">$129.00</td>
      </tr>
      <tr>
        <td>#1002</td>
        <td>Grace Hopper</td>
        <td data-align="right">$72.50</td>
      </tr>
    </tbody>
  </table>
</section>
```

```tsx
<section className="flex w-full flex-col gap-3">
  <div className="flex flex-wrap items-center justify-between gap-3">
    <div className="flex items-center gap-2">
      <h2 className="text-lg font-semibold">Orders</h2>
      <Badge>128</Badge>
    </div>
    <div className="flex gap-2">
      <Button size="sm" icon={IconDownload}>
        Export
      </Button>
      <Button variant="primary" size="sm" icon={IconPlus}>
        New order
      </Button>
    </div>
  </div>
  <Table>
    <Table.Head>
      <Table.Row>
        <Table.HeaderCell>Order</Table.HeaderCell>
        <Table.HeaderCell>Customer</Table.HeaderCell>
        <Table.HeaderCell align="right">Total</Table.HeaderCell>
      </Table.Row>
    </Table.Head>
    <Table.Body>
      <Table.Row>
        <Table.Cell>#1001</Table.Cell>
        <Table.Cell>Ada Lovelace</Table.Cell>
        <Table.Cell align="right">$129.00</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>#1002</Table.Cell>
        <Table.Cell>Grace Hopper</Table.Cell>
        <Table.Cell align="right">$72.50</Table.Cell>
      </Table.Row>
    </Table.Body>
  </Table>
</section>
```

### Above a list

**Example**

```html
<section class="flex w-full flex-col gap-3">
  <div class="flex flex-wrap items-center justify-between gap-3">
    <div class="flex items-center gap-2">
      <h2 class="text-lg font-semibold">Team members</h2>
      <span class="badge">2</span>
    </div>
    <button class="btn btn-primary btn-sm" type="button">
      <i class="ti ti-plus" aria-hidden="true"></i>
      Invite
    </button>
  </div>
  <div class="item-group item-group-bordered">
    <div class="item">
      <div class="item-media"><span class="avatar avatar-sm">AL</span></div>
      <div class="item-content">
        <div class="item-title">Ada Lovelace</div>
        <div class="item-description">Admin · ada@example.com</div>
      </div>
    </div>
    <div class="item">
      <div class="item-media"><span class="avatar avatar-sm">GH</span></div>
      <div class="item-content">
        <div class="item-title">Grace Hopper</div>
        <div class="item-description">Editor · grace@example.com</div>
      </div>
    </div>
  </div>
</section>
```

```tsx
<section className="flex w-full flex-col gap-3">
  <div className="flex flex-wrap items-center justify-between gap-3">
    <div className="flex items-center gap-2">
      <h2 className="text-lg font-semibold">Team members</h2>
      <Badge>2</Badge>
    </div>
    <Button variant="primary" size="sm" icon={IconPlus}>
      Invite
    </Button>
  </div>
  <ItemGroup bordered>
    <Item
      media={<Avatar initials="AL" size="sm" />}
      title="Ada Lovelace"
      description="Admin · ada@example.com"
    />
    <Item
      media={<Avatar initials="GH" size="sm" />}
      title="Grace Hopper"
      description="Editor · grace@example.com"
    />
  </ItemGroup>
</section>
```

### Inside a card

**Example**

```html
<div class="card">
  <div class="card-body">
    <div class="card-header">
      <h3 class="card-title">
        Webhooks
        <span class="badge badge-sm">2</span>
      </h3>
      <div class="card-toolbar">
        <button class="btn btn-sm" type="button">Add webhook</button>
      </div>
    </div>
    <div class="item-group item-group-bordered">
      <div class="item">
        <div class="item-content">
          <div class="item-title">https://erp.example.com/hooks/orders</div>
          <div class="item-description">order.created, order.paid</div>
        </div>
      </div>
      <div class="item">
        <div class="item-content">
          <div class="item-title">https://chat.example.com/hooks/ops</div>
          <div class="item-description">order.failed</div>
        </div>
      </div>
    </div>
  </div>
</div>
```

```tsx
<Card
  title={
    <>
      Webhooks <Badge size="sm">2</Badge>
    </>
  }
  toolbar={<Button size="sm">Add webhook</Button>}
>
  <ItemGroup bordered>
    <Item title="https://erp.example.com/hooks/orders" description="order.created, order.paid" />
    <Item title="https://chat.example.com/hooks/ops" description="order.failed" />
  </ItemGroup>
</Card>
```

## Built from

[Badge](../components/badges.md), [Button](../components/buttons.md), [Table](../components/tables.md), [List](../components/list.md) and [Card](../components/cards.md). Outside a card the header row uses [Row](../components/row.md) flex utilities, which vanilla pages load from the [utilities bundle](../getting-started/vanilla.md#utilities-optional). On a paginated list the badge shows the total count.
