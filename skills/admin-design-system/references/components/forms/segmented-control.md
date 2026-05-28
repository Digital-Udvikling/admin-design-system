# Segmented control

> A row of mutually exclusive (or multi-select) options styled as joined segments.

IconThumbUp,
  IconThumbDown,
  IconList,
  IconAlignLeft,
  IconAlignCenter,
  IconAlignRight,
} from "@tabler/icons-react";

Built on native `<input type="radio">` (single-select) or `<input type="checkbox">` (multi-select) inside a `<fieldset>` with a `<legend>`. Vanilla forms, HTMX, and React all work — the input semantics handle keyboard, focus, and form submission without JavaScript.

The fieldset's `<legend>` is the accessible group name; the React `label` prop renders it.

## Examples

### Single-select

**Example**

```html
<fieldset class="segmented-control">
  <legend>Feedback</legend>
  <div class="segmented-control-track">
    <label class="segmented-control-item">
      <input type="radio" name="fb" value="all" checked />
      <span>All</span>
    </label>
    <label class="segmented-control-item">
      <input type="radio" name="fb" value="positive" />
      <span>Positive</span>
    </label>
    <label class="segmented-control-item">
      <input type="radio" name="fb" value="negative" />
      <span>Negative</span>
    </label>
  </div>
</fieldset>
```

```tsx
<SegmentedControl type="single" label="Feedback" name="fb" defaultValue="all">
  <SegmentedControl.Item value="all">All</SegmentedControl.Item>
  <SegmentedControl.Item value="positive">Positive</SegmentedControl.Item>
  <SegmentedControl.Item value="negative">Negative</SegmentedControl.Item>
</SegmentedControl>
```

### Multi-select

Swap `type="single"` for `type="multiple"`, and the underlying input becomes a checkbox. The submitted form sends each selected value under the same `name`.

**Example**

```html
<fieldset class="segmented-control">
  <legend>Features</legend>
  <div class="segmented-control-track">
    <label class="segmented-control-item">
      <input type="checkbox" name="features" value="auth" checked />
      <span>Auth</span>
    </label>
    <label class="segmented-control-item">
      <input type="checkbox" name="features" value="oauth" />
      <span>OAuth</span>
    </label>
    <label class="segmented-control-item">
      <input type="checkbox" name="features" value="saml" />
      <span>SAML</span>
    </label>
  </div>
</fieldset>
```

```tsx
<SegmentedControl type="multiple" label="Features" name="features" defaultValue={["auth"]}>
  <SegmentedControl.Item value="auth">Auth</SegmentedControl.Item>
  <SegmentedControl.Item value="oauth">OAuth</SegmentedControl.Item>
  <SegmentedControl.Item value="saml">SAML</SegmentedControl.Item>
</SegmentedControl>
```

### With icons

See [Icons](../../basics/icons/) for the recommended library.

**Example**

```html
<fieldset class="segmented-control">
  <legend>Feedback</legend>
  <div class="segmented-control-track">
    <label class="segmented-control-item">
      <input type="radio" name="fbi" value="all" checked />
      <i class="ti ti-list" aria-hidden="true"></i>
      <span>All</span>
    </label>
    <label class="segmented-control-item">
      <input type="radio" name="fbi" value="positive" />
      <i class="ti ti-thumb-up" aria-hidden="true"></i>
      <span>Positive</span>
    </label>
    <label class="segmented-control-item">
      <input type="radio" name="fbi" value="negative" />
      <i class="ti ti-thumb-down" aria-hidden="true"></i>
      <span>Negative</span>
    </label>
  </div>
</fieldset>
```

```tsx
<SegmentedControl type="single" label="Feedback" name="fbi" defaultValue="all">
  <SegmentedControl.Item value="all" icon={IconList}>
    All
  </SegmentedControl.Item>
  <SegmentedControl.Item value="positive" icon={IconThumbUp}>
    Positive
  </SegmentedControl.Item>
  <SegmentedControl.Item value="negative" icon={IconThumbDown}>
    Negative
  </SegmentedControl.Item>
</SegmentedControl>
```

### Icon-only

Omit the visible text and supply `aria-label` — it lands on the underlying input so screen readers announce a name.

**Example**

```html
<fieldset class="segmented-control">
  <legend>Align</legend>
  <div class="segmented-control-track">
    <label class="segmented-control-item">
      <input type="radio" name="align" value="left" aria-label="Align left" checked />
      <i class="ti ti-align-left" aria-hidden="true"></i>
    </label>
    <label class="segmented-control-item">
      <input type="radio" name="align" value="center" aria-label="Align center" />
      <i class="ti ti-align-center" aria-hidden="true"></i>
    </label>
    <label class="segmented-control-item">
      <input type="radio" name="align" value="right" aria-label="Align right" />
      <i class="ti ti-align-right" aria-hidden="true"></i>
    </label>
  </div>
</fieldset>
```

```tsx
<SegmentedControl type="single" label="Align" name="align" defaultValue="left">
  <SegmentedControl.Item value="left" icon={IconAlignLeft} aria-label="Align left" />
  <SegmentedControl.Item value="center" icon={IconAlignCenter} aria-label="Align center" />
  <SegmentedControl.Item value="right" icon={IconAlignRight} aria-label="Align right" />
</SegmentedControl>
```

### Sizes

`sm` for dense filter rows; `md` (default) for prominent controls.

**Example**

```html
<fieldset class="segmented-control segmented-control-sm">
  <legend>Range</legend>
  <div class="segmented-control-track">
    <label class="segmented-control-item">
      <input type="radio" name="range" value="day" checked />
      <span>Day</span>
    </label>
    <label class="segmented-control-item">
      <input type="radio" name="range" value="week" />
      <span>Week</span>
    </label>
    <label class="segmented-control-item">
      <input type="radio" name="range" value="month" />
      <span>Month</span>
    </label>
  </div>
</fieldset>
```

```tsx
<SegmentedControl type="single" label="Range" name="range" size="sm" defaultValue="day">
  <SegmentedControl.Item value="day">Day</SegmentedControl.Item>
  <SegmentedControl.Item value="week">Week</SegmentedControl.Item>
  <SegmentedControl.Item value="month">Month</SegmentedControl.Item>
</SegmentedControl>
```

### Full width

`segmented-control-full-width` stretches the track to fill its container and gives each segment an equal share.

**Example**

```html
<fieldset class="segmented-control segmented-control-full-width">
  <legend>Mailbox</legend>
  <div class="segmented-control-track">
    <label class="segmented-control-item">
      <input type="radio" name="mb" value="inbox" checked />
      <span>Inbox</span>
    </label>
    <label class="segmented-control-item">
      <input type="radio" name="mb" value="archive" />
      <span>Archive</span>
    </label>
    <label class="segmented-control-item">
      <input type="radio" name="mb" value="spam" />
      <span>Spam</span>
    </label>
  </div>
</fieldset>
```

```tsx
<SegmentedControl type="single" label="Mailbox" name="mb" defaultValue="inbox" fullWidth>
  <SegmentedControl.Item value="inbox">Inbox</SegmentedControl.Item>
  <SegmentedControl.Item value="archive">Archive</SegmentedControl.Item>
  <SegmentedControl.Item value="spam">Spam</SegmentedControl.Item>
</SegmentedControl>
```

### Disabled

Set `disabled` on the fieldset (vanilla) or the component (React) to dim every segment. Per-segment disable goes on the individual `<input>` (vanilla) or `<SegmentedControl.Item>` (React).

**Example**

```html
<fieldset class="segmented-control" disabled>
  <legend>Plan</legend>
  <div class="segmented-control-track">
    <label class="segmented-control-item">
      <input type="radio" name="plan-d" value="free" checked />
      <span>Free</span>
    </label>
    <label class="segmented-control-item">
      <input type="radio" name="plan-d" value="pro" />
      <span>Pro</span>
    </label>
  </div>
</fieldset>
```

```tsx
<SegmentedControl type="single" label="Plan" name="plan-d" defaultValue="free" disabled>
  <SegmentedControl.Item value="free">Free</SegmentedControl.Item>
  <SegmentedControl.Item value="pro">Pro</SegmentedControl.Item>
</SegmentedControl>
```

**Example**

```html
<fieldset class="segmented-control">
  <legend>Plan</legend>
  <div class="segmented-control-track">
    <label class="segmented-control-item">
      <input type="radio" name="plan-i" value="free" checked />
      <span>Free</span>
    </label>
    <label class="segmented-control-item">
      <input type="radio" name="plan-i" value="pro" />
      <span>Pro</span>
    </label>
    <label class="segmented-control-item">
      <input type="radio" name="plan-i" value="enterprise" disabled />
      <span>Enterprise</span>
    </label>
  </div>
</fieldset>
```

```tsx
<SegmentedControl type="single" label="Plan" name="plan-i" defaultValue="free">
  <SegmentedControl.Item value="free">Free</SegmentedControl.Item>
  <SegmentedControl.Item value="pro">Pro</SegmentedControl.Item>
  <SegmentedControl.Item value="enterprise" disabled>
    Enterprise
  </SegmentedControl.Item>
</SegmentedControl>
```
