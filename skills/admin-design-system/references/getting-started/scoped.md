# Scoped bundle

> Drop admin styles into a non-admin app without colliding on class names.

A parallel CSS bundle prefixed `_ao-` and wrapped in `@scope (._ao-admin-root)`. Use it when admin markup lives inside a host app that owns its own design system.

The React library always ships this variant. The default `@aortl/admin-css` bundle stays unprefixed — use it for full-page admin apps that own the document.

:::tip[Branding multiple apps]
Set `--color-system-accent` on `._ao-admin-root` to brand-shift the navbar + footer stripes and `._ao-brand-tile` for one system. See [Customize › System accent](../../basics/customize/#system-accent).
:::

## Vanilla CSS

```html
<link rel="stylesheet" href="https://unpkg.com/@aortl/admin-css/dist/admin.scoped.min.css" />

<div class="_ao-admin-root">
  <button class="_ao-btn _ao-btn-primary">Save</button>
</div>
```

Via npm: import `@aortl/admin-css/admin.scoped.css` (or `.min.css`) from your bundler entry, then wrap admin markup in any element with `class="_ao-admin-root"`. Every admin class — `_ao-btn`, `_ao-card`, `_ao-input` — must carry the prefix.

## React

```tsx
import "@aortl/admin-react/styles.css";
import { AdminRoot, Button } from "@aortl/admin-react";

export function ProductPageAdminMenu() {
  return (
    <AdminRoot>
      <Button variant="primary">Save</Button>
    </AdminRoot>
  );
}
```

`@aortl/admin-react/styles.css` is the scoped+prefixed bundle — there is no unscoped variant. `<AdminRoot>` is required: it's a thin `<div>` that emits `class="_ao-admin-root"` and forwards every prop, including `data-theme`, `style`, and `ref`. A plain `<div className="_ao-admin-root">` works too, but you have to write the prefix yourself.

## Dark mode

`data-theme` works on the wrapper, not just on `<html>`:

```html
<div class="_ao-admin-root" data-theme="dark">
  <!-- always dark, regardless of the host page -->
</div>
```

The scope owns its own `color-scheme`, so the host's `:root` color scheme does not leak in. See [Dark mode](../../basics/dark-mode/) for the full picture.

## Host-page style isolation

The `_ao-` prefix is the primary isolation strategy: every admin class is namespaced, so a host page's `.btn` or `.card` rules can't reach admin elements. The `@scope` wrapper additionally pins admin's tokens and `color-scheme` to `._ao-admin-root`.

A host page's bare element rules (`h3 { … }`, `button { … }`) can still target admin descendants. The build sidesteps the common cases by emitting admin's CSS unlayered (Tailwind's `@layer` wrappers are stripped from the scoped bundle, since layered author rules lose to unlayered ones regardless of specificity) and bumping admin's element-tag resets with `:scope` so they outrank an untouched host stylesheet on specificity. For hard isolation against arbitrary host CSS, use cascade layers in the host (`@layer host, admin;`) or a shadow root.

## Caveats

- Admin classes only match inside `._ao-admin-root`. If you want admin's tokens or utilities to apply across the whole host app, use the default unscoped bundle.
- `@scope` is Baseline-modern (Chrome, Firefox, Safari). There is no legacy fallback.
