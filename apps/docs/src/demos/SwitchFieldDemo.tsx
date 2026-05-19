import { Field, Switch } from "@aortl/admin-react";

export function SwitchFieldDemo() {
  return (
    <Field name="notify" style={{ flexDirection: "row", alignItems: "center", gap: "0.75rem" }}>
      <Switch defaultChecked />
      <Field.Label>Email notifications</Field.Label>
    </Field>
  );
}
