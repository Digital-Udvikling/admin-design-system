# @aortl/admin-react

React component library for the admin design system. Renders the same class names as `@aortl/admin-css`, so vanilla HTML and React look identical.

## Install

```fish
npm install @aortl/admin-react react react-dom
```

## Use

```tsx
import "@aortl/admin-react/styles.css";
import { Button, Card, Input } from "@aortl/admin-react";

export function App() {
  return (
    <Card>
      <Card.Body>
        <Card.Title>Sign in</Card.Title>
        <Input placeholder="Email" />
        <Input type="password" placeholder="Password" />
        <Card.Actions>
          <Button variant="primary">Sign in</Button>
          <Button variant="ghost">Cancel</Button>
        </Card.Actions>
      </Card.Body>
    </Card>
  );
}
```

## Build

```fish
pnpm build       # produces dist/index.{mjs,cjs}, dist/index.d.ts, dist/admin.css
```
