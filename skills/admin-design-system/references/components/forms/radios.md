# Radios

> Radio + RadioGroup.

`RadioGroup` owns the selection state. React wraps Base UI's `Radio.Root`; vanilla styles a native `<input type="radio">`. A `<label>` wrapping a `.radio` lays out inline automatically.

## Examples

### Group (horizontal)

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
