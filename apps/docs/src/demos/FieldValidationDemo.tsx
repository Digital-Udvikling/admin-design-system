import { Field, Input } from "@aortl/admin-react";

export function FieldValidationDemo() {
  return (
    <Field name="username" validationMode="onChange">
      <Field.Label>Username</Field.Label>
      <Input required minLength={3} placeholder="At least 3 characters" />
      <Field.Error match="valueMissing">Username is required.</Field.Error>
      <Field.Error match="tooShort">Must be at least 3 characters.</Field.Error>
    </Field>
  );
}
