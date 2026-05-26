# Inputs

> Single-line text input.

## Examples

### Variants

**Example**

```html
<input class="input input-bordered" placeholder="Bordered (default)" />
<input class="input input-ghost" placeholder="Ghost" />
<input class="input input-danger" placeholder="Danger" value="invalid" />
```

```tsx
<Input placeholder="Bordered (default)" />
<Input variant="ghost" placeholder="Ghost" />
<Input variant="danger" defaultValue="invalid" />
```

### Sizes

**Example**

```html
<input class="input input-bordered input-sm" placeholder="Small" />
<input class="input input-bordered" placeholder="Medium" />
<input class="input input-bordered input-lg" placeholder="Large" />
```

```tsx
<Input inputSize="sm" placeholder="Small" />
<Input placeholder="Medium" />
<Input inputSize="lg" placeholder="Large" />
```

### Disabled

**Example**

```html
<input class="input input-bordered" disabled value="Disabled" />
```

```tsx
<Input disabled defaultValue="Disabled" />
```

### Types

**Example**

```html
<input class="input input-bordered" type="email" placeholder="you@example.com" />
<input class="input input-bordered" type="password" placeholder="Password" />
<input class="input input-bordered" type="number" placeholder="42" />
<input class="input input-bordered" type="date" />
<input class="input input-bordered" type="time" />
<input class="input input-bordered" type="search" placeholder="Search" />
<input class="input input-bordered" type="url" placeholder="https://example.com" />
<input class="input input-bordered" type="tel" placeholder="+45 12 34 56 78" />
```

```tsx
<Input type="email" placeholder="you@example.com" />
<Input type="password" placeholder="Password" />
<Input type="number" placeholder="42" />
<Input type="date" />
<Input type="time" />
<Input type="search" placeholder="Search" />
<Input type="url" placeholder="https://example.com" />
<Input type="tel" placeholder="+45 12 34 56 78" />
```

### Date and time

Native browser pickers; dark mode tracks the document's `color-scheme`.

**Example**

```html
<input class="input input-bordered" type="date" />
<input class="input input-bordered" type="time" />
<input class="input input-bordered" type="datetime-local" />
<input class="input input-bordered" type="month" />
<input class="input input-bordered" type="week" />
```

```tsx
<Input type="date" />
<Input type="time" />
<Input type="datetime-local" />
<Input type="month" />
<Input type="week" />
```

### File

Use [FileInput](../file-inputs/) (`.file-input` class) to style the picker button.
