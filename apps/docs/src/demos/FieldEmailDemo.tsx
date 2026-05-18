import { Field, Input } from "@aortl/admin-react";

export function FieldEmailDemo() {
  return (
    <Field name="email">
      <Field.Label>Email</Field.Label>
      <Input type="email" placeholder="you@example.com" />
      <Field.Description>We'll never share your email.</Field.Description>
    </Field>
  );
}
