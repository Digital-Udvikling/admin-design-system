# Code blocks

> Styled <pre> for logs, JSON, and terminal output.

A styled `<pre>` with a neutral, theme-following surface for logs, JSON, terminal, and raw model output. No syntax highlighting; layer Shiki or Prism on a nested `<code>` if needed.

For inline keyboard chips, use [Kbd](kbd.md) instead.

## Examples

### Basic

Wraps long lines by default. Surface and text tones follow the page's `color-scheme` for dark mode.

**Example**

```html
<pre class="code-block">
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

For log viewers and anything with long, fixed-format lines: `nowrap` lets long lines scroll horizontally, and an inline `max-height` clamps vertical growth — `overflow: auto` on the root handles the scrollbar automatically.

**Example**

```html
<pre class="code-block code-block-nowrap" style="max-height: 200px">
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
<CodeBlock nowrap style={{ maxHeight: 200 }}>
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

Layer Shiki, Prism, or similar on a nested `<code>` — the `.code-block` styles the outer surface and doesn't fight the highlighter's token colors.

```html
<pre class="code-block"><code class="language-json">{ "highlighted": true }</code></pre>
```
