# Stability

> What semver covers, and the supported browsers.

Both packages share one version and follow [semver](https://semver.org/). A major release is the only one that renames or removes something below; the [changelog](../../changelog/) marks those entries **Breaking**.

## Covered by semver

- Class names in both bundles, including the `_ao-` prefix and the `._ao-admin-root` scope.
- `data-*` and ARIA hooks the CSS styles from, such as `data-collapsed`, `data-align` and `aria-current="page"`.
- React exports: components, their parts, props and prop values, hooks and exported types.
- Token names (`--color-primary`, `--color-blue-600`, `--font-sans`) and the custom properties a page documents (`--chart-value`, `--sidebar-width`, `--surface-current`, `--z-popup`).
- Package entry points: `admin.css`, `admin.scoped.css`, `admin.utilities.css` and their `.min.css` builds, `theme.css`, `components.css`, `fonts.css`, and `@aortl/admin-react/styles.css`.

## Not covered

- Token values and visual metrics: colours, heights, spacing, radii and shadows change in minor releases, with a changelog entry.
- DOM structure beyond the classes and attributes above, such as wrapper elements React renders.
- Custom properties that start with `--_` (`--_btn-hover`). They connect admin's own rules and can change in any release.
- Files under `dist/` or `src/` that no entry point names.

Pin an exact version when a visual change must not reach production unreviewed. A CDN link without a version, such as `https://unpkg.com/@aortl/admin-css/dist/admin.min.css`, picks up every release, majors included.

## Browsers

The current and previous major versions of Chrome, Edge, Firefox and Safari. There are no polyfills and no fallbacks for older engines.

| Feature                                    | Used for                                       | Oldest versions                      |
| ------------------------------------------ | ---------------------------------------------- | ------------------------------------ |
| `@scope`                                   | The scoped bundle and `@aortl/admin-react`     | Chrome 118, Firefox 146, Safari 26.4 |
| Invoker commands (`commandfor`, `command`) | Opening vanilla dialogs and drawers without JS | Chrome 135, Firefox 144, Safari 26.2 |

The page still works without these:

- `closedby` on `<dialog>`: Safari doesn't support it yet, so a vanilla `closedby="any"` dialog closes on Esc but not on a backdrop click. The React `Dialog` and `Drawer` handle the click themselves where the attribute is missing.
- `interpolate-size` animates accordion and sidebar group heights; without it they open without the transition.
- `field-sizing: content` grows `textarea-autosize` with its content; without it the textarea keeps its fixed, resizable box.
- Typed `attr()` sets an autosize textarea's minimum height from `rows`; without it the size's own minimum applies.
