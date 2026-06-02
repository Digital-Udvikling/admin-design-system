# Links

> Styled text links with an optional external affordance.

A plain `<a>` with the design system's link styling — link color, hover shift, underline, and a focus-visible ring.

## Examples

### Basic

**Example**

```html
<a class="link" href="#">View order</a>
```

```tsx
<Link href="#">View order</Link>
```

### With icon

Pass `icon` for a leading icon or `iconTrailing` for a trailing one. See [Icons](../basics/icons.md).

**Example**

```html
<a class="link" href="#"><i class="ti ti-home" aria-hidden="true"></i>Dashboard</a>
<a class="link" href="#">Export<i class="ti ti-download" aria-hidden="true"></i></a>
```

```tsx
<Link href="#" icon={IconHome}>
  Dashboard
</Link>
<Link href="#" iconTrailing={IconDownload}>
  Export
</Link>
```

### External

`external` renders a trailing ↗ (CSS-driven, so it ships in both bundles) and defaults `target="_blank"` + `rel="noopener noreferrer"`.

**Example**

```html
<a class="link link-external" href="https://example.com" target="_blank" rel="noopener noreferrer"
  >Open in inRiver</a
>
```

```tsx
<Link href="https://example.com" external>
  Open in inRiver
</Link>
```
