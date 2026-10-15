# Code blocks

> Styled <pre> for logs and JSON, plus inline code chips.

## Contents

- [Examples](#examples)
  - [Basic](#basic)
  - [Nowrap + max-height](#nowrap-max-height)
  - [Inline](#inline)
  - [With syntax highlighting](#with-syntax-highlighting)
- [Reference](#reference)
  - [React](#react)
  - [Vanilla](#vanilla)

## Examples

### Basic

**Example**

```html
<pre class="code-block" tabindex="0">
{
  "status": "ok",
  "uptime": 384721,
  "version": "0.10.0"
}
</pre>
```

```tsx
<CodeBlock>
  {`{
  "status": "ok",
  "uptime": 384721,
  "version": "0.10.0"
}`}
</CodeBlock>
```

### Nowrap + max-height

**Example**

```html
<pre class="code-block code-block-nowrap" tabindex="0" style="max-height: 160px">
2026-05-28T08:14:02.331Z INFO  worker.dispatch  job=q-2104 attempt=1 status=accepted
2026-05-28T08:14:02.418Z INFO  worker.dispatch  job=q-2104 attempt=1 fetched 2384 rows in 87ms
2026-05-28T08:14:02.422Z WARN  worker.dispatch  job=q-2104 row 1842 missing field "owner_email" — defaulting to operations@example.com
2026-05-28T08:14:02.501Z INFO  worker.dispatch  job=q-2104 attempt=1 status=completed duration=170ms
2026-05-28T08:14:03.012Z INFO  worker.dispatch  job=q-2105 attempt=1 status=accepted
2026-05-28T08:14:03.090Z ERROR worker.dispatch  job=q-2105 attempt=1 status=failed reason="connection refused on db-primary.internal:5432" backoff=2s
2026-05-28T08:14:05.094Z INFO  worker.dispatch  job=q-2105 attempt=2 status=accepted
2026-05-28T08:14:05.180Z INFO  worker.dispatch  job=q-2105 attempt=2 status=completed duration=86ms
</pre>
```

```tsx
<CodeBlock nowrap style={{ maxHeight: 160 }}>
  {`2026-05-28T08:14:02.331Z INFO  worker.dispatch  job=q-2104 attempt=1 status=accepted
2026-05-28T08:14:02.418Z INFO  worker.dispatch  job=q-2104 attempt=1 fetched 2384 rows in 87ms
2026-05-28T08:14:02.422Z WARN  worker.dispatch  job=q-2104 row 1842 missing field "owner_email" — defaulting to operations@example.com
2026-05-28T08:14:02.501Z INFO  worker.dispatch  job=q-2104 attempt=1 status=completed duration=170ms
2026-05-28T08:14:03.012Z INFO  worker.dispatch  job=q-2105 attempt=1 status=accepted
2026-05-28T08:14:03.090Z ERROR worker.dispatch  job=q-2105 attempt=1 status=failed reason="connection refused on db-primary.internal:5432" backoff=2s
2026-05-28T08:14:05.094Z INFO  worker.dispatch  job=q-2105 attempt=2 status=accepted
2026-05-28T08:14:05.180Z INFO  worker.dispatch  job=q-2105 attempt=2 status=completed duration=86ms`}
</CodeBlock>
```

### Inline

**Example**

```html
<div class="flex flex-col gap-4">
  <p>Type <code class="code">prod-eu-db</code> to confirm. Its 3 replicas are deleted with it.</p>
  <div class="field">
    <label class="field-label" for="invoice-number">Invoice number</label>
    <input id="invoice-number" class="input" aria-describedby="invoice-number-desc" />
    <p id="invoice-number-desc" class="field-description">
      Format <code class="code">INV-0000</code>, as printed on the invoice.
    </p>
  </div>
</div>
```

```tsx
<div className="flex flex-col gap-4">
  <p>
    Type <Code>prod-eu-db</Code> to confirm. Its 3 replicas are deleted with it.
  </p>
  <Field
    name="invoice-number"
    label="Invoice number"
    description={
      <>
        Format <Code>INV-0000</Code>, as printed on the invoice.
      </>
    }
  >
    <Input />
  </Field>
</div>
```

### With syntax highlighting

`.code-block` sets the variables of [Shiki](https://shiki.style/)'s `css-variables` theme, so highlighted tokens take the Flexoki syntax colors and follow dark mode.

**Example**

```html
<pre
  class="code-block"
  tabindex="0"
><code><span class="line"><span style="color:var(--shiki-token-comment)">// Retry failed jobs once</span></span>
<span class="line"><span style="color:var(--shiki-token-keyword)">const</span><span style="color:var(--shiki-token-constant)"> failed</span><span style="color:var(--shiki-token-keyword)"> =</span><span style="color:var(--shiki-token-constant)"> jobs</span><span style="color:var(--shiki-token-function)">.filter</span><span style="color:var(--shiki-foreground)">((job) </span><span style="color:var(--shiki-token-keyword)">=&gt;</span><span style="color:var(--shiki-token-constant)"> job</span><span style="color:var(--shiki-foreground)">.status </span><span style="color:var(--shiki-token-keyword)">===</span><span style="color:var(--shiki-token-string-expression)"> "failed"</span><span style="color:var(--shiki-foreground)">);</span></span></code></pre>
```

Highlight with `theme: "css-variables"` and put `code-block` on the `<pre>`, for example with a `pre` transformer. Astro's built-in `"css-variables"` preset prefixes its variables `--astro-code-`, so pass Shiki's `createCssVariablesTheme()` there instead. In React, render Shiki's `structure: "inline"` output inside `CodeBlock`:

```tsx
const html = await codeToHtml(source, { lang: "ts", theme: "css-variables", structure: "inline" });

<CodeBlock dangerouslySetInnerHTML={{ __html: html }} />;
```

## Reference

### React

| Part        | Renders          |
| ----------- | ---------------- |
| `CodeBlock` | `pre.code-block` |
| `Code`      | `code.code`      |

| Prop     | Type      | Default |
| -------- | --------- | ------- |
| `nowrap` | `boolean` | `false` |

`nowrap` is on `CodeBlock` only. `CodeBlock` renders `tabIndex={0}`, so a block that overflows scrolls by keyboard; pass `tabIndex={-1}` to take it out of the tab order. Plus native `<pre>` attributes; `Code` takes native `<code>` attributes.

### Vanilla

| Class               | Effect                                                                                                                                                        |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `code-block`        | `<pre>` on the code surface: `0.75rem` padding, `text-sm` mono at `1.5` line height, `0.5rem` radius, long lines wrapped, an inset focus ring with `tabindex` |
| `code-block-nowrap` | Long lines scroll horizontally instead of wrapping                                                                                                            |
| `code`              | Inline chip for an identifier in a sentence: mono at `0.85em`, tinted from the text colour, which it inherits                                                 |

The block's surface and text come from `--color-code-surface` / `--color-code-text`, so both follow the page's `color-scheme`. In dark mode the code surface matches `--color-surface-muted`, so inside a card, sidebar, navbar, footer, dialog footer or muted item the block takes `--color-surface` instead; on your own surface-muted container, set `background-color: var(--color-surface)` on the `code-block`. The root already has `overflow: auto`, so an inline `max-height` clamps a log viewer's height. Add `tabindex="0"` so a block that overflows scrolls by keyboard.

`code-block` sets Shiki's `--shiki-foreground`, `--shiki-background` and one `--shiki-token-*` per role: `--shiki-token-comment` and `--shiki-token-punctuation` (`--color-text-muted`), `--shiki-token-keyword` and `--shiki-token-inserted` (green), `--shiki-token-function` (orange), `--shiki-token-string` and `--shiki-token-string-expression` (cyan), `--shiki-token-constant` (purple), `--shiki-token-parameter` and `--shiki-token-link` (blue), `--shiki-token-deleted` (red), `--shiki-token-changed` (yellow). The colors are the `--color-category-*` tokens. Override one on `.code-block` to retheme it. Other highlighters that emit class names (Prism, highlight.js) bring their own theme.

The `code` chip's tint mixes `currentColor`, so it follows a link, an alert or muted text it sits in. Bare `<code>` in `.prose` gets the same chip. For keyboard keys, use [Kbd](kbd.md).
