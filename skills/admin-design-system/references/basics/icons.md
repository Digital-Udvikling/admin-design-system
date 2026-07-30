# Icons

> Tabler Icons — webfont for vanilla, typed components for React.

## Contents

- [Install](#install)
  - [Vanilla — webfont](#vanilla-webfont)
  - [React — components](#react-components)
- [Vanilla usage](#vanilla-usage)
- [React usage](#react-usage)
- [Sizing](#sizing)
- [Accessibility](#accessibility)
- [Substituting your own set](#substituting-your-own-set)

The recommended icon library is [Tabler Icons](https://tabler.io/icons). Each icon's name maps to `ti-{name}` for the webfont and `Icon{Name}` for React. Neither admin package depends on it — both are optional installs.

## Install

### Vanilla — webfont

Drops in without a bundler. Pin a version (e.g. `@3.44.0`) for production:

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/dist/tabler-icons.min.css"
/>
```

With an existing CSS pipeline, install the package and `@import` it instead:

```bash
npm install @tabler/icons-webfont
```

```css
@import "@tabler/icons-webfont/dist/tabler-icons.min.css";
```

### React — components

```bash
npm install @tabler/icons-react
```

Pass the component to any `icon` prop; the wrapper sizes it and marks it `aria-hidden`. See [Conventions › Icons](conventions.md#icons) for the prop contract.

## Vanilla usage

**Example**

```html
<i class="ti ti-home"></i>
<i class="ti ti-search"></i>
<i class="ti ti-settings"></i>
<i class="ti ti-user"></i>
<i class="ti ti-trash"></i>
```

```tsx
<IconHome />
<IconSearch />
<IconSettings />
<IconUser />
<IconTrash />
```

Icons inherit `color` and `font-size` from their parent.

**Example**

```html
<button class="btn btn-primary">
  <i class="ti ti-plus" aria-hidden="true"></i>
  New order
</button>
<button class="btn">
  <i class="ti ti-pencil" aria-hidden="true"></i>
  Edit
</button>
<button class="btn btn-danger">
  <i class="ti ti-trash" aria-hidden="true"></i>
  Delete
</button>
```

```tsx
<Button variant="primary" icon={IconPlus}>
  New order
</Button>
<Button icon={IconPencil}>
  Edit
</Button>
<Button variant="danger" icon={IconTrash}>
  Delete
</Button>
```

## React usage

```tsx
import { IconHome, IconSearch } from "@tabler/icons-react";
```

Components forward standard SVG props plus:

| Prop     | Default        | What it does                       |
| -------- | -------------- | ---------------------------------- |
| `size`   | `24`           | Width and height in pixels.        |
| `stroke` | `2`            | Stroke width (try `1.5` for thin). |
| `color`  | `currentColor` | Stroke color.                      |

**Example**

```tsx
<IconChevronDown size={16} />
<IconChevronDown size={24} />
<IconChevronDown size={32} stroke={1.5} />
```

## Sizing

Tabler's natural size is `24`; admin chrome uses smaller sizes:

| Context                                      | Size |
| -------------------------------------------- | ---- |
| Inline next to text (button label, menu row) | `16` |
| Icon-only button or large action             | `20` |
| Dense table rows or compact toolbars         | `14` |

## Accessibility

Icons next to a text label are decorative — React `icon` props set `aria-hidden` for you; in vanilla HTML, add it yourself:

```html
<button class="btn btn-primary">
  <i class="ti ti-plus" aria-hidden="true"></i>
  Add product
</button>
```

When an icon is the only content, give the surrounding element an accessible name:

**Example**

```html
<button class="btn btn-ghost" aria-label="Delete row">
  <i class="ti ti-trash" aria-hidden="true"></i>
</button>
```

```tsx
<Button variant="ghost" icon={IconTrash} aria-label="Delete row" />
```

## Substituting your own set

Icon slots accept any element. Use another set (Phosphor, Heroicons) or your own SVG the same way.
