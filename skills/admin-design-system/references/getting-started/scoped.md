# Scoped bundle

> Drop admin components into a non-admin app without leaking styles.

A parallel bundle that wraps every rule in `@scope (.admin-root)`. Use it when you're embedding admin pieces — a settings menu, an internal toolbar — inside an app that owns its own design system. The wrapper element opts a subtree into admin styles; everything outside is left alone.

:::tip[Branding multiple apps]
Set `--color-system-accent` on `.admin-root` to brand-shift the navbar + footer stripes and `.brand-tile` for one system. See [Customize › System accent](../../basics/customize/#system-accent).
:::

The default bundle still ships unchanged. The scoped variant lives at separate subpaths so you load one or the other.

## Vanilla CSS

```html
<link rel="stylesheet" href="https://unpkg.com/@aortl/admin-css/dist/admin.scoped.min.css" />

<div class="admin-root">
  <button class="btn btn-primary">Save</button>
</div>
```

Via npm: import `@aortl/admin-css/admin.scoped.css` (or `.min.css`) from your bundler entry, then wrap admin markup in any element with `class="admin-root"`.

## React

```tsx
import "@aortl/admin-react/styles.scoped.css";
import { AdminRoot, Button } from "@aortl/admin-react";

export function ProductPageAdminMenu() {
  return (
    <AdminRoot>
      <Button variant="primary">Save</Button>
    </AdminRoot>
  );
}
```

`<AdminRoot>` is a thin `<div>` that emits `class="admin-root"` and forwards every prop, including `data-theme`, `style`, and `ref`. Use a plain `<div className="admin-root">` if you'd rather skip the wrapper component.

## Dark mode

`data-theme` works on the wrapper, not just on `<html>`:

```html
<div class="admin-root" data-theme="dark">
  <!-- always dark, regardless of the host page -->
</div>
```

The scope owns its own `color-scheme`, so the host's `:root` color scheme does not leak in. See [Dark mode](../../basics/dark-mode/) for the full picture.

## Host-page style isolation

The scoped bundle prepends `:scope, :scope * { all: revert-layer; }` inside the `@scope`. Unlayered host rules (e.g. a Bootstrap `.btn` or `body { font-family: ... }` rule on the host page) revert at the `.admin-root` boundary, falling through to admin's own layered cascade.

`revert-layer` — not `revert` — is deliberate: admin's preflight and component rules live in `@layer base/components/utilities`, so reverting only the unlayered layer neutralizes host styles while keeping admin intact.

Limits:

- The reset rule has the specificity of `:scope` (one pseudo-class). A host rule with higher specificity (e.g. `body .btn { ... }` or `.theme-foo .btn { ... }`) still wins. For hard isolation against arbitrary host CSS, use cascade layers in the host (`@layer host, admin;` with admin imported into `layer(admin)`) or a shadow root.
- The reset matches elements, not pseudo-elements. Host rules targeting `.foo::before` are not reverted.

## Caveats

- Tailwind utility classes in the scoped bundle only match inside `.admin-root`. If you want to author with admin's tokens or utilities directly across the host app, use the default unscoped bundle instead.
- `@scope` is Baseline-modern (Chrome, Firefox, Safari). There is no legacy fallback.
- Custom property registrations (`@property`), `@font-face`, and the cascade-layer order declaration stay at the document root — they're document-wide by spec. Everything else is scoped.
