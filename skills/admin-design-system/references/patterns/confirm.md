# Confirm before submit

> Ask before a destructive action runs.

## Contents

- [Examples](#examples)
  - [Server-rendered form](#server-rendered-form)
  - [Row actions](#row-actions)
  - [Promise-based (React only)](#promise-based-react-only)
- [Built from](#built-from)

## Examples

### Server-rendered form

The trigger opens the dialog with an invoker command, and the dialog holds the form that posts the action. Put the framework's CSRF field inside that form.

**Example**

```html
<button type="button" class="btn btn-danger" commandfor="confirm-archive" command="show-modal">
  Archive supplier
</button>
<dialog
  id="confirm-archive"
  class="dialog dialog-sm"
  closedby="closerequest"
  role="alertdialog"
  aria-labelledby="confirm-archive-title"
  aria-describedby="confirm-archive-desc"
>
  <form method="post" action="/suppliers/118/archive">
    <div class="dialog-header">
      <h2 id="confirm-archive-title" class="dialog-title">
        <i class="ti ti-alert-triangle" aria-hidden="true"></i>
        Archive Nordic Fittings?
      </h2>
    </div>
    <p id="confirm-archive-desc" class="dialog-description">
      Open purchase orders stay open. The supplier is hidden from new orders.
    </p>
    <div class="dialog-footer">
      <button type="button" class="btn btn-ghost" commandfor="confirm-archive" command="close">
        Cancel
      </button>
      <button type="submit" class="btn btn-danger">Archive</button>
    </div>
  </form>
</dialog>
```

```tsx
<Button variant="danger" commandfor="confirm-archive-r" command="show-modal">
  Archive supplier
</Button>
<Dialog.Container id="confirm-archive-r" size="sm" closedby="closerequest" role="alertdialog">
  <form method="post" action="/suppliers/118/archive">
    <Dialog.Header>
      <Dialog.Title icon={IconAlertTriangle}>Archive Nordic Fittings?</Dialog.Title>
    </Dialog.Header>
    <Dialog.Description>
      Open purchase orders stay open. The supplier is hidden from new orders.
    </Dialog.Description>
    <Dialog.Footer>
      <Button variant="ghost" commandfor="confirm-archive-r" command="close">
        Cancel
      </Button>
      <Button type="submit" variant="danger">
        Archive
      </Button>
    </Dialog.Footer>
  </form>
</Dialog.Container>
```

### Row actions

Render one dialog per row in its actions cell, with the row key in its `id` and `action`. Each row's button opens its own dialog, so the confirmation names the record and posts to its URL.

**Example**

```html
<table class="table">
  <thead>
    <tr>
      <th>Supplier</th>
      <th>Open orders</th>
      <th aria-label="Actions"></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Nordic Fittings</td>
      <td class="table-cell-numeric">3</td>
      <td class="table-cell-actions">
        <button
          type="button"
          class="btn btn-ghost btn-sm btn-square"
          commandfor="confirm-archive-118"
          command="show-modal"
          aria-label="Archive Nordic Fittings"
        >
          <i class="ti ti-archive" aria-hidden="true"></i>
        </button>
        <dialog
          id="confirm-archive-118"
          class="dialog dialog-sm"
          closedby="closerequest"
          role="alertdialog"
          aria-labelledby="confirm-archive-118-title"
        >
          <form method="post" action="/suppliers/118/archive">
            <div class="dialog-header">
              <h2 id="confirm-archive-118-title" class="dialog-title">Archive Nordic Fittings?</h2>
            </div>
            <div class="dialog-footer">
              <button
                type="button"
                class="btn btn-ghost"
                commandfor="confirm-archive-118"
                command="close"
              >
                Cancel
              </button>
              <button type="submit" class="btn btn-danger">Archive</button>
            </div>
          </form>
        </dialog>
      </td>
    </tr>
    <tr>
      <td>Baltic Valves</td>
      <td class="table-cell-numeric">0</td>
      <td class="table-cell-actions">
        <button
          type="button"
          class="btn btn-ghost btn-sm btn-square"
          commandfor="confirm-archive-121"
          command="show-modal"
          aria-label="Archive Baltic Valves"
        >
          <i class="ti ti-archive" aria-hidden="true"></i>
        </button>
        <dialog
          id="confirm-archive-121"
          class="dialog dialog-sm"
          closedby="closerequest"
          role="alertdialog"
          aria-labelledby="confirm-archive-121-title"
        >
          <form method="post" action="/suppliers/121/archive">
            <div class="dialog-header">
              <h2 id="confirm-archive-121-title" class="dialog-title">Archive Baltic Valves?</h2>
            </div>
            <div class="dialog-footer">
              <button
                type="button"
                class="btn btn-ghost"
                commandfor="confirm-archive-121"
                command="close"
              >
                Cancel
              </button>
              <button type="submit" class="btn btn-danger">Archive</button>
            </div>
          </form>
        </dialog>
      </td>
    </tr>
  </tbody>
</table>
```

A table with hundreds of rows can link each row's action to a confirmation page instead, which renders the same dialog content as the page body.

### Promise-based (React only)

In React, `useConfirm()` asks and returns the answer, and the caller runs the action.

**Example**

```tsx
function ArchiveSupplier() {
  const confirm = useConfirm();
  const [status, setStatus] = useState("Active");
  return (
    <>
      <Button
        variant="danger"
        onClick={async () => {
          const ok = await confirm({
            title: "Archive Nordic Fittings?",
            description: "Open purchase orders stay open. The supplier is hidden from new orders.",
            confirmLabel: "Archive",
            variant: "danger",
          });
          if (ok) setStatus("Archived");
        }}
      >
        Archive supplier
      </Button>
      <span>{status}</span>
    </>
  );
}

<ArchiveSupplier />;
```

## Built from

[Dialog](../components/dialog.md) with `role="alertdialog"` and `closedby="closerequest"`, so a backdrop click doesn't dismiss it, and [Button](../components/buttons.md). To ask for a single text value, use [`usePrompt()`](../components/dialog.md).
