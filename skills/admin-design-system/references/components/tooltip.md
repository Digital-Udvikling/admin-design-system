# Tooltips

> Transient hints anchored to a trigger.

The React tooltip wraps [Base UI's tooltip](https://base-ui.com/react/components/tooltip) — hover/focus delay, ARIA description wiring, dismiss, and portal positioning all come from the primitive. The vanilla equivalent is a CSS-only `.tooltip-wrap` parent that reveals a nested `.tooltip` on `:hover` / `:focus-within`.

## Examples

### Basic

Hover or tab to the trigger.

**Example**

```html
<span class="tooltip-wrap">
  <button type="button" class="btn btn-square" aria-label="Save">
    <i class="ti ti-device-floppy" aria-hidden="true"></i>
  </button>
  <span class="tooltip" role="tooltip">Save (⌘S)</span>
</span>
```

```tsx
<Tooltip content="Save (⌘S)">
  <Button aria-label="Save" icon={IconDeviceFloppy} />
</Tooltip>
```

### Sides

Vanilla picks a side with a `.tooltip-wrap-{top|right|bottom|left}` modifier on the wrapper (bare `.tooltip-wrap` defaults to top). The React popup uses `side="top|right|bottom|left"` and the floating-UI positioner avoids collisions automatically.

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

The popup body accepts any inline content — e.g. a keyboard shortcut hint. For React, drop down to subparts when the shorthand's `content` prop isn't enough.

**Example**

```html
<span class="tooltip-wrap">
  <button type="button" class="btn">Save</button>
  <span class="tooltip" role="tooltip">Save changes <kbd>⌘S</kbd></span>
</span>
```

```tsx
<Tooltip.Root>
  <Tooltip.Trigger render={<Button>Save</Button>} />
  <Tooltip.Popup>
    Save changes <kbd>⌘S</kbd>
  </Tooltip.Popup>
</Tooltip.Root>
```

## Vanilla path notes

The vanilla `.tooltip-wrap` pattern is CSS-only, so the tooltip lives inside the trigger's stacking context and can be clipped by an ancestor with `overflow: hidden`. For portal-style placement, the platform-native future is [`interesttarget`](https://open-ui.org/components/interest-invokers.explainer/) + `<div popover="hint">` — currently Chromium-only behind a flag, so this system ships the CSS-only pattern today and will revisit when cross-browser support lands.
