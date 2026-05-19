import { Field, Select } from "@aortl/admin-react";

export function SelectDefaultDemo() {
  return (
    <Select name="status">
      <Select.Trigger>
        <Select.Value placeholder="Select a status…" />
        <Select.Icon />
      </Select.Trigger>
      <Select.Popup>
        <Select.Item value="open">
          Open
          <Select.ItemIndicator />
        </Select.Item>
        <Select.Item value="in-progress">
          In progress
          <Select.ItemIndicator />
        </Select.Item>
        <Select.Item value="closed">
          Closed
          <Select.ItemIndicator />
        </Select.Item>
      </Select.Popup>
    </Select>
  );
}

export function SelectSizesDemo() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
        width: "100%",
      }}
    >
      <Select defaultValue="sm">
        <Select.Trigger triggerSize="sm">
          <Select.Value />
          <Select.Icon />
        </Select.Trigger>
        <Select.Popup>
          <Select.Item value="sm">Small</Select.Item>
          <Select.Item value="md">Medium</Select.Item>
          <Select.Item value="lg">Large</Select.Item>
        </Select.Popup>
      </Select>
      <Select defaultValue="md">
        <Select.Trigger>
          <Select.Value />
          <Select.Icon />
        </Select.Trigger>
        <Select.Popup>
          <Select.Item value="sm">Small</Select.Item>
          <Select.Item value="md">Medium</Select.Item>
          <Select.Item value="lg">Large</Select.Item>
        </Select.Popup>
      </Select>
      <Select defaultValue="lg">
        <Select.Trigger triggerSize="lg">
          <Select.Value />
          <Select.Icon />
        </Select.Trigger>
        <Select.Popup>
          <Select.Item value="sm">Small</Select.Item>
          <Select.Item value="md">Medium</Select.Item>
          <Select.Item value="lg">Large</Select.Item>
        </Select.Popup>
      </Select>
    </div>
  );
}

export function SelectGroupsDemo() {
  return (
    <Select>
      <Select.Trigger>
        <Select.Value placeholder="Pick one…" />
        <Select.Icon />
      </Select.Trigger>
      <Select.Popup>
        <Select.Group>
          <Select.GroupLabel>Fruit</Select.GroupLabel>
          <Select.Item value="apple">
            Apple
            <Select.ItemIndicator />
          </Select.Item>
          <Select.Item value="banana">
            Banana
            <Select.ItemIndicator />
          </Select.Item>
        </Select.Group>
        <Select.Group>
          <Select.GroupLabel>Veg</Select.GroupLabel>
          <Select.Item value="carrot">
            Carrot
            <Select.ItemIndicator />
          </Select.Item>
          <Select.Item value="daikon">
            Daikon
            <Select.ItemIndicator />
          </Select.Item>
        </Select.Group>
      </Select.Popup>
    </Select>
  );
}

export function SelectDisabledDemo() {
  return (
    <Select disabled defaultValue="x">
      <Select.Trigger>
        <Select.Value />
        <Select.Icon />
      </Select.Trigger>
      <Select.Popup>
        <Select.Item value="x">Disabled</Select.Item>
      </Select.Popup>
    </Select>
  );
}

export function SelectFieldDemo() {
  return (
    <Field name="role">
      <Field.Label>Role</Field.Label>
      <Select required>
        <Select.Trigger>
          <Select.Value placeholder="Pick a role…" />
          <Select.Icon />
        </Select.Trigger>
        <Select.Popup>
          <Select.Item value="admin">
            Admin
            <Select.ItemIndicator />
          </Select.Item>
          <Select.Item value="member">
            Member
            <Select.ItemIndicator />
          </Select.Item>
        </Select.Popup>
      </Select>
      <Field.Error match="valueMissing">Pick a role.</Field.Error>
    </Field>
  );
}
