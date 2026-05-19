import { Checkbox, Field } from "@aortl/admin-react";

export function CheckboxFieldDemo() {
  return (
    <Field name="newsletter">
      <Field.Label style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
        <Checkbox />
        Subscribe to the newsletter
      </Field.Label>
      <Field.Description>One short email per month. Unsubscribe anytime.</Field.Description>
    </Field>
  );
}
