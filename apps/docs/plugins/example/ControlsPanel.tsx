import { Input, Select, Switch } from "@aortl/admin-react";
import type { Dispatch, SetStateAction } from "react";

export type Control =
  | { name: string; type: "select"; options: string[]; default: string }
  | { name: string; type: "boolean"; default: boolean }
  | { name: string; type: "string"; default: string }
  | { name: string; type: "number"; default: number };

interface ControlsPanelProps {
  controls: Control[];
  value: Record<string, unknown>;
  onChange: Dispatch<SetStateAction<Record<string, unknown>>>;
}

export default function ControlsPanel({ controls, value, onChange }: ControlsPanelProps) {
  return (
    <div className="example-controls">
      {controls.map((c) => (
        <div key={c.name} className="example-control">
          <label className="example-control-label" htmlFor={`ctl-${c.name}`}>
            {c.name}
          </label>
          {renderControl(c, value, onChange)}
        </div>
      ))}
    </div>
  );
}

function renderControl(
  c: Control,
  value: Record<string, unknown>,
  onChange: Dispatch<SetStateAction<Record<string, unknown>>>,
) {
  const id = `ctl-${c.name}`;
  const set = (v: unknown) => onChange((prev) => ({ ...prev, [c.name]: v }));

  switch (c.type) {
    case "select":
      return (
        <Select value={value[c.name] as string} onValueChange={(v) => set(v)}>
          <Select.Trigger triggerSize="sm" id={id}>
            <Select.Value />
            <Select.Icon />
          </Select.Trigger>
          <Select.Popup>
            {c.options.map((opt) => (
              <Select.Item key={opt} value={opt}>
                <Select.ItemText>{opt}</Select.ItemText>
                <Select.ItemIndicator />
              </Select.Item>
            ))}
          </Select.Popup>
        </Select>
      );
    case "boolean":
      return (
        <Switch
          id={id}
          checked={value[c.name] as boolean}
          onCheckedChange={(checked) => set(checked)}
        />
      );
    case "string":
      return (
        <Input
          id={id}
          inputSize="sm"
          value={value[c.name] as string}
          onChange={(e) => set(e.target.value)}
        />
      );
    case "number":
      return (
        <Input
          id={id}
          type="number"
          inputSize="sm"
          value={String(value[c.name] ?? 0)}
          onChange={(e) => set(Number(e.target.value))}
        />
      );
  }
}
