# Alerts

> Inline notifications for errors, confirmations, and contextual feedback.

## Contents

- [Examples](#examples)
  - [Variants](#variants)
  - [With title and description](#with-title-and-description)
  - [With a leading icon](#with-a-leading-icon)
  - [With a trailing action](#with-a-trailing-action)
  - [Dismissible](#dismissible)

For single-field validation, use [Fields](forms/fields.md) instead.

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

`<Alert>` accepts `title` and `description` props. Use the sub-components to interleave them with other content.

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

Pass `icon`, or drop an `<i>`/`<svg>` as the first child. See [Icons](../basics/icons.md).

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

The `alert-action` class can sit on the link itself or on a wrapper. Inside an alert, `.link` inherits the variant's content color.

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

`onDismiss` renders a trailing × button. The alert stays stateless, so wire the click to hide or remove it. It pins to the trailing edge alongside an action.

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
