# @aortl/admin-css

Pre-built CSS for the admin design system. No Tailwind setup required to consume.

## Install

```fish
npm install @aortl/admin-css
```

Or grab it from a CDN — no install needed:

```html
<link rel="stylesheet" href="https://unpkg.com/@aortl/admin-css/dist/admin.min.css" />
```

## Use

```html
<button class="btn btn-primary">Save</button>
<button class="btn btn-ghost btn-sm">Cancel</button>

<input class="input input-bordered" placeholder="Name" />

<div class="card">
  <div class="card-body">
    <h3 class="card-title">Hello</h3>
    <p class="card-description">A small card.</p>
    <div class="card-actions">
      <button class="btn btn-primary btn-sm">OK</button>
    </div>
  </div>
</div>
```

## Components

| Class    | Variants                                                      | Sizes                    |
| -------- | ------------------------------------------------------------- | ------------------------ |
| `.btn`   | `.btn-primary`, `.btn-secondary`, `.btn-ghost`, `.btn-danger` | `.btn-sm`, `.btn-lg`     |
| `.input` | `.input-bordered`, `.input-ghost`, `.input-danger`            | `.input-sm`, `.input-lg` |
| `.card`  | `.card-bordered`, `.card-compact`                             | —                        |

The `card` component uses children: `.card-body`, `.card-title`, `.card-description`, `.card-actions`.

## Theming

Override any CSS variable in your own stylesheet:

```css
:root {
  --color-primary: oklch(0.6 0.2 30);
  --radius-control: 0.25rem;
}
```

See `src/theme.css` for the full list of tokens.

## Build

```fish
pnpm build       # generates dist/admin.css + dist/admin.min.css
pnpm dev         # watch mode
```
