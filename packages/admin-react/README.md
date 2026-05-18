# @aortl/admin-react

React component library for the admin design system. Renders the same class names as `@aortl/admin-css`, so vanilla HTML and React look identical.

## Install

```fish
npm install @aortl/admin-react react react-dom
```

## Use

```tsx
import "@aortl/admin-react/styles.css";
import { Button, Input, Card, CardBody, CardTitle, CardActions } from "@aortl/admin-react";

export function App() {
  return (
    <Card>
      <CardBody>
        <CardTitle>Sign in</CardTitle>
        <Input placeholder="Email" />
        <Input type="password" placeholder="Password" />
        <CardActions>
          <Button variant="primary">Sign in</Button>
          <Button variant="ghost">Cancel</Button>
        </CardActions>
      </CardBody>
    </Card>
  );
}
```

## Components

| Component                                    | Key props                                                                 |
| -------------------------------------------- | ------------------------------------------------------------------------- |
| `<Button />`                                 | `variant`: `primary` (default) `\|` `secondary` `\|` `ghost` `\|` `danger` <br/> `size`: `sm` `\|` `md` (default) `\|` `lg` <br/> `block`: boolean |
| `<Input />`                                  | `variant`: `bordered` (default) `\|` `ghost` `\|` `danger` <br/> `inputSize`: `sm` `\|` `md` (default) `\|` `lg` |
| `<Card />` + `CardBody / Title / Description / Actions` | `bordered`, `compact` (on `Card`)                                     |

> `inputSize` is intentionally named instead of `size` because `<input>` has its own native `size` attribute.

All components forward `ref`, accept `className` (merged with the design-system classes), and pass through standard HTML attributes.

## Build

```fish
pnpm build       # produces dist/index.{mjs,cjs}, dist/index.d.ts, dist/admin.css
```
