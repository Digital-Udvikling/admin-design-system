# Breadcrumbs

> Trail of links to ancestor pages, ending in the current page.

## Contents

- [Examples](#examples)
  - [Basic](#basic)
  - [With a chevron separator](#with-a-chevron-separator)
  - [Deep paths](#deep-paths)
- [Reference](#reference)
  - [React](#react)
  - [Vanilla](#vanilla)

## Examples

### Basic

**Example**

```html
<nav class="breadcrumbs" aria-label="Breadcrumb">
  <ol>
    <li><a class="breadcrumb-item" href="/">Home</a></li>
    <li class="breadcrumb-separator" role="presentation" aria-hidden="true"></li>
    <li><a class="breadcrumb-item" href="/users">Users</a></li>
    <li class="breadcrumb-separator" role="presentation" aria-hidden="true"></li>
    <li><span class="breadcrumb-item" aria-current="page">Detail</span></li>
  </ol>
</nav>
```

```tsx
<Breadcrumbs>
  <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
  <Breadcrumbs.Item href="/users">Users</Breadcrumbs.Item>
  <Breadcrumbs.Item current>Detail</Breadcrumbs.Item>
</Breadcrumbs>
```

### With a chevron separator

**Example**

```html
<nav class="breadcrumbs" aria-label="Breadcrumb">
  <ol>
    <li>
      <a class="breadcrumb-item" href="/">
        <i class="ti ti-home" aria-hidden="true"></i>
        Home
      </a>
    </li>
    <li class="breadcrumb-separator" role="presentation" aria-hidden="true">
      <i class="ti ti-chevron-right" aria-hidden="true"></i>
    </li>
    <li><a class="breadcrumb-item" href="/users">Users</a></li>
    <li class="breadcrumb-separator" role="presentation" aria-hidden="true">
      <i class="ti ti-chevron-right" aria-hidden="true"></i>
    </li>
    <li><span class="breadcrumb-item" aria-current="page">Detail</span></li>
  </ol>
</nav>
```

```tsx
<Breadcrumbs separator={<IconChevronRight size={14} />}>
  <Breadcrumbs.Item href="/" icon={IconHome}>
    Home
  </Breadcrumbs.Item>
  <Breadcrumbs.Item href="/users">Users</Breadcrumbs.Item>
  <Breadcrumbs.Item current>Detail</Breadcrumbs.Item>
</Breadcrumbs>
```

### Deep paths

**Example**

```html
<nav class="breadcrumbs" aria-label="Breadcrumb">
  <ol>
    <li><a class="breadcrumb-item" href="/">Home</a></li>
    <li class="breadcrumb-separator" role="presentation" aria-hidden="true"></li>
    <li><a class="breadcrumb-item" href="/orgs">Organisations</a></li>
    <li class="breadcrumb-separator" role="presentation" aria-hidden="true"></li>
    <li><a class="breadcrumb-item" href="/orgs/acme">Acme Inc.</a></li>
    <li class="breadcrumb-separator" role="presentation" aria-hidden="true"></li>
    <li><a class="breadcrumb-item" href="/orgs/acme/projects">Projects</a></li>
    <li class="breadcrumb-separator" role="presentation" aria-hidden="true"></li>
    <li><a class="breadcrumb-item" href="/orgs/acme/projects/123">Q3 launch</a></li>
    <li class="breadcrumb-separator" role="presentation" aria-hidden="true"></li>
    <li><span class="breadcrumb-item" aria-current="page">Settings</span></li>
  </ol>
</nav>
```

```tsx
<Breadcrumbs>
  <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
  <Breadcrumbs.Item href="/orgs">Organisations</Breadcrumbs.Item>
  <Breadcrumbs.Item href="/orgs/acme">Acme Inc.</Breadcrumbs.Item>
  <Breadcrumbs.Item href="/orgs/acme/projects">Projects</Breadcrumbs.Item>
  <Breadcrumbs.Item href="/orgs/acme/projects/123">Q3 launch</Breadcrumbs.Item>
  <Breadcrumbs.Item current>Settings</Breadcrumbs.Item>
</Breadcrumbs>
```

## Reference

### React

| Part                    | Renders                                                | Class                  |
| ----------------------- | ------------------------------------------------------ | ---------------------- |
| `Breadcrumbs`           | `<nav>` wrapping an `<ol>`                             | `breadcrumbs`          |
| `Breadcrumbs.Item`      | `<li>` + `<a>`, or `<li>` + `<span>` without an `href` | `breadcrumb-item`      |
| `Breadcrumbs.Separator` | `<li role="presentation" aria-hidden>`                 | `breadcrumb-separator` |

| Part               | Prop         | Type                                          | Default        |
| ------------------ | ------------ | --------------------------------------------- | -------------- |
| `Breadcrumbs`      | `separator`  | `ReactNode`                                   | —              |
| `Breadcrumbs`      | `aria-label` | `string`                                      | `"Breadcrumb"` |
| `Breadcrumbs.Item` | `href`       | `string`                                      | —              |
| `Breadcrumbs.Item` | `current`    | `boolean`                                     | `false`        |
| `Breadcrumbs.Item` | `icon`       | [`IconProp`](../basics/conventions.md#icons) | —              |

The root inserts a `Separator` between every pair of children, so you never write one by hand — pass `separator` to change the glyph. Omitting `href` renders a `<span>`, correct for the last entry; `current` adds `aria-current="page"` independently, so set both on an entry that is a link and the current page. `Item` takes the native attributes of whichever element it renders.

### Vanilla

| Class                  | Effect                                                                                                |
| ---------------------- | ----------------------------------------------------------------------------------------------------- |
| `breadcrumbs`          | Root `<nav>`: `text-sm`, muted. Its direct `<ol>` becomes an inline-flex wrapping row, `0.375rem` gap |
| `breadcrumb-item`      | One entry, `0.375rem` gap for a leading icon, muted until hover                                       |
| `breadcrumb-separator` | Renders `/` when empty; a child `<i>`/`<svg>` replaces it, sized `0.875rem`                           |

Write `aria-label="Breadcrumb"` on the `<nav>`, `aria-current="page"` on the final entry — which also turns off its pointer events — and `role="presentation" aria-hidden="true"` on each separator so it stays out of the list semantics. Long trails wrap onto a second line.
