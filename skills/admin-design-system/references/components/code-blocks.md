# Code blocks

> Styled <pre> for logs, JSON, and terminal output.

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

### With syntax highlighting

```html
<pre
  class="code-block"
  tabindex="0"
><code class="language-json">{ "highlighted": true }</code></pre>
```

## Reference

### React

| Prop     | Type      | Default |
| -------- | --------- | ------- |
| `nowrap` | `boolean` | `false` |

`CodeBlock` renders `tabIndex={0}`, so a block that overflows scrolls by keyboard; pass `tabIndex={-1}` to take it out of the tab order. Plus native `<pre>` attributes.

### Vanilla

| Class               | Effect                                                                                              |
| ------------------- | --------------------------------------------------------------------------------------------------- |
| `code-block`        | `<pre>` on the code surface: `0.75rem` padding, `text-sm` mono, `0.5rem` radius, long lines wrapped |
| `code-block-nowrap` | Long lines scroll horizontally instead of wrapping                                                  |

Surface and text come from `--color-code-surface` / `--color-code-text`, so both follow the page's `color-scheme`. The root already has `overflow: auto`, so an inline `max-height` is all a log viewer needs to clamp vertical growth. Add `tabindex="0"` so a block that overflows scrolls by keyboard. There is no syntax highlighting — layer Shiki or Prism on a nested `<code>`, which this class leaves alone so the highlighter's token colours show through.

For inline keyboard chips, use [Kbd](kbd.md).
