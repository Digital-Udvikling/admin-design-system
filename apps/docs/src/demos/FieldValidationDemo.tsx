import { Field, FieldError, FieldLabel, Input } from "@aortl/admin-react";

export function FieldValidationDemo() {
  return (
    <Field name="username" validationMode="onChange">
      <FieldLabel>Username</FieldLabel>
      <Input required minLength={3} placeholder="At least 3 characters" />
      <FieldError match="valueMissing">Username is required.</FieldError>
      <FieldError match="tooShort">Must be at least 3 characters.</FieldError>
    </Field>
  );
}
