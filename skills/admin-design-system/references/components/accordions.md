# Accordions

> Disclosure rows built on <details>.

Modern browsers animate the open/close via `interpolate-size: allow-keywords` + `::details-content`; older browsers degrade to instant toggle.

## Examples

### Single item

**Example**

```html
<div class="accordion">
  <details class="accordion-item">
    <summary class="accordion-summary">Settings</summary>
    <div class="accordion-content">Theme, language, accessibility preferences.</div>
  </details>
</div>
```

```tsx
<Accordion>
  <Accordion.Item>
    <Accordion.Summary>Settings</Accordion.Summary>
    <Accordion.Content>Theme, language, accessibility preferences.</Accordion.Content>
  </Accordion.Item>
</Accordion>
```

### Grouped items

Adjacent items share their border; the chevron stays on the right. See [Icons](../basics/icons.md).

**Example**

```html
<div class="accordion">
  <details class="accordion-item">
    <summary class="accordion-summary">
      <i class="ti ti-user" aria-hidden="true"></i>
      Account
    </summary>
    <div class="accordion-content">Name, email, password.</div>
  </details>
  <details class="accordion-item">
    <summary class="accordion-summary">
      <i class="ti ti-bell" aria-hidden="true"></i>
      Notifications
    </summary>
    <div class="accordion-content">Email digests, push, in-app banners.</div>
  </details>
  <details class="accordion-item">
    <summary class="accordion-summary">
      <i class="ti ti-credit-card" aria-hidden="true"></i>
      Billing
    </summary>
    <div class="accordion-content">Plan, payment methods, invoices.</div>
  </details>
</div>
```

```tsx
<Accordion>
  <Accordion.Item>
    <Accordion.Summary>
      <IconUser size={16} aria-hidden />
      Account
    </Accordion.Summary>
    <Accordion.Content>Name, email, password.</Accordion.Content>
  </Accordion.Item>
  <Accordion.Item>
    <Accordion.Summary>
      <IconBell size={16} aria-hidden />
      Notifications
    </Accordion.Summary>
    <Accordion.Content>Email digests, push, in-app banners.</Accordion.Content>
  </Accordion.Item>
  <Accordion.Item>
    <Accordion.Summary>
      <IconCreditCard size={16} aria-hidden />
      Billing
    </Accordion.Summary>
    <Accordion.Content>Plan, payment methods, invoices.</Accordion.Content>
  </Accordion.Item>
</Accordion>
```

### Open by default

Add the native `open` attribute.

**Example**

```html
<details class="accordion-item" open>
  <summary class="accordion-summary">Already expanded</summary>
  <div class="accordion-content">Visible without a click.</div>
</details>
```

```tsx
<Accordion.Item open>
  <Accordion.Summary>Already expanded</Accordion.Summary>
  <Accordion.Content>Visible without a click.</Accordion.Content>
</Accordion.Item>
```
