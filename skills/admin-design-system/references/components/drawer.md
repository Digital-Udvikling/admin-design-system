# Drawers

> Edge-anchored panel built on the native dialog element.

## Contents

- [Examples](#examples)
  - [Basic](#basic)
  - [Sides](#sides)
  - [Record detail](#record-detail)
- [Reference](#reference)
  - [React](#react)
  - [Vanilla](#vanilla)

## Examples

### Basic

**Example**

```html
<button type="button" class="btn btn-primary" commandfor="drawer-basic" command="show-modal">
  Open drawer
</button>
<dialog id="drawer-basic" class="dialog drawer" closedby="any">
  <div class="dialog-header">
    <h2 class="dialog-title">Filters</h2>
    <button
      type="button"
      class="dialog-close"
      commandfor="drawer-basic"
      command="close"
      aria-label="Close"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
      </svg>
    </button>
  </div>
  <div class="dialog-body">
    <p>Refine the results.</p>
  </div>
  <div class="dialog-footer">
    <button type="button" class="btn btn-ghost" commandfor="drawer-basic" command="close">
      Reset
    </button>
    <button type="button" class="btn btn-primary" commandfor="drawer-basic" command="close">
      Apply
    </button>
  </div>
</dialog>
```

```tsx
<Button variant="primary" commandfor="drawer-basic-r" command="show-modal">
  Open drawer
</Button>
<Drawer
  id="drawer-basic-r"
  title="Filters"
  actions={
    <>
      <Button variant="ghost" commandfor="drawer-basic-r" command="close">
        Reset
      </Button>
      <Button variant="primary" commandfor="drawer-basic-r" command="close">
        Apply
      </Button>
    </>
  }
>
  <p>Refine the results.</p>
</Drawer>
```

### Sides

**Example**

```html
<button type="button" class="btn" commandfor="drawer-start" command="show-modal">Start</button>
<button type="button" class="btn" commandfor="drawer-bottom" command="show-modal">Bottom</button>

<dialog id="drawer-start" class="dialog drawer drawer-start">
  <div class="dialog-header"><h2 class="dialog-title">Navigation</h2></div>
  <div class="dialog-body">Anchored to the inline-start edge.</div>
  <div class="dialog-footer">
    <button type="button" class="btn" commandfor="drawer-start" command="close">Close</button>
  </div>
</dialog>
<dialog id="drawer-bottom" class="dialog drawer drawer-bottom">
  <div class="dialog-header"><h2 class="dialog-title">Quick actions</h2></div>
  <div class="dialog-body">A bottom sheet.</div>
  <div class="dialog-footer">
    <button type="button" class="btn" commandfor="drawer-bottom" command="close">Close</button>
  </div>
</dialog>
```

```tsx
<Button commandfor="drawer-start-r" command="show-modal">Start</Button>
<Button commandfor="drawer-bottom-r" command="show-modal">Bottom</Button>

<Drawer
  id="drawer-start-r"
  side="start"
  title="Navigation"
  dismissible={false}
  actions={
    <Button commandfor="drawer-start-r" command="close">
      Close
    </Button>
  }
>
  Anchored to the inline-start edge.
</Drawer>
<Drawer
  id="drawer-bottom-r"
  side="bottom"
  title="Quick actions"
  dismissible={false}
  actions={
    <Button commandfor="drawer-bottom-r" command="close">
      Close
    </Button>
  }
>
  A bottom sheet.
</Drawer>
```

### Record detail

**Example**

```tsx
<Button commandfor="drawer-record-r" command="show-modal">
  Edit customer
</Button>
<Drawer.Container id="drawer-record-r" size="lg">
  <form method="dialog">
    <Drawer.Header>
      <Drawer.Title>Edit customer</Drawer.Title>
      <Drawer.CloseButton />
    </Drawer.Header>
    <Drawer.Body>
      <Field>
        <Field.Label>Name</Field.Label>
        <Input defaultValue="Ada Lovelace" />
      </Field>
      <Field>
        <Field.Label>Email</Field.Label>
        <Input type="email" defaultValue="ada@example.com" />
      </Field>
    </Drawer.Body>
    <Drawer.Footer>
      <Button variant="ghost" value="cancel" type="submit" formNoValidate>
        Cancel
      </Button>
      <Button variant="primary" value="save" type="submit">
        Save
      </Button>
    </Drawer.Footer>
  </form>
</Drawer.Container>
```

## Reference

### React

A `Drawer` is a [Dialog](dialog.md) anchored to a screen edge, and it re-exports Dialog's parts: `Drawer.Header`, `.Title`, `.Description`, `.Body`, `.Footer`, `.CloseButton` are the same components, emitting the same `dialog-*` classes. `Drawer.Container` is the bare primitive.

| Prop           | Type                                          | Default   |
| -------------- | --------------------------------------------- | --------- |
| `open`         | `boolean`                                     | —         |
| `onOpenChange` | `(open: boolean) => void`                     | —         |
| `side`         | `"start" \| "end" \| "bottom"`                | `"end"`   |
| `size`         | `"sm" \| "md" \| "lg"`                        | `"md"`    |
| `closedby`     | `"any" \| "closerequest" \| "none"`           | `"any"`   |
| `icon`         | [`IconProp`](../basics/conventions.md#icons) | —         |
| `title`        | `ReactNode`                                   | —         |
| `description`  | `ReactNode`                                   | —         |
| `actions`      | `ReactNode`                                   | —         |
| `dismissible`  | `boolean`                                     | `true`    |
| `closeLabel`   | `string`                                      | `"Close"` |
| `classNames`   | [slots](../basics/conventions.md#classnames) | —         |

`size` sets the cross-axis extent: a width for a side drawer, a max-height for a bottom sheet. Everything else — the shorthand props, `classNames` slots, the controlled/uncontrolled split, the `<form method="dialog">` pattern — behaves exactly as on [Dialog](dialog.md#reference). Plus native `<dialog>` attributes.

### Vanilla

Pair `drawer` with `dialog`: the drawer classes override the centring and radius, and inherit everything else, including the backdrop and the fade.

| Class           | Effect                                                                                                       |
| --------------- | ------------------------------------------------------------------------------------------------------------ |
| `drawer`        | Full-height panel on the inline-end edge, `min(28rem, 100vw)` wide, square corners, sliding in from the edge |
| `drawer-start`  | Inline-start edge instead                                                                                    |
| `drawer-bottom` | Bottom sheet: full width, `85dvh` max-height, sliding up                                                     |
| `drawer-sm`     | `min(20rem, 100vw)` wide — or `50dvh` tall as a bottom sheet                                                 |
| `drawer-lg`     | `min(36rem, 100vw)` — or `95dvh` tall                                                                        |

There is no `drawer-md` or `drawer-end` — both are the unmodified `drawer`. The slide is dropped under `prefers-reduced-motion: reduce`, keeping the opacity fade.

Modal behaviour, the Invoker Commands trigger, `closedby`, and the `<form method="dialog">` pattern are all Dialog's — see [its reference](dialog.md#reference).

There is deliberately no non-modal or persistent drawer: it would give up the focus trap and scroll lock that `showModal()` provides for free, and a panel that doesn't trap focus is a [Card](cards.md) or a sidebar, not a drawer.
