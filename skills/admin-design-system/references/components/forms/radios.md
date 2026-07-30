# Radios

> Mutually exclusive choice within a group.

## Contents

- [Examples](#examples)
  - [Group](#group)
  - [Vertical](#vertical)
  - [Disabled](#disabled)
- [Reference](#reference)
  - [React](#react)
  - [Vanilla](#vanilla)

## Examples

### Group

**Example**

```html
<div class="radio-group" role="radiogroup">
  <label> <input type="radio" name="size" value="sm" class="radio" /> Small </label>
  <label> <input type="radio" name="size" value="md" class="radio" checked /> Medium </label>
  <label> <input type="radio" name="size" value="lg" class="radio" /> Large </label>
</div>
```

```tsx
<RadioGroup name="size" defaultValue="md">
  <label>
    <Radio value="sm" /> Small
  </label>
  <label>
    <Radio value="md" /> Medium
  </label>
  <label>
    <Radio value="lg" /> Large
  </label>
</RadioGroup>
```

### Vertical

**Example**

```html
<div class="radio-group radio-group-vertical" role="radiogroup">
  <label> <input type="radio" name="plan" value="free" class="radio" checked /> Free </label>
  <label> <input type="radio" name="plan" value="pro" class="radio" /> Pro </label>
  <label> <input type="radio" name="plan" value="enterprise" class="radio" /> Enterprise </label>
</div>
```

```tsx
<RadioGroup name="plan" orientation="vertical" defaultValue="free">
  <label>
    <Radio value="free" /> Free
  </label>
  <label>
    <Radio value="pro" /> Pro
  </label>
  <label>
    <Radio value="enterprise" /> Enterprise
  </label>
</RadioGroup>
```

### Disabled

**Example**

```html
<div class="radio-group" role="radiogroup">
  <label> <input type="radio" name="t" value="a" class="radio" disabled /> Option A </label>
  <label> <input type="radio" name="t" value="b" class="radio" disabled checked /> Option B </label>
</div>
```

```tsx
<RadioGroup name="t" defaultValue="b" disabled>
  <label>
    <Radio value="a" /> Option A
  </label>
  <label>
    <Radio value="b" /> Option B
  </label>
</RadioGroup>
```

## Reference

### React

| Part              | Renders    | Class             |
| ----------------- | ---------- | ----------------- |
| `RadioGroup`      | `<div>`    | `radio-group`     |
| `Radio`           | `<button>` | `radio`           |
| `Radio.Indicator` | `<span>`   | `radio-indicator` |

| Part         | Prop          | Type                         | Default        |
| ------------ | ------------- | ---------------------------- | -------------- |
| `RadioGroup` | `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` |

`RadioGroup` owns the selection: `value` / `defaultValue` / `onValueChange`, plus `name`, `required` and `disabled`, all from [Base UI RadioGroup](https://base-ui.com/react/components/radio-group). It also provides the roving-focus arrow-key behaviour a radio group is expected to have. `Radio` takes `value` and `disabled`, renders a `<button role="radio">`, and supplies its own indicator — pass `children` only to replace it. Each part takes the native attributes of its element.

For a group label, description and validation, wrap the whole group in a [Field](fields.md).

### Vanilla

| Class                  | Effect                                                          |
| ---------------------- | --------------------------------------------------------------- |
| `radio`                | `1rem` circle, bordered surface; primary fill when checked      |
| `radio-indicator`      | `0.375rem` dot in `primary-content` — the React indicator's box |
| `radio-group`          | Wrapping inline row, `1rem` gap                                 |
| `radio-group-vertical` | Stacks instead, `0.5rem` gap, start-aligned                     |

Works two ways with identical output. On a native `<input type="radio">` the appearance is reset and the dot drawn as a `::after` keyed off `:checked`. On a `<button role="radio">` the states come from `[data-checked]`, `[data-unchecked]` and `[data-disabled]`, the set React emits.

Write `role="radiogroup"` on the group yourself. Native radios need a shared `name` to be mutually exclusive; nothing in the CSS enforces that. Arrow-key navigation between options is browser behaviour for native inputs only.

A wrapping `<label>` is laid out for you: inline row, `0.5rem` gap, pointer cursor, dimmed when disabled, long text wrapping beside the control.
