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

`keys` takes `useHotkey` chord syntax and renders one chip per part inside a `kbd-group`, modifiers first in the order `Ctrl`, `Shift`, `Alt`, `Meta`. `mod` renders `⌘` on Apple platforms and `Ctrl` elsewhere; server-rendered chips start with the non-Apple labels (see [Conventions › Hotkeys](../basics/conventions.md#hotkeys)). Pass an array for alternatives; only the first renders. An unparseable chord renders nothing.

`children` is the unparsed form: a literal string in a single chip. Plus native `<span>` attributes.

To bind a shortcut rather than only display one, see [Conventions › Hotkeys](../basics/conventions.md#hotkeys).

### Vanilla

| Class       | Effect                                                                                           |
| ----------- | ------------------------------------------------------------------------------------------------ |
| `kbd`       | One key chip on `<kbd>`: `0.75em` mono in a bordered box one host `em` tall and at least as wide |
| `kbd-group` | Inline-flex row, `0.25rem` gap. Wrap a chord so it reads as one unit                             |

The chip takes the host's text colour and mixes its fill and border from `currentColor`, so it follows an inverted `tooltip` or a solid `btn`. It never grows a `btn` or `menu-item`. A `kbd` or `kbd-group` directly inside a `menu-item`, or a `kbd-group` inside a `btn` in a `btn-group-vertical`, is pushed to the row end; inside a plain `btn` it sits beside the label at `0.85` opacity.
