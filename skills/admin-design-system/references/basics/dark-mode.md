# Dark mode

> Follows the OS by default, with manual override per page or subtree.

## How it switches

Mode is resolved from CSS `color-scheme` at `:root`:

| Selector               | `color-scheme` | When it wins             |
| ---------------------- | -------------- | ------------------------ |
| `:root`                | `light dark`   | default — follows the OS |
| `[data-theme="light"]` | `light`        | forces light             |
| `[data-theme="dark"]`  | `dark`         | forces dark              |

`color-scheme` also flips native form controls, scrollbars, and the page background before paint, avoiding a flash on load.

## Force a mode

Set `data-theme` on `<html>` to override the OS preference:

```html
<!-- swap to data-theme="light" to force light -->
<html data-theme="dark">
  ...
</html>
```

## Scope to a subtree

The selector isn't scoped to `:root`, so any element can flip its own subtree:

```html
<section data-theme="dark">
  <!-- everything inside renders in dark mode -->
</section>
```

In React, `<AdminRoot>` accepts a typed `theme` prop that sets `data-theme` for you:

```tsx
<AdminRoot theme="dark">{/* ... */}</AdminRoot>
```

## Tailwind `dark:` variant

The `dark:` variant fires under `prefers-color-scheme: dark` or inside `[data-theme="dark"]`, and is suppressed inside `[data-theme="light"]`:

```html
<div class="shadow-md dark:shadow-xl">...</div>
```
