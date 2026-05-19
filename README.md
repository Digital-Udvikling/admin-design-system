# @aortl/admin design system

### 📖 **[View the live docs →](https://digital-udvikling.github.io/admin-design-system/)**

A small, opinionated design system shipped in two flavors from a single source of truth.

| Package               | What it is                                                                                                                                |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `@aortl/admin-css`    | A pre-built CSS file. Drop it in via `<link>` and use semantic class names (`.btn`, `.input`, ...).                                       |
| `@aortl/admin-react`  | A React component library that renders the same class names as the CSS package.                                                           |
| `apps/docs` (private) | A [Starlight](https://starlight.astro.build) docs site that shows each component's vanilla and React source side-by-side via synced tabs. |

Components follow daisyUI's class-naming conventions (`.btn-primary`, `.btn-sm`, etc.) but are built from scratch on top of Tailwind v4 — no daisyUI runtime dependency.

## Quick start

```fish
pnpm install
pnpm build          # builds admin-css, admin-react, then docs
pnpm dev            # runs the docs site at http://localhost:4321
```

## Using the vanilla CSS in any HTML page

```html
<link rel="stylesheet" href="https://unpkg.com/@aortl/admin-css/dist/admin.min.css" />
<button class="btn btn-primary">Click me</button>
<input class="input input-bordered" placeholder="Name" />
```

## Using the React components

```tsx
import "@aortl/admin-react/styles.css";
import { Button, Input } from "@aortl/admin-react";

export function App() {
  return (
    <>
      <Button variant="primary">Click me</Button>
      <Input placeholder="Name" />
    </>
  );
}
```

## Repo layout

```
packages/
  admin-css/   — source of truth: Tailwind v4 + @theme tokens + component classes
  admin-react/ — thin React wrappers that emit the same class names
apps/
  docs/        — Starlight docs site, one page per component with synced vanilla/React tabs
```

## Adding a new component

1. Create `packages/admin-css/src/components/<name>.css`.
2. Add `@import "./<name>.css";` to `packages/admin-css/src/components/index.css`.
3. (Optional) Add `packages/admin-react/src/<Name>.tsx` and re-export from `src/index.ts`.
4. Add `apps/docs/src/content/docs/components/<name>.mdx` (use `Example` with both `html` and `react` props).
5. Register the new page in the `Components` sidebar group in `apps/docs/astro.config.mjs`.

No build-config changes needed.

## Releasing a package

Bump the `version` field in the package's `package.json`, commit, push to `main`. That's it — `.github/workflows/release.yml` picks it up, publishes to npm, and tags the commit.
