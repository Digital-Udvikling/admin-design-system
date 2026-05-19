# @aortl/admin design system

### 📖 **[View the live docs →](https://digital-udvikling.github.io/admin-design-system/)**

A small, opinionated design system shipped in two flavors from a single source of truth. Built for internal admin tooling — dashboards, CRMs, ops consoles — where information density and operator UX matter more than marketing polish.

| Package               | What it is                                                                                                                                |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `@aortl/admin-css`    | A pre-built CSS file. Drop it in via `<link>` and use semantic class names (`.btn`, `.input`, ...).                                       |
| `@aortl/admin-react`  | A React component library that renders the same class names as the CSS package.                                                           |
| `apps/docs`           | A [Starlight](https://starlight.astro.build) docs site that shows each component's vanilla and React source side-by-side via synced tabs. |

## Quick start

```fish
pnpm install
pnpm build          # builds admin-css, admin-react, then docs
pnpm dev            # runs the docs site at http://localhost:4321 in watch mode
```

## Adding a new component

1. Create `packages/admin-css/src/components/<name>.css`.
2. Add `@import "./<name>.css";` to `packages/admin-css/src/components/index.css`.
3. (Optional) Add `packages/admin-react/src/<Name>.tsx` and re-export from `src/index.ts`.
4. Add `apps/docs/src/content/docs/components/<name>.mdx` (use `Example` with both `html` and `react` props).

No build-config changes needed.

## Releasing a package

Bump the `version` field in the package's `package.json`, commit, push to `main`. That's it — `.github/workflows/release.yml` picks it up, publishes to npm, and tags the commit.
