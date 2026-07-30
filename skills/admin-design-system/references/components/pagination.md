# Pagination

> Numbered page navigation with prev/next controls.

## Contents

- [Examples](#examples)
  - [Small range](#small-range)
  - [Large range with ellipses](#large-range-with-ellipses)
  - [Custom prev/next icons](#custom-prevnext-icons)
  - [Custom renderer (routing libraries)](#custom-renderer-routing-libraries)
- [Reference](#reference)
  - [React](#react)
  - [Vanilla](#vanilla)

## Examples

### Small range

**Example**

```html
<nav class="pagination" aria-label="Pagination">
  <ul>
    <li class="page-item">
      <button class="page-link" type="button" aria-label="Previous page" disabled>‹</button>
    </li>
    <li class="page-item">
      <button class="page-link active" type="button" aria-current="page" aria-label="Page 1">
        1
      </button>
    </li>
    <li class="page-item">
      <button class="page-link" type="button" aria-label="Page 2">2</button>
    </li>
    <li class="page-item">
      <button class="page-link" type="button" aria-label="Page 3">3</button>
    </li>
    <li class="page-item">
      <button class="page-link" type="button" aria-label="Next page">›</button>
    </li>
  </ul>
</nav>
```

```tsx
<Pagination page={1} total={3} onPageChange={() => {}} />
```

### Large range with ellipses

**Example**

```tsx
<Pagination page={10} total={50} onPageChange={() => {}} />
```

### Custom prev/next icons

**Example**

```html
<nav class="pagination" aria-label="Pagination">
  <ul>
    <li class="page-item">
      <button class="page-link" type="button" aria-label="Previous page">
        <i class="ti ti-arrow-left" aria-hidden="true"></i>
      </button>
    </li>
    <li class="page-item">
      <button class="page-link" type="button" aria-label="Page 1">1</button>
    </li>
    <li class="page-item">
      <button class="page-link active" type="button" aria-current="page" aria-label="Page 2">
        2
      </button>
    </li>
    <li class="page-item">
      <button class="page-link" type="button" aria-label="Page 3">3</button>
    </li>
    <li class="page-item">
      <button class="page-link" type="button" aria-label="Page 4">4</button>
    </li>
    <li class="page-item">
      <button class="page-link" type="button" aria-label="Page 5">5</button>
    </li>
    <li class="page-item">
      <button class="page-link" type="button" aria-label="Next page">
        <i class="ti ti-arrow-right" aria-hidden="true"></i>
      </button>
    </li>
  </ul>
</nav>
```

```tsx
<Pagination
  page={2}
  total={5}
  onPageChange={() => {}}
  previousIcon={IconArrowLeft}
  nextIcon={IconArrowRight}
/>
```

### Custom renderer (routing libraries)

```tsx
<Pagination
  page={2}
  total={5}
  onPageChange={() => {}}
  renderItem={(item) => {
    if (item.type === "page") {
      return (
        <a
          className={item.selected ? "page-link active" : "page-link"}
          aria-current={item.selected ? "page" : undefined}
          aria-label={`Page ${item.page}`}
          href={`?p=${item.page}`}
        >
          {item.page}
        </a>
      );
    }
    if (item.type === "ellipsis") {
      return (
        <span className="page-ellipsis" aria-hidden="true">
          …
        </span>
      );
    }
    const label = item.type === "previous" ? "‹" : "›";
    return (
      <a
        className="page-link"
        aria-label={item.type === "previous" ? "Previous page" : "Next page"}
        aria-disabled={item.disabled || undefined}
        href={item.disabled ? undefined : `?p=${item.page}`}
      >
        {label}
      </a>
    );
  }}
/>
```

## Reference

### React

| Prop            | Type                                          | Default        |
| --------------- | --------------------------------------------- | -------------- |
| `page`          | `number`                                      | — (required)   |
| `total`         | `number`                                      | — (required)   |
| `onPageChange`  | `(page: number) => void`                      | — (required)   |
| `siblingCount`  | `number`                                      | `1`            |
| `boundaryCount` | `number`                                      | `1`            |
| `previousIcon`  | [`IconProp`](../basics/conventions.md#icons) | chevron        |
| `nextIcon`      | [`IconProp`](../basics/conventions.md#icons) | chevron        |
| `renderItem`    | `(item: PaginationItem) => ReactNode`         | —              |
| `classNames`    | [slots](../basics/conventions.md#classnames) | —              |
| `aria-label`    | `string`                                      | `"Pagination"` |

Always controlled: `page` is 1-based and clamped into `[1, total]`, and the component never holds page state. `siblingCount` is how many pages flank the current one, `boundaryCount` how many stick to each end; a gap of exactly one page renders that page instead of an ellipsis. `classNames` covers `item`, `link`, `ellipsis`.

`renderItem` is called once per item and replaces the default `<button>`, the hook a routing library's `<Link>` needs. The four `item.type` values are `"page"`, `"previous"`, `"next"`, `"ellipsis"`. It must supply its own classes and ARIA, as above. `getPaginationItems` is exported separately if you want the range without the markup; it is pure and safe to call during render.

Plus native `<nav>` attributes.

### Vanilla

| Class           | Effect                                                                                          |
| --------------- | ----------------------------------------------------------------------------------------------- |
| `pagination`    | Root `<nav>`. Turns its direct `<ol>`/`<ul>` into an inline-flex row, `0.25rem` gap, no markers |
| `page-item`     | One `<li>`                                                                                      |
| `page-link`     | Page control: `2rem` square minimum, `0.375rem` radius, `text-sm`, transparent until hover      |
| `active`        | On a `page-link`, marks the current page — the same styling as `aria-current="page"`            |
| `page-ellipsis` | Muted `…` occupying the same `2rem` box                                                         |

`pagination` itself sets nothing — it exists to scope the list. `page-link` marks the current page from either `.active` or `aria-current="page"`; write `aria-current` for assistive tech and use `.active` only where you can't. It dims for both `[disabled]` and `[aria-disabled="true"]`, so an anchor that can't be a real `<button>` still reads as inactive. The React range logic has no vanilla equivalent — compute it server-side.
