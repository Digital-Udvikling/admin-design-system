# Page header

> Title a page with its trail, summary and actions.

## Examples

### With breadcrumbs and actions

**Example**

```html
<header class="flex w-full flex-col gap-3">
  <nav class="breadcrumbs" aria-label="Breadcrumb">
    <ol>
      <li><a class="breadcrumb-item" href="/">Sales</a></li>
      <li class="breadcrumb-separator" role="presentation" aria-hidden="true"></li>
      <li><span class="breadcrumb-item" aria-current="page">Customers</span></li>
    </ol>
  </nav>
  <div class="flex flex-wrap items-start justify-between gap-3">
    <div class="flex flex-col gap-2">
      <h1>Customers</h1>
      <p class="text-text-muted">Accounts billed through Nordic ERP.</p>
    </div>
    <div class="flex gap-2">
      <button class="btn btn-sm" type="button">
        <i class="ti ti-download" aria-hidden="true"></i>
        Export
      </button>
      <button class="btn btn-primary btn-sm" type="button">
        <i class="ti ti-plus" aria-hidden="true"></i>
        New customer
      </button>
    </div>
  </div>
</header>
```

```tsx
<header className="flex w-full flex-col gap-3">
  <Breadcrumbs>
    <Breadcrumbs.Item href="/">Sales</Breadcrumbs.Item>
    <Breadcrumbs.Item current>Customers</Breadcrumbs.Item>
  </Breadcrumbs>
  <div className="flex flex-wrap items-start justify-between gap-3">
    <div className="flex flex-col gap-2">
      <h1>Customers</h1>
      <p className="text-text-muted">Accounts billed through Nordic ERP.</p>
    </div>
    <div className="flex gap-2">
      <Button size="sm" icon={IconDownload}>
        Export
      </Button>
      <Button variant="primary" size="sm" icon={IconPlus}>
        New customer
      </Button>
    </div>
  </div>
</header>
```

`items-start` keeps the actions on the title's first line when a description is present. `gap-2` puts the same 8px between title and description as `.card-description` and `.dialog-description`.

## Built from

[Breadcrumbs](../components/breadcrumbs.md) and [Button](../components/buttons.md). The header uses [Row](../components/row.md) flex utilities and `text-text-muted`, which vanilla pages load from the [utilities bundle](../getting-started/vanilla.md#utilities-optional). Under the page title, [Section header](section-header.md) titles each list or table.
