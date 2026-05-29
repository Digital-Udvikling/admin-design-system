# Tooltips

> Transient hints anchored to a trigger.

React's `<Tooltip>` handles delay, focus, dismiss, and portal positioning. Vanilla uses a CSS-only `.tooltip-wrap` parent that reveals a nested `.tooltip` on `:hover` / `:focus-within`.

## Examples

### Basic

Hover or tab to the trigger.

**Example**

```html
<span class="tooltip-wrap">
  <button type="button" class="btn btn-square" aria-label="Save">
    <i class="ti ti-device-floppy" aria-hidden="true"></i>
  </button>
  <span class="tooltip" role="tooltip">Save</span>
</span>
```

```tsx
<Tooltip content="Save">
  <Button aria-label="Save" icon={IconDeviceFloppy} />
</Tooltip>
```

### Sides

Vanilla picks a side with a `.tooltip-wrap-{top|right|bottom|left}` modifier on the wrapper (bare `.tooltip-wrap` defaults to top). React uses `side="top|right|bottom|left"` and auto-flips on collisions.

**Example**

```html
<span class="tooltip-wrap tooltip-wrap-top">
  <button type="button" class="btn">Top</button>
  <span class="tooltip" role="tooltip">Top</span>
</span>
<span class="tooltip-wrap tooltip-wrap-right">
  <button type="button" class="btn">Right</button>
  <span class="tooltip" role="tooltip">Right</span>
</span>
<span class="tooltip-wrap tooltip-wrap-bottom">
  <button type="button" class="btn">Bottom</button>
  <span class="tooltip" role="tooltip">Bottom</span>
</span>
<span class="tooltip-wrap tooltip-wrap-left">
  <button type="button" class="btn">Left</button>
  <span class="tooltip" role="tooltip">Left</span>
</span>
```

```tsx
<>
  <Tooltip content="Top" side="top">
    <Button>Top</Button>
  </Tooltip>
  <Tooltip content="Right" side="right">
    <Button>Right</Button>
  </Tooltip>
  <Tooltip content="Bottom" side="bottom">
    <Button>Bottom</Button>
  </Tooltip>
  <Tooltip content="Left" side="left">
    <Button>Left</Button>
  </Tooltip>
</>
```

### Sizes

`size="sm"` for dense toolbars; `"md"` (default) otherwise.

**Example**

```html
<span class="tooltip-wrap">
  <button type="button" class="btn btn-sm">sm</button>
  <span class="tooltip tooltip-sm" role="tooltip">Small</span>
</span>
<span class="tooltip-wrap">
  <button type="button" class="btn">md</button>
  <span class="tooltip" role="tooltip">Medium</span>
</span>
```

```tsx
<>
  <Tooltip content="Small" size="sm">
    <Button size="sm">sm</Button>
  </Tooltip>
  <Tooltip content="Medium">
    <Button>md</Button>
  </Tooltip>
</>
```

### Group delay

Wrap a toolbar in `<Tooltip.Provider>` so once one tooltip opens, adjacent ones open instantly until the user pauses for `timeout` ms.

**Example**

```tsx
<Tooltip.Provider delay={500} closeDelay={0}>
  <Tooltip content="Edit">
    <Button aria-label="Edit" icon={IconPencil} />
  </Tooltip>
  <Tooltip content="Duplicate">
    <Button aria-label="Duplicate" icon={IconCopy} />
  </Tooltip>
  <Tooltip content="Delete">
    <Button variant="danger" aria-label="Delete" icon={IconTrash} />
  </Tooltip>
</Tooltip.Provider>
```

### Rich content

The popup body accepts any inline content — e.g. a keyboard shortcut hint via [`<Kbd>`](kbd.md). React's `<Tooltip>` accepts JSX in `content`; drop down to subparts when the shorthand's `content` prop isn't enough.

**Example**

```html
<span class="tooltip-wrap">
  <button type="button" class="btn">Save</button>
  <span class="tooltip" role="tooltip">
    Save changes
    <span class="kbd-group">
      <kbd class="kbd">Ctrl</kbd>
      <kbd class="kbd">S</kbd>
    </span>
  </span>
</span>
```

```tsx
<Tooltip
  content={
    <>
      Save changes <Kbd keys="mod+s" />
    </>
  }
>
  <Button>Save</Button>
</Tooltip>
```

## Vanilla path notes

Vanilla `.tooltip-wrap` is CSS-only and shares the trigger's stacking context — an ancestor with `overflow: hidden` can clip it. Use the React popup if you need portal positioning.
