# @aortl/admin-react

React component library for the admin design system. Renders the same class names as [`@aortl/admin-css`](https://www.npmjs.com/package/@aortl/admin-css), so vanilla HTML and React look identical.

[View on npm](https://www.npmjs.com/package/@aortl/admin-react) · [Docs](https://digital-udvikling.github.io/admin-design-system/)

## Install

```fish
npm install @aortl/admin-react react react-dom
```

## Use

```tsx
import "@aortl/admin-react/styles.css";
import { AdminRoot, Button, Card, Input } from "@aortl/admin-react";

export function App() {
  return (
    <AdminRoot>
      <Card
        title="Sign in"
        actions={
          <>
            <Button variant="primary">Sign in</Button>
            <Button variant="ghost">Cancel</Button>
          </>
        }
      >
        <Input placeholder="Email" aria-label="Email" />
        <Input type="password" placeholder="Password" aria-label="Password" />
      </Card>
    </AdminRoot>
  );
}
```

`<AdminRoot>` is required: the stylesheet only matches inside it, and popups portal into it.

## Build

```fish
pnpm build       # produces ESM dist/*.js + dist/*.d.ts (one per module), dist/admin.scoped.css, dist/fonts/
```
