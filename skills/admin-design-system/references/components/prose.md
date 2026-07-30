# Prose

> Styling for rendered markdown and other HTML you don't control.

## Contents

- [Examples](#examples)
  - [Rendered markdown](#rendered-markdown)
  - [Injecting a rendered HTML string](#injecting-a-rendered-html-string)
- [Reference](#reference)
  - [React](#react)
  - [Vanilla](#vanilla)

## Examples

### Rendered markdown

**Example**

```html
<div class="prose">
  <h2>Refund policy</h2>
  <p>
    Refunds return to the original payment method within
    <strong>5–7 business days</strong>. Partial refunds are prorated against the unused term.
  </p>
  <h3>Eligibility</h3>
  <ul>
    <li>Annual plans, within 30 days of renewal</li>
    <li>Monthly plans, within 48 hours of the charge</li>
  </ul>
  <p>
    See the full <a href="#">billing terms</a> or run
    <code>aortl billing refund &lt;invoice-id&gt;</code>.
  </p>
  <blockquote>Disputes opened with the card issuer freeze the invoice until resolved.</blockquote>
  <table>
    <thead>
      <tr>
        <th>Plan</th>
        <th>Refund window</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Annual</td>
        <td>30 days</td>
      </tr>
      <tr>
        <td>Monthly</td>
        <td>48 hours</td>
      </tr>
    </tbody>
  </table>
</div>
```

```tsx
<Prose>
  <h2>Refund policy</h2>
  <p>
    Refunds return to the original payment method within <strong>5–7 business days</strong>. Partial
    refunds are prorated against the unused term.
  </p>
  <h3>Eligibility</h3>
  <ul>
    <li>Annual plans, within 30 days of renewal</li>
    <li>Monthly plans, within 48 hours of the charge</li>
  </ul>
  <p>
    See the full <a href="#">billing terms</a> or run{" "}
    <code>aortl billing refund &lt;invoice-id&gt;</code>.
  </p>
  <blockquote>Disputes opened with the card issuer freeze the invoice until resolved.</blockquote>
  <table>
    <thead>
      <tr>
        <th>Plan</th>
        <th>Refund window</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Annual</td>
        <td>30 days</td>
      </tr>
      <tr>
        <td>Monthly</td>
        <td>48 hours</td>
      </tr>
    </tbody>
  </table>
</Prose>
```

### Injecting a rendered HTML string

```html
<!-- server renders markdown → html, then: -->
<div class="prose">{{ renderedHtml }}</div>
```

```tsx
<Prose dangerouslySetInnerHTML={{ __html: renderedHtml }} />
```

**Danger** — Sanitize untrusted HTML before injecting it. The wrapper styles markup; it does not filter it.

## Reference

### React

Takes no props of its own — native `<div>` attributes only.

### Vanilla

| Class   | Effect                                                                                                                                                                                                                                         |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `prose` | Restores element styling inside the wrapper: `text-sm`, `0.75rem` block rhythm, list markers, underlined links, `<code>` chips, a scrolling `<pre>`, a bordered `<blockquote>`, `h4`–`h6` sizing, and the table look from [Tables](tables.md) |

The global reset strips margins, list markers, and link styling from bare elements so admin chrome stays neutral, which leaves backend-rendered HTML unstyled. This class re-establishes it for one region, from the same semantic tokens, so it follows dark mode. First and last children keep their outer margins collapsed.

Every descendant rule is wrapped in `:where()`, so a consumer's own `.prose a { … }` wins on specificity without `!important`.

When you control the markup, reach for the dedicated components instead: [Link](links.md), [Table](tables.md), [Code blocks](code-blocks.md).
