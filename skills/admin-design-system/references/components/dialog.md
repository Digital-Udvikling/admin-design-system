# Dialogs

> Modal dialogs built on the native dialog element.

## Contents

- [Examples](#examples)
  - [Basic](#basic)
  - [Sizes](#sizes)
  - [Metabase embed](#metabase-embed)
  - [Form dialog](#form-dialog)
  - [Destructive, no light dismiss](#destructive-no-light-dismiss)
  - [Composed with Dialog.Container](#composed-with-dialogcontainer)
  - [Controlled state](#controlled-state)
- [Reference](#reference)
  - [React](#react)
  - [Vanilla](#vanilla)

## Examples

### Basic

**Example**

```html
<button type="button" class="btn btn-primary" commandfor="dialog-basic" command="show-modal">
  Open dialog
</button>
<dialog id="dialog-basic" class="dialog" closedby="any">
  <div class="dialog-header">
    <h2 class="dialog-title">Invite teammate</h2>
    <button
      type="button"
      class="dialog-close"
      commandfor="dialog-basic"
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
  <p class="dialog-description">They'll receive an email with a sign-up link.</p>
  <div class="dialog-body">
    <p>Pick a role after they accept.</p>
  </div>
  <div class="dialog-footer">
    <button type="button" class="btn btn-ghost" commandfor="dialog-basic" command="close">
      Cancel
    </button>
    <button type="button" class="btn btn-primary" commandfor="dialog-basic" command="close">
      Send invite
    </button>
  </div>
</dialog>
```

```tsx
<Button variant="primary" commandfor="dialog-basic-r" command="show-modal">
  Open dialog
</Button>
<Dialog
  id="dialog-basic-r"
  title="Invite teammate"
  description="They'll receive an email with a sign-up link."
  actions={
    <>
      <Button variant="ghost" commandfor="dialog-basic-r" command="close">
        Cancel
      </Button>
      <Button variant="primary" commandfor="dialog-basic-r" command="close">
        Send invite
      </Button>
    </>
  }
>
  <p>Pick a role after they accept.</p>
</Dialog>
```

### Sizes

**Example**

```html
<button type="button" class="btn" commandfor="dialog-sm" command="show-modal">Small</button>
<button type="button" class="btn" commandfor="dialog-md" command="show-modal">Medium</button>
<button type="button" class="btn" commandfor="dialog-lg" command="show-modal">Large</button>
<button type="button" class="btn" commandfor="dialog-auto" command="show-modal">Auto</button>

<dialog id="dialog-sm" class="dialog dialog-sm">
  <div class="dialog-header">
    <h2 class="dialog-title">Small</h2>
  </div>
  <div class="dialog-body">Up to 24rem wide.</div>
  <div class="dialog-footer">
    <button type="button" class="btn" commandfor="dialog-sm" command="close">Close</button>
  </div>
</dialog>

<dialog id="dialog-md" class="dialog">
  <div class="dialog-header">
    <h2 class="dialog-title">Medium</h2>
  </div>
  <div class="dialog-body">Default — up to 32rem.</div>
  <div class="dialog-footer">
    <button type="button" class="btn" commandfor="dialog-md" command="close">Close</button>
  </div>
</dialog>

<dialog id="dialog-lg" class="dialog dialog-lg">
  <div class="dialog-header">
    <h2 class="dialog-title">Large</h2>
  </div>
  <div class="dialog-body">Up to 48rem — room for two-column forms.</div>
  <div class="dialog-footer">
    <button type="button" class="btn" commandfor="dialog-lg" command="close">Close</button>
  </div>
</dialog>

<dialog id="dialog-auto" class="dialog dialog-auto">
  <div class="dialog-header">
    <h2 class="dialog-title">Auto</h2>
  </div>
  <div class="dialog-body">Shrinks to fit its content.</div>
  <div class="dialog-footer">
    <button type="button" class="btn" commandfor="dialog-auto" command="close">Close</button>
  </div>
</dialog>
```

```tsx
<Button commandfor="dialog-sm-r" command="show-modal">Small</Button>
<Button commandfor="dialog-md-r" command="show-modal">Medium</Button>
<Button commandfor="dialog-lg-r" command="show-modal">Large</Button>
<Button commandfor="dialog-auto-r" command="show-modal">Auto</Button>

<Dialog
  id="dialog-sm-r"
  size="sm"
  title="Small"
  dismissible={false}
  actions={<Button commandfor="dialog-sm-r" command="close">Close</Button>}
>
  Up to 24rem wide.
</Dialog>
<Dialog
  id="dialog-md-r"
  title="Medium"
  dismissible={false}
  actions={<Button commandfor="dialog-md-r" command="close">Close</Button>}
>
  Default — up to 32rem.
</Dialog>
<Dialog
  id="dialog-lg-r"
  size="lg"
  title="Large"
  dismissible={false}
  actions={<Button commandfor="dialog-lg-r" command="close">Close</Button>}
>
  Up to 48rem — room for two-column forms.
</Dialog>
<Dialog
  id="dialog-auto-r"
  size="auto"
  title="Auto"
  dismissible={false}
  actions={<Button commandfor="dialog-auto-r" command="close">Close</Button>}
>
  Shrinks to fit its content.
</Dialog>
```

### Metabase embed

**Example**

```html
<button type="button" class="btn" commandfor="dialog-metabase" command="show-modal">
  Open report
</button>

<dialog id="dialog-metabase" class="dialog dialog-metabase">
  <div class="dialog-header">
    <h2 class="dialog-title">Revenue report</h2>
    <button
      type="button"
      class="dialog-close"
      commandfor="dialog-metabase"
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
    <iframe
      src="https://metabase.example.com/public/dashboard/…"
      style="width: 100%; aspect-ratio: 16 / 9; border: 0;"
      title="Revenue report"
    ></iframe>
  </div>
</dialog>
```

```tsx
<Button commandfor="dialog-metabase-r" command="show-modal">Open report</Button>

<Dialog id="dialog-metabase-r" size="metabase" title="Revenue report">
  <iframe
    src="https://metabase.example.com/public/dashboard/…"
    style={{ width: "100%", aspectRatio: "16 / 9", border: 0 }}
    title="Revenue report"
  />
</Dialog>
```

### Form dialog

**Example**

```html
<button type="button" class="btn btn-primary" commandfor="dialog-form" command="show-modal">
  Rename project
</button>
<dialog id="dialog-form" class="dialog">
  <form method="dialog">
    <div class="dialog-header">
      <h2 class="dialog-title">Rename project</h2>
      <button
        type="button"
        class="dialog-close"
        commandfor="dialog-form"
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
      <div class="field">
        <label class="field-label" for="dialog-form-name">Name</label>
        <input id="dialog-form-name" class="input" name="name" required />
      </div>
    </div>
    <div class="dialog-footer">
      <button type="submit" class="btn btn-ghost" value="cancel" formnovalidate>Cancel</button>
      <button type="submit" class="btn btn-primary" value="save">Save</button>
    </div>
  </form>
</dialog>
```

```tsx
<Button variant="primary" commandfor="dialog-form-r" command="show-modal">
  Rename project
</Button>
<Dialog.Container id="dialog-form-r">
  <form method="dialog">
    <Dialog.Header>
      <Dialog.Title>Rename project</Dialog.Title>
      <Dialog.CloseButton />
    </Dialog.Header>
    <Dialog.Body>
      <Field>
        <Field.Label>Name</Field.Label>
        <Input name="name" required />
      </Field>
    </Dialog.Body>
    <Dialog.Footer>
      <Button type="submit" variant="ghost" value="cancel" formNoValidate>
        Cancel
      </Button>
      <Button variant="primary" type="submit" value="save">
        Save
      </Button>
    </Dialog.Footer>
  </form>
</Dialog.Container>
```

### Destructive, no light dismiss

**Example**

```html
<button type="button" class="btn btn-danger" commandfor="dialog-destroy" command="show-modal">
  Delete project
</button>
<dialog id="dialog-destroy" class="dialog dialog-sm" closedby="closerequest">
  <div class="dialog-header">
    <h2 class="dialog-title">
      <i class="ti ti-alert-triangle" aria-hidden="true"></i>
      Delete project?
    </h2>
  </div>
  <p class="dialog-description">This permanently removes all data. This cannot be undone.</p>
  <div class="dialog-footer">
    <button type="button" class="btn btn-ghost" commandfor="dialog-destroy" command="close">
      Cancel
    </button>
    <button type="button" class="btn btn-danger" commandfor="dialog-destroy" command="close">
      Delete
    </button>
  </div>
</dialog>
```

```tsx
<Button variant="danger" commandfor="dialog-destroy-r" command="show-modal">
  Delete project
</Button>
<Dialog
  id="dialog-destroy-r"
  size="sm"
  closedby="closerequest"
  dismissible={false}
  icon={IconAlertTriangle}
  title="Delete project?"
  description="This permanently removes all data. This cannot be undone."
  actions={
    <>
      <Button variant="ghost" commandfor="dialog-destroy-r" command="close">
        Cancel
      </Button>
      <Button variant="danger" commandfor="dialog-destroy-r" command="close">
        Delete
      </Button>
    </>
  }
/>
```

### Composed with Dialog.Container

**Example**

```tsx
<Button commandfor="dialog-custom-r" command="show-modal">
  Settings
</Button>
<Dialog.Container id="dialog-custom-r" size="lg">
  <Dialog.Header>
    <Dialog.Title>Workspace settings</Dialog.Title>
    <Dialog.CloseButton />
  </Dialog.Header>
  <Dialog.Body>
    <Field>
      <Field.Label>Name</Field.Label>
      <Input defaultValue="Acme Inc." />
    </Field>
    <Field>
      <Field.Label>Billing email</Field.Label>
      <Input type="email" defaultValue="ops@acme.test" />
    </Field>
  </Dialog.Body>
  <Dialog.Footer>
    <Button variant="ghost" commandfor="dialog-custom-r" command="close">
      Cancel
    </Button>
    <Button commandfor="dialog-custom-r" command="close">
      Save changes
    </Button>
  </Dialog.Footer>
</Dialog.Container>
```

### Controlled state

```tsx
import { useState } from "react";
import { Button, Dialog } from "@aortl/admin-react";

function ConfirmDelete({ onConfirm }: { onConfirm: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="danger" onClick={() => setOpen(true)}>
        Delete
      </Button>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        size="sm"
        closedby="closerequest"
        title="Delete project?"
        description="This cannot be undone."
        actions={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                onConfirm();
                setOpen(false);
              }}
            >
              Delete
            </Button>
          </>
        }
      />
    </>
  );
}
```

## Reference

### React

| Part                 | Renders    | Class                |
| -------------------- | ---------- | -------------------- |
| `Dialog`             | `<dialog>` | `dialog`             |
| `Dialog.Container`   | `<dialog>` | `dialog`             |
| `Dialog.Header`      | `<div>`    | `dialog-header`      |
| `Dialog.Title`       | `<h2>`     | `dialog-title`       |
| `Dialog.Description` | `<p>`      | `dialog-description` |
| `Dialog.Body`        | `<div>`    | `dialog-body`        |
| `Dialog.Footer`      | `<div>`    | `dialog-footer`      |
| `Dialog.CloseButton` | `<button>` | `dialog-close`       |

| Part                 | Prop           | Type                                           | Default   |
| -------------------- | -------------- | ---------------------------------------------- | --------- |
| `Dialog`             | `open`         | `boolean`                                      | —         |
| `Dialog`             | `onOpenChange` | `(open: boolean) => void`                      | —         |
| `Dialog`             | `size`         | `"sm" \| "md" \| "lg" \| "auto" \| "metabase"` | `"md"`    |
| `Dialog`             | `closedby`     | `"any" \| "closerequest" \| "none"`            | `"any"`   |
| `Dialog`             | `icon`         | [`IconProp`](../basics/conventions.md#icons)  | —         |
| `Dialog`             | `title`        | `ReactNode`                                    | —         |
| `Dialog`             | `description`  | `ReactNode`                                    | —         |
| `Dialog`             | `actions`      | `ReactNode`                                    | —         |
| `Dialog`             | `dismissible`  | `boolean`                                      | `true`    |
| `Dialog`             | `closeLabel`   | `string`                                       | `"Close"` |
| `Dialog`             | `classNames`   | [slots](../basics/conventions.md#classnames)  | —         |
| `Dialog.Title`       | `icon`         | [`IconProp`](../basics/conventions.md#icons)  | —         |
| `Dialog.CloseButton` | `icon`         | [`IconProp`](../basics/conventions.md#icons)  | X glyph   |

`Dialog` assembles header (title, `icon`, close button), description, body and footer around its children; `dismissible={false}` drops the X. `classNames` covers `header`, `title`, `close`, `description`, `body`, `footer`.

`size` and `closedby` live on the element, so they work on [`Dialog.Container`](../basics/conventions.md#container-escape-hatch) too — the form to use when the layout doesn't fit, most often to wrap everything in a `<form>`. `Dialog.Title` keeps its `icon` prop there.

Leave `open` off for the uncontrolled case, as the Invoker Commands pattern below does: no state, no effect, no ref. Pass `open` with `onOpenChange` when the open state belongs to React (a multi-step flow, an async submit, a deep-linked route): the wrapper bridges it to `showModal()` / `close()` and forwards the native `close` event back as `onOpenChange(false)`, so Esc and backdrop clicks stay in sync with your state.

Plus native `<dialog>` attributes.

### Vanilla

| Class                | Effect                                                                                                                          |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `dialog`             | Centred modal: `32rem` max-width, `0.75rem` radius, large shadow, capped to the viewport, scrim backdrop, `150ms` fade and lift |
| `dialog-sm`          | `24rem` max-width — confirms                                                                                                    |
| `dialog-lg`          | `48rem` — longer forms                                                                                                          |
| `dialog-auto`        | Shrinks to content, still capped to the viewport                                                                                |
| `dialog-metabase`    | `1138px` wide with `2.75rem` gutters, so a full-width body child lands at `1048px`                                              |
| `dialog-header`      | Title row: `1.25rem` side padding, `0.75rem` gap                                                                                |
| `dialog-title`       | `text-lg` semibold, `0.5rem` gap for a leading icon                                                                             |
| `dialog-description` | `text-sm` muted, tucked under the header                                                                                        |
| `dialog-body`        | The scrolling region; header and footer stay pinned                                                                             |
| `dialog-footer`      | Action row: muted fill, top border, right-aligned, wrapping                                                                     |
| `dialog-close`       | `1.75rem` square X button                                                                                                       |

There is no `dialog-md` — it's the unmodified `dialog`. Everything modal comes from the native element via `showModal()`: focus trap, scroll lock, Esc, and `::backdrop`. The fade and lift use `@starting-style` with `transition-behavior: allow-discrete`, so the exit animation runs without JavaScript.

Open it without JavaScript through the [Invoker Commands API](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#commandfor): a `<button commandfor="<dialog-id>" command="show-modal">`, and `command="close"` to dismiss. The `closedby` attribute picks the dismissal set — `"any"` (the default) allows Esc and a backdrop click, `"closerequest"` drops the backdrop click, the right choice for an irreversible action, and `"none"` requires an explicit close.

Wrap the contents in `<form method="dialog">` and any submit button inside closes the dialog, with the submitter's `value` landing on the dialog's `returnValue` — that's the whole pattern for a form dialog, no handler required.

Write the close button's `aria-label` yourself. Don't put `overflow: hidden` on the root to clip the footer's fill — it also clips any [menu](menus.md) or [select](forms/selects.md) popup inside; the footer inherits the corner radius instead.

For an edge-anchored panel rather than a centred one, use a [Drawer](drawer.md).
