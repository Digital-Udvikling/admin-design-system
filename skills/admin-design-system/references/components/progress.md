# Progress

> Styled native <progress> element.

A styled native `<progress>` element — the browser handles ARIA semantics. Omit `value` for an indeterminate bar.

## Examples

### Determinate

**Example**

```html
<progress class="progress" value="25" max="100"></progress>
<progress class="progress" value="60" max="100"></progress>
<progress class="progress" value="90" max="100"></progress>
```

```tsx
<Progress value={25} />
<Progress value={60} />
<Progress value={90} />
```

### Indeterminate

Drop the `value` attribute (or pass `value={undefined}` in React).

**Example**

```html
<progress class="progress"></progress>
```

```tsx
<Progress />
```

### Variants

The fill uses `currentColor`.

**Example**

```html
<progress class="progress" value="40" max="100"></progress>
<progress class="progress progress-success" value="40" max="100"></progress>
<progress class="progress progress-warning" value="40" max="100"></progress>
<progress class="progress progress-danger" value="40" max="100"></progress>
```

```tsx
<Progress value={40} />
<Progress value={40} variant="success" />
<Progress value={40} variant="warning" />
<Progress value={40} variant="danger" />
```

### Sizes

**Example**

```html
<progress class="progress progress-sm" value="50" max="100"></progress>
<progress class="progress" value="50" max="100"></progress>
<progress class="progress progress-lg" value="50" max="100"></progress>
```

```tsx
<Progress value={50} size="sm" />
<Progress value={50} />
<Progress value={50} size="lg" />
```
