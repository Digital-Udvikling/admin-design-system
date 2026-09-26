# Flash messages

> Report the result of an action after it runs.

There is no toast. A server-rendered page shows the messages from the last request as alerts at the top of `main`, and a React view reports a result next to the control that caused it.

## Examples

### Message stack

**Example**

```html
<div class="flex w-full flex-col gap-2">
  <div class="alert alert-success" role="status">
    <i class="ti ti-circle-check" aria-hidden="true"></i>
    Supplier Nordic Fittings saved.
  </div>
  <div class="alert alert-warning" role="alert">
    <i class="ti ti-alert-triangle" aria-hidden="true"></i>
    2 price lines have no currency and were skipped.
  </div>
</div>
```

```tsx
<div className="flex w-full flex-col gap-2">
  <Alert variant="success" icon={IconCircleCheck}>
    Supplier Nordic Fittings saved.
  </Alert>
  <Alert variant="warning" icon={IconAlertTriangle}>
    2 price lines have no currency and were skipped.
  </Alert>
</div>
```

The messages disappear on the next navigation, so the vanilla stack has no dismiss button. React's `Alert` renders one when you pass `onDismiss`.

### Result next to the action (React only)

**Example**

```tsx
function SavePrices() {
  const [saved, setSaved] = useState(false);
  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex gap-2">
        <Button variant="primary" onClick={() => setSaved(true)}>
          Save prices
        </Button>
      </div>
      {saved ? (
        <Alert variant="success" icon={IconCircleCheck} onDismiss={() => setSaved(false)}>
          Prices saved for 14 products.
        </Alert>
      ) : null}
    </div>
  );
}

<SavePrices />;
```

For a change to one table row, show the result in that row, such as a status badge or an error in the affected cell, not above the table.

## Message levels

| Level     | Variant         | `role`   |
| --------- | --------------- | -------- |
| `debug`   | `alert-info`    | `status` |
| `info`    | `alert-info`    | `status` |
| `success` | `alert-success` | `status` |
| `warning` | `alert-warning` | `alert`  |
| `error`   | `alert-danger`  | `alert`  |

React's `Alert` picks the same `role` from `variant`. In Django, `MESSAGE_TAGS` maps the two levels whose tag differs from the variant, so `message.tags` is the class suffix:

```python
from django.contrib import messages

MESSAGE_TAGS = {messages.DEBUG: "info", messages.ERROR: "danger"}
```

```jinja
{% if messages %}
  <div class="flex flex-col gap-2">
    {% for message in messages %}
      <div class="alert alert-{{ message.tags }}" role="{% if message.level >= 30 %}alert{% else %}status{% endif %}">
        {{ message }}
      </div>
    {% endfor %}
  </div>
{% endif %}
```

## Built from

[Alert](../components/alerts.md) and the `flex` utilities from [Row](../components/row.md).
