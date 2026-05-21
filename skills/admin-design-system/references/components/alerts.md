# Alerts

> Inline notifications for errors, confirmations, and contextual feedback.

IconInfoCircle,
  IconCircleCheck,
  IconAlertTriangle,
  IconAlertOctagon,
} from "@tabler/icons-react";

For single-field validation, use [Fields](/admin-design-system/components/forms/fields/) instead.

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

Pass `icon` — the CSS switches the alert to a two-column grid; the icon spans all rows and inherits the variant colour. See [Icons](/admin-design-system/basics/icons/).

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
