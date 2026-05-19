import { Radio, RadioGroup } from "@aortl/admin-react";

const ROW = { display: "inline-flex", alignItems: "center", gap: "0.5rem" } as const;

export function RadioHorizontalDemo() {
  return (
    <RadioGroup name="size-horiz" defaultValue="md">
      <label htmlFor="size-horiz-sm" style={ROW}>
        <Radio id="size-horiz-sm" value="sm" /> Small
      </label>
      <label htmlFor="size-horiz-md" style={ROW}>
        <Radio id="size-horiz-md" value="md" /> Medium
      </label>
      <label htmlFor="size-horiz-lg" style={ROW}>
        <Radio id="size-horiz-lg" value="lg" /> Large
      </label>
    </RadioGroup>
  );
}

export function RadioVerticalDemo() {
  return (
    <RadioGroup name="plan-vert" orientation="vertical" defaultValue="free">
      <label htmlFor="plan-free" style={ROW}>
        <Radio id="plan-free" value="free" /> Free
      </label>
      <label htmlFor="plan-pro" style={ROW}>
        <Radio id="plan-pro" value="pro" /> Pro
      </label>
      <label htmlFor="plan-enterprise" style={ROW}>
        <Radio id="plan-enterprise" value="enterprise" /> Enterprise
      </label>
    </RadioGroup>
  );
}

export function RadioDisabledDemo() {
  return (
    <RadioGroup name="t-disabled" defaultValue="b" disabled>
      <label htmlFor="t-a" style={ROW}>
        <Radio id="t-a" value="a" /> Option A
      </label>
      <label htmlFor="t-b" style={ROW}>
        <Radio id="t-b" value="b" /> Option B
      </label>
    </RadioGroup>
  );
}
