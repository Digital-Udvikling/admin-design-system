# @aortl/admin-css

Pre-built CSS for the admin design system. No Tailwind setup required to consume.

[View on npm](https://www.npmjs.com/package/@aortl/admin-css) · [Docs](https://digital-udvikling.github.io/admin-design-system/)

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

## Build

```fish
pnpm build       # generates dist/admin.css + dist/admin.min.css
pnpm dev         # watch mode
```
