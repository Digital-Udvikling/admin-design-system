# Pagination

> Numbered page navigation with prev/next controls.

The CSS only styles the parts (`.pagination`, `.page-link`, `.page-ellipsis`). The React component computes the visible range from `page`, `total`, and `onPageChange` — always controlled.

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

`siblingCount` (default `1`) controls how many pages flank the current page; `boundaryCount` (default `1`) controls how many pages stick to each end.

**Example**

```tsx
<Pagination page={10} total={50} onPageChange={() => {}} />
```

### Custom prev/next icons

Pass any icon component or pre-rendered element via `previousIcon` / `nextIcon`. Defaults to built-in chevrons.

**Example**

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

`renderItem` is called once per item (`"page"`, `"previous"`, `"next"`, `"ellipsis"`) — use it to render router `<Link>` components so prev/next/numbers are real anchors.

```tsx
<Pagination
  page={2}
  total={5}
  onPageChange={() => {}}
  renderItem={(item) => {
    if (item.type === "page") {
      return (
        <a className={item.selected ? "page-link active" : "page-link"} href={`?p=${item.page}`}>
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
        aria-disabled={item.disabled || undefined}
        href={item.disabled ? undefined : `?p=${item.page}`}
      >
        {label}
      </a>
    );
  }}
/>
```
