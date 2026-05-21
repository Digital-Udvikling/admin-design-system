# Dark mode

> Follows the OS by default, with manual override per page or subtree.

Semantic tokens are declared once via `light-dark()` and dark mode flips them to Flexoki's [inverted ramp](https://stephango.com/flexoki) — `paper ↔ black`, `base-50 ↔ base-950`, accent `-600 ↔ -400`.

## How it switches

Mode is resolved from CSS `color-scheme` at `:root`:

| Selector               | `color-scheme` | When it wins             |
| ---------------------- | -------------- | ------------------------ |
| `:root`                | `light dark`   | default — follows the OS |
| `[data-theme="light"]` | `light`        | forces light             |
| `[data-theme="dark"]`  | `dark`         | forces dark              |

`color-scheme` also flips native form controls, scrollbars, and the page background before paint, so there's no flash on load.

## Force a mode

Set `data-theme` on `<html>` to override the OS preference:

```html
<html data-theme="dark">
  ...
</html>
<html data-theme="light">
  ...
</html>
```

## Scope to a subtree

The selector isn't scoped to `:root`, so any element can flip its own subtree — useful for a dark hero on an otherwise light page:

```html
<section data-theme="dark">
  <!-- everything inside renders in dark mode -->
</section>
```

## Tailwind `dark:` variant

The `dark:` variant fires under `prefers-color-scheme: dark` or inside `[data-theme="dark"]`, and is suppressed inside `[data-theme="light"]`:

```html
<div class="shadow-md dark:shadow-xl">...</div>
```
