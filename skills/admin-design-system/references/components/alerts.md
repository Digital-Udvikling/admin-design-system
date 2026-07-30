# Alerts

> Inline notifications for errors, confirmations, and contextual feedback.

## Contents

- [Examples](#examples)
  - [Variants](#variants)
  - [With title and description](#with-title-and-description)
  - [With a leading icon](#with-a-leading-icon)
  - [With a trailing action](#with-a-trailing-action)
  - [Dismissible](#dismissible)
- [Reference](#reference)
  - [React](#react)
  - [Vanilla](#vanilla)

## Examples

### Variants

**Example**

```html
<div class="alert alert-info" role="status">Heads up — this is informational.</div>
<div class="alert alert-success" role="status">Changes saved successfully.</div>
<div class="alert alert-warning" role="alert">Double-check before submitting.</div>
<div class="alert alert-danger" role="alert">Something went wrong.</div>
```

```tsx
<Alert variant="info">Heads up — this is informational.</Alert>
<Alert variant="success">Changes saved successfully.</Alert>
<Alert variant="warning">Double-check before submitting.</Alert>
<Alert variant="danger">Something went wrong.</Alert>
```

### With title and description

**Example**

```html
<div class="alert alert-danger" role="alert">
  <strong class="alert-title">Form has errors</strong>
  <p class="alert-description">Please fix the issues below before submitting.</p>
</div>
```

```tsx
<Alert
  variant="danger"
  title="Form has errors"
  description="Please fix the issues below before submitting."
/>
```

### With a leading icon

**Example**

```html
<div class="alert alert-info" role="status">
  <i class="ti ti-info-circle" aria-hidden="true"></i>
  Backups run nightly at 02:00 UTC.
</div>
<div class="alert alert-success" role="status">
  <i class="ti ti-circle-check" aria-hidden="true"></i>
  Changes saved.
</div>
<div class="alert alert-warning" role="alert">
  <i class="ti ti-alert-triangle" aria-hidden="true"></i>
  This action is not reversible.
</div>
<div class="alert alert-danger" role="alert">
  <i class="ti ti-alert-octagon" aria-hidden="true"></i>
  <strong class="alert-title">Connection failed</strong>
  <p class="alert-description">Could not reach the database. Retrying in 30s.</p>
</div>
```

```tsx
<Alert variant="info" icon={IconInfoCircle}>
  Backups run nightly at 02:00 UTC.
</Alert>
<Alert variant="success" icon={IconCircleCheck}>
  Changes saved.
</Alert>
<Alert variant="warning" icon={IconAlertTriangle}>
  This action is not reversible.
</Alert>
<Alert
  variant="danger"
  icon={IconAlertOctagon}
  title="Connection failed"
  description="Could not reach the database. Retrying in 30s."
/>
```

### With a trailing action

**Example**

```html
<div class="alert alert-info" role="status">
  <i class="ti ti-info-circle" aria-hidden="true"></i>
  A new version is available.
  <a href="#" class="link alert-action">Reload</a>
</div>
```

```tsx
<Alert
  variant="info"
  icon={IconInfoCircle}
  action={
    <a href="#" className="link">
      Reload
    </a>
  }
>
  A new version is available.
</Alert>
```

### Dismissible

**Example**

```html
<div class="alert alert-success" role="status">
  <i class="ti ti-circle-check" aria-hidden="true"></i>
  Changes saved.
  <button
    type="button"
    class="alert-dismiss"
    aria-label="Dismiss"
    onclick="this.closest('.alert').remove()"
  >
    <i class="ti ti-x" aria-hidden="true"></i>
  </button>
</div>
```

```tsx
<Alert variant="success" icon={IconCircleCheck} onDismiss={() => {}}>
  Changes saved.
</Alert>
```

## Reference

### React

| Part                | Renders    | Class               |
| ------------------- | ---------- | ------------------- |
| `Alert`             | `<div>`    | `alert`             |
| `Alert.Title`       | `<strong>` | `alert-title`       |
| `Alert.Description` | `<p>`      | `alert-description` |
| `Alert.Action`      | `<div>`    | `alert-action`      |

| Prop           | Type                                           | Default      |
| -------------- | ---------------------------------------------- | ------------ |
| `variant`      | `"info" \| "success" \| "warning" \| "danger"` | — (required) |
| `icon`         | [`IconProp`](../basics/conventions.md#icons)  | —            |
| `title`        | `ReactNode`                                    | —            |
| `description`  | `ReactNode`                                    | —            |
| `action`       | `ReactNode`                                    | —            |
| `onDismiss`    | `MouseEventHandler<HTMLButtonElement>`         | —            |
| `dismissLabel` | `string`                                       | `"Dismiss"`  |
| `classNames`   | [slots](../basics/conventions.md#classnames)  | —            |

`variant` is required — there is no neutral alert. It also picks the `role`: `"alert"` for `warning` and `danger`, which interrupts a screen reader, `"status"` for `info` and `success`, which waits for a pause. Pass `role` to override.

`title`, `description` and `action` are shorthand for the matching parts; use the parts directly to interleave them with other children. `onDismiss` renders the × button and takes its accessible name from `dismissLabel` — the alert stays stateless, so the handler is what hides or removes it. `classNames` covers `title`, `description`, `action`, `dismiss`.

Plus native `<div>` attributes.

### Vanilla

| Class                                                       | Effect                                                                              |
| ----------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `alert`                                                     | Full-width bordered block, `0.75rem`/`0.5rem` padding, `0.375rem` radius, `text-sm` |
| `alert-info` `alert-success` `alert-warning` `alert-danger` | Solid status fill with matching border and `-content` text                          |
| `alert-title`                                               | Medium weight                                                                       |
| `alert-description`                                         | `0.85` opacity against the fill                                                     |
| `alert-action`                                              | Trailing control, pinned to the end column, vertically centred, no wrapping         |
| `alert-dismiss`                                             | `1.25rem` square × button with a `currentColor` hover wash                          |

Write the `role` yourself: `role="alert"` for warning and danger, `role="status"` otherwise.

The layout is `:has()`-driven, so structure alone switches it. A leading `<i>`/`<svg>` as the _first_ child turns the block into an icon + text grid; an `alert-action` or `alert-dismiss` adds a trailing column, and both together add two. A title alongside any of these splits the text into two rows with the icon spanning both. Nothing needs a wrapper class.

`alert-action` can go on the link itself or on a wrapper around it. A `link` inside an alert inherits the variant's content colour, since the link blue is illegible on a solid fill — the underline carries the affordance instead. The dismiss button's `aria-label` is yours to write.

For single-field validation, use [Fields](forms/fields.md). For a docs-style note rather than an app alert, this component is the wrong shape — it's built to be loud.
