# Inputs

> Single-line text input.

## Contents

- [Examples](#examples)
  - [Variants](#variants)
  - [Status variants](#status-variants)
  - [Sizes](#sizes)
  - [Disabled](#disabled)
  - [With icons](#with-icons)
  - [Clearable](#clearable)
  - [Password](#password)
  - [Types](#types)
  - [Date and time](#date-and-time)
- [Reference](#reference)
  - [React](#react)
  - [Vanilla](#vanilla)

## Examples

### Variants

**Example**

```html
<input class="input" placeholder="Bordered (default)" />
<input class="input input-ghost" placeholder="Ghost" />
<input class="input input-danger" placeholder="Danger" value="invalid" />
```

```tsx
<Input placeholder="Bordered (default)" />
<Input variant="ghost" placeholder="Ghost" />
<Input variant="danger" defaultValue="invalid" />
```

### Status variants

**Example**

```html
<input class="input input-info" value="Info" />
<input class="input input-success" value="Success" />
<input class="input input-warning" value="Warning" />
```

```tsx
<Input variant="info" defaultValue="Info" />
<Input variant="success" defaultValue="Success" />
<Input variant="warning" defaultValue="Warning" />
```

### Sizes

**Example**

```html
<input class="input input-sm" placeholder="Small" />
<input class="input" placeholder="Medium" />
<input class="input input-lg" placeholder="Large" />
```

```tsx
<Input inputSize="sm" placeholder="Small" />
<Input placeholder="Medium" />
<Input inputSize="lg" placeholder="Large" />
```

### Disabled

**Example**

```html
<input class="input" disabled value="Disabled" />
```

```tsx
<Input disabled defaultValue="Disabled" />
```

### With icons

**Example**

```html
<label class="input-icon">
  <i class="ti ti-search" aria-hidden="true"></i>
  <input class="input" type="search" placeholder="Search…" />
</label>
<label class="input-icon">
  <input class="input" type="email" placeholder="you@example.com" />
  <i class="ti ti-mail" aria-hidden="true"></i>
</label>
<label class="input-icon">
  <i class="ti ti-search" aria-hidden="true"></i>
  <input class="input input-ghost" type="search" placeholder="Filter rows…" />
</label>
```

```tsx
<Input type="search" placeholder="Search…" icon={IconSearch} />
<Input type="email" placeholder="you@example.com" iconTrailing={IconMail} />
<Input variant="ghost" type="search" placeholder="Filter rows…" icon={IconSearch} />
```

### Clearable

**Example**

```html
<label class="input-icon">
  <input class="input" type="search" value="report" />
  <button
    type="button"
    class="input-action"
    aria-label="Clear"
    onclick="const i = this.previousElementSibling; i.value = ''; i.focus();"
  >
    <i class="ti ti-x" aria-hidden="true"></i>
  </button>
</label>
```

```tsx
<Input type="search" defaultValue="report" clearable />
```

### Password

**Example**

```html
<label class="input-icon">
  <input class="input" type="password" value="hunter2" />
  <button
    type="button"
    class="input-action"
    aria-label="Show password"
    aria-pressed="false"
    onclick="const i = this.parentElement.querySelector('input'); const shown = i.type === 'text'; i.type = shown ? 'password' : 'text'; this.setAttribute('aria-pressed', String(!shown)); i.focus();"
  >
    <i class="ti ti-eye" aria-hidden="true"></i>
  </button>
</label>
```

```tsx
<PasswordInput defaultValue="hunter2" />
```

### Types

**Example**

```html
<input class="input" type="email" placeholder="you@example.com" />
<input class="input" type="password" placeholder="Password" />
<input class="input" type="number" placeholder="42" />
<input class="input" type="search" placeholder="Search" />
<input class="input" type="url" placeholder="https://example.com" />
<input class="input" type="tel" placeholder="+45 12 34 56 78" />
```

```tsx
<Input type="email" placeholder="you@example.com" />
<Input type="password" placeholder="Password" />
<Input type="number" placeholder="42" />
<Input type="search" placeholder="Search" />
<Input type="url" placeholder="https://example.com" />
<Input type="tel" placeholder="+45 12 34 56 78" />
```

### Date and time

**Example**

```html
<input class="input" type="date" />
<input class="input" type="time" />
<input class="input" type="datetime-local" />
<input class="input" type="month" />
<input class="input" type="week" />
```

```tsx
<Input type="date" />
<Input type="time" />
<Input type="datetime-local" />
<Input type="month" />
<Input type="week" />
```

## Reference

### React

| Component       | Prop           | Type                                                                    | Default           |
| --------------- | -------------- | ----------------------------------------------------------------------- | ----------------- |
| `Input`         | `variant`      | `"bordered" \| "ghost" \| "danger" \| "info" \| "success" \| "warning"` | `"bordered"`      |
| `Input`         | `inputSize`    | `"sm" \| "md" \| "lg"`                                                  | `"md"`            |
| `Input`         | `icon`         | [`IconProp`](../../basics/conventions.md#icons)                        | —                 |
| `Input`         | `iconTrailing` | [`IconProp`](../../basics/conventions.md#icons)                        | —                 |
| `Input`         | `clearable`    | `boolean`                                                               | `false`           |
| `Input`         | `clearLabel`   | `string`                                                                | `"Clear"`         |
| `Input`         | `onClear`      | `() => void`                                                            | —                 |
| `Input`         | `action`       | `ReactNode`                                                             | —                 |
| `Input`         | `classNames`   | [slots](../../basics/conventions.md#classnames)                        | —                 |
| `PasswordInput` | `revealLabel`  | `string`                                                                | `"Show password"` |

The size prop is `inputSize` because `<input>` has a native `size` attribute — see [Conventions › Sizes](../../basics/conventions.md#sizes). `type` defaults to `"text"`.

Any of `icon`, `iconTrailing`, `clearable` or `action` wraps the input in an `input-icon` label; without them the `<input>` is rendered bare. `classNames` covers `wrapper` and `action`. `clearable` shows the × only while the field holds a value and is neither disabled nor read-only; clearing sets the value through the native setter and dispatches a real `input` event, so controlled components and form libraries both see the change, then calls `onClear`. `action` replaces the clear button with your own control — style it `input-action`.

`PasswordInput` is `Input` with a built-in reveal toggle that flips `type` between `password` and `text`, keeps focus, and tracks state in `aria-pressed`. It accepts every `Input` prop except `type` and the clear-button set.

Wraps [Base UI Input](https://base-ui.com/react/components/input), so inside a [Field](fields.md) it picks up the id, label association and validity wiring. Plus native `<input>` attributes.

### Vanilla

| Class                                        | Effect                                                                                     |
| -------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `input`                                      | Full-width field, `0.75rem`/`0.5rem` padding, `0.5rem` radius, `text-sm`, bordered surface |
| `input-ghost`                                | No fill or border until hover                                                              |
| `input-danger`                               | Danger border and focus outline                                                            |
| `input-info` `input-success` `input-warning` | Status border and focus outline                                                            |
| `input-sm`                                   | `text-xs`, `0.625rem`/`0.375rem` padding                                                   |
| `input-lg`                                   | `text-base`, `1rem`/`0.625rem` padding                                                     |
| `input-icon`                                 | Wrapper that floats icons over a contained `input` and pads the field to clear them        |
| `input-action`                               | `1.25rem` interactive trailing control (clear, reveal) with a `currentColor` hover wash    |

There is no `input-bordered` or `input-md` — both are the unmodified `input`. The status variants tint the border and focus ring only, never the text: warning's yellow fails AA at text size.

`input-icon` is position-driven, so no modifier picks a side: an `<i>`/`<svg>` _before_ the `input` is leading, one _after_ it is trailing, and the wrapper reads the contained `input-sm` / `input-lg` to match its own text size and padding. Decorative glyphs are `pointer-events: none` so clicks reach the field; an `input-action` button stays clickable. A disabled input dims both. The wrapper is usually a `<label>`, which also makes the icon a click target for focusing the field.

Both `input-action` behaviours — clearing and password reveal — need a line of your own JS in vanilla; the button styling ships in both bundles. Native date and time pickers follow the document's `color-scheme` in dark mode, and the calendar glyph is dimmed to `0.6` until hover.

For a bordered segment attached to the field instead of a floating glyph, use [input groups](input-groups.md). For the file picker, [FileInput](file-inputs.md); for steppers and clamping, [Number inputs](number-inputs.md).
