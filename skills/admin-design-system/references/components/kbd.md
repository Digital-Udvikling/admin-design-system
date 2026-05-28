# Kbd

> Keyboard shortcut chips for help text, tooltips, and bindings.

A chip for rendering a single key or a chord. Paired with the `hotkey` prop on [Buttons](../buttons/) / [Menu.Item](../menus/), or used standalone in tooltips and help dialogs.

## Examples

### Basic

`<Kbd keys="…" />` parses a chord into one chip per part. Modifiers come first, in the order `Ctrl`, `Shift`, `Alt`, `Meta`.

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
