import { Field, Textarea } from "@aortl/admin-react";

export function TextareaFieldDemo() {
  return (
    <Field name="notes">
      <Field.Label>Notes</Field.Label>
      <Textarea placeholder="Anything you'd like to share" />
      <Field.Description>Markdown is supported.</Field.Description>
    </Field>
  );
}
