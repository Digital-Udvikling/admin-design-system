# Copy button

> Write a value to the clipboard from a button.

## Examples

### Icon only (React only)

**Example**

```tsx
<CopyButton value="4005176923197" />
```

### With a label (React only)

**Example**

```tsx
<CopyButton value="https://example.com/orders/1042" icon={IconLink} variant="default" size="sm">
  Copy link
</CopyButton>
```

### In an input group (React only)

**Example**

```tsx
<InputGroup>
  <Input readOnly defaultValue="sk_live_51H8" aria-label="API key" />
  <CopyButton value="sk_live_51H8" variant="default" aria-label="Copy API key" />
</InputGroup>
```

### Your own trigger (React only)

`useCopy()` returns the clipboard write and the timed `copied` flag without the button.

**Example**

```tsx
function CopyOrderId() {
  const { copied, copy } = useCopy();
  return (
    <Button size="sm" onClick={() => void copy("PO-1042")}>
      {copied ? "Copied PO-1042" : "Copy PO-1042"}
    </Button>
  );
}

<CopyOrderId />;
```

## Reference

### React

| Prop          | Type                                          | Default    |
| ------------- | --------------------------------------------- | ---------- |
| `value`       | `string`                                      | —          |
| `variant`     | [`ButtonVariant`](buttons.md#react)          | `"ghost"`  |
| `size`        | `"sm" \| "md" \| "lg"`                        | `"md"`     |
| `icon`        | [`IconProp`](../basics/conventions.md#icons) | copy glyph |
| `copiedLabel` | `string`                                      | `"Copied"` |
| `timeout`     | `number`                                      | `1200`     |
| `aria-label`  | `string`                                      | `"Copy"`   |

Without children it is a square icon button, named by `aria-label`. After a successful copy it shows a check and sets `data-copied` for `timeout` ms, and a polite live region reads `copiedLabel`. The region renders inside the enclosing `Dialog` or `AdminRoot`, so it still announces from a modal dialog. A rejected clipboard write (permission denied, insecure context) leaves the button unchanged. Plus the other [`Button`](buttons.md) props.

`useCopy({ timeout })` returns `{ copied, copy }`. `copy(text)` resolves `true` after a successful write and `false` for empty text or a rejected write; a copy during the `copied` window restarts it.

### Vanilla

The button is a [`btn`](buttons.md); copying needs script, so the vanilla bundle has no copy behaviour. [Property list](property-list.md) values have their own copy button.
