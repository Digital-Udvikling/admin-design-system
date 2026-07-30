# Kbd

> Keyboard shortcut chips for help text, tooltips, and bindings.

## Examples

### Basic

**Example**

```html
<span class="kbd-group">
  <kbd class="kbd">Ctrl</kbd>
  <kbd class="kbd">S</kbd>
</span>
```

```tsx
<Kbd keys="mod+s" />
```

### Special keys

**Example**

```html
<kbd class="kbd">Esc</kbd>
<kbd class="kbd">Enter</kbd>
<kbd class="kbd">Tab</kbd>
<kbd class="kbd">↑</kbd>
<kbd class="kbd">↓</kbd>
<kbd class="kbd">←</kbd>
<kbd class="kbd">→</kbd>
```

```tsx
<Kbd keys="escape" />
<Kbd keys="enter" />
<Kbd keys="tab" />
<Kbd keys="arrowup" />
<Kbd keys="arrowdown" />
<Kbd keys="arrowleft" />
<Kbd keys="arrowright" />
```

## Reference

### React

| Prop       | Type                          | Default |
| ---------- | ----------------------------- | ------- |
| `keys`     | `string \| readonly string[]` | —       |
| `children` | `string`                      | —       |

`keys` takes `useHotkey` chord syntax and renders one chip per part inside a `kbd-group`, modifiers first in the order `Ctrl`, `Shift`, `Alt`, `Meta`. `mod` resolves to `Cmd` on macOS and `Ctrl` elsewhere. Pass an array for alternatives and only the first renders — the platform menu convention of showing the primary binding. An unparseable chord renders nothing.

`children` is the unparsed form: a literal string in a single chip. Plus native `<span>` attributes.

To bind a shortcut rather than only display one, see [Conventions › Hotkeys](../basics/conventions.md#hotkeys).

### Vanilla

| Class       | Effect                                                                                                         |
| ----------- | -------------------------------------------------------------------------------------------------------------- |
| `kbd`       | One key chip on `<kbd>`: `1.4em` tall, `1.25em` min-width, `0.35em` side padding, `0.75em` mono, bordered chip |
| `kbd-group` | Inline-flex row, `0.25rem` gap. Wrap a chord so it reads as one unit                                           |

Inside a `btn` or `menu-item` the chip derives its fill and border from `currentColor`, so it stays legible on any variant. A `kbd-group` inside a `menu-item` — or inside a `btn` in a `btn-group-vertical` — is pushed to the row end; inside a plain `btn` it sits beside the label at `0.85` opacity.
