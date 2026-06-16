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
  - [File](#file)
  - [Inside a Field](#inside-a-field)

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

`info`, `success`, and `warning` set the border and focus ring color.

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

The `.input-icon` wrapper floats a borderless muted icon inside the field. Position is structural — an `i`/`svg` before the `.input` is leading, after is trailing. For a bordered segment instead, use [input groups](input-groups.md). See [Icons](../../basics/icons.md).

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

`clearable` floats a × button in the trailing slot while the field holds a value; clicking it empties the field and fires a real change event. The `.input-action` button styling ships to both bundles — vanilla wires the clear in a line of JS.

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

`<PasswordInput>` adds a reveal toggle that flips the field between `password` and `text`, keeping focus and setting `aria-pressed`.

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

Native browser pickers; dark mode tracks the document's `color-scheme`.

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

### File

Use [FileInput](file-inputs.md) (`.file-input` class) to style the picker button.

### Inside a Field

See [Fields](fields.md).

**Example**

```html
<div class="field">
  <label class="field-label" for="email">Email</label>
  <input id="email" type="email" class="input" placeholder="you@example.com" />
  <p class="field-description">We'll never share your email.</p>
</div>
```

```tsx
<Field name="email">
  <Field.Label>Email</Field.Label>
  <Input type="email" placeholder="you@example.com" />
  <Field.Description>We'll never share your email.</Field.Description>
</Field>
```
