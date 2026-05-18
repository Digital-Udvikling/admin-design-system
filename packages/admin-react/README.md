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

## Components

| Component   | Parts                                                       | Key props                                                                                                                                          |
| ----------- | ----------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `<Button>`  | —                                                           | `variant`: `primary` (default) `\|` `secondary` `\|` `ghost` `\|` `danger` <br/> `size`: `sm` `\|` `md` (default) `\|` `lg` <br/> `block`: boolean |
| `<Input>`   | —                                                           | `variant`: `bordered` (default) `\|` `ghost` `\|` `danger` <br/> `inputSize`: `sm` `\|` `md` (default) `\|` `lg`                                  |
| `<Card>`    | `Card.Body`, `Card.Title`, `Card.Description`, `Card.Actions` | `bordered`, `compact` (on root)                                                                                                                    |
| `<Field>`   | `Field.Label`, `Field.Description`, `Field.Error`           | `name`, `validate`, `validationMode` (on root)                                                                                                     |

> `inputSize` is intentionally named instead of `size` because `<input>` has its own native `size` attribute.

All components forward `ref`, accept `className` (merged with the design-system classes), and pass through standard HTML attributes.

## Accessibility

`Button`, `Input`, and `Field` wrap [Base UI](https://base-ui.com) primitives:

- `Button` keeps focus when disabled (`focusableWhenDisabled` available), and can render as another element (`render` prop) while preserving keyboard semantics.
- `Input` auto-wires into `Field` for label/description/error association and validation state — without manual `id` / `aria-describedby` plumbing.
- `Field` handles HTML validation (`required`, `minLength`, `pattern`, ...) and surfaces matched errors via `<Field.Error match="..." />`.

```tsx
<Field name="email" validationMode="onBlur">
  <Field.Label>Email</Field.Label>
  <Input type="email" required />
  <Field.Description>We'll never share your email.</Field.Description>
  <Field.Error match="valueMissing">Email is required.</Field.Error>
  <Field.Error match="typeMismatch">Enter a valid email.</Field.Error>
</Field>
```

## Build

```fish
pnpm build       # produces dist/index.{mjs,cjs}, dist/index.d.ts, dist/admin.css
```
