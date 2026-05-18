import { Field, FieldDescription, FieldLabel, Input } from "@aortl/admin-react";

export function FieldEmailDemo() {
  return (
    <Field name="email">
      <FieldLabel>Email</FieldLabel>
      <Input type="email" placeholder="you@example.com" />
      <FieldDescription>We'll never share your email.</FieldDescription>
    </Field>
  );
}
