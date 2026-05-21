# Menus

> Dropdown menu built on native <details> + <summary>.

IconPencil,
  IconCopy,
  IconTrash,
  IconBook,
  IconHistory,
  IconLifebuoy,
} from "@tabler/icons-react";

A `<details>` with a `<summary>` trigger and a positioned popup. The browser handles open/close; the chevron tracks `[open]` via CSS. There is no light dismiss — click the trigger again or move focus to close.

`.menu-trigger` carries only behaviour, so adding `.btn` overrides its appearance — drop the trigger into a `<ButtonGroup>` to build a split button.

## Examples

### Basic

See [Icons](/admin-design-system/basics/icons/) for the recommended library.

**Example**

```html
<details class="menu">
  <summary class="menu-trigger">Open menu</summary>
  <div class="menu-popup" role="menu">
    <button class="menu-item" type="button">
      <i class="ti ti-pencil" aria-hidden="true"></i>
      Edit
    </button>
    <button class="menu-item" type="button">
      <i class="ti ti-copy" aria-hidden="true"></i>
      Duplicate
    </button>
    <hr class="menu-separator" />
    <button class="menu-item" type="button">
      <i class="ti ti-trash" aria-hidden="true"></i>
      Delete
    </button>
  </div>
</details>
```

```tsx
<Menu>
  <Menu.Trigger>Open menu</Menu.Trigger>
  <Menu.Popup>
    <Menu.Item icon={IconPencil}>Edit</Menu.Item>
    <Menu.Item icon={IconCopy}>Duplicate</Menu.Item>
    <Menu.Separator />
    <Menu.Item icon={IconTrash}>Delete</Menu.Item>
  </Menu.Popup>
</Menu>
```

### Grouped items

Cluster related entries with `<Menu.Group>` + `<Menu.GroupLabel>`.

**Example**

```tsx
<Menu>
  <Menu.Trigger>Resources</Menu.Trigger>
  <Menu.Popup>
    <Menu.Group>
      <Menu.GroupLabel>Internal</Menu.GroupLabel>
      <Menu.Item href="#docs" icon={IconBook}>
        Docs
      </Menu.Item>
      <Menu.Item href="#changelog" icon={IconHistory}>
        Changelog
      </Menu.Item>
    </Menu.Group>
    <Menu.Separator />
    <Menu.Group>
      <Menu.GroupLabel>External</Menu.GroupLabel>
      <Menu.Item href="#support" icon={IconLifebuoy}>
        Support
      </Menu.Item>
    </Menu.Group>
  </Menu.Popup>
</Menu>
```

Set `href` on `<Menu.Item>` for a real link (right-click → open in new tab, copy URL). Without `href` it renders as a `<button>`.

### Button-styled trigger

Add `btn` + a variant class to the `<summary>` — `.menu-trigger`'s default appearance steps aside.

**Example**

```html
<details class="menu">
  <summary class="menu-trigger btn btn-primary">Actions</summary>
  <div class="menu-popup" role="menu">
    <button class="menu-item" type="button">Approve</button>
    <button class="menu-item" type="button">Reject</button>
    <hr class="menu-separator" />
    <button class="menu-item" type="button">Send to review</button>
  </div>
</details>
```

```tsx
<Menu>
  <Menu.Trigger className="btn btn-primary">Actions</Menu.Trigger>
  <Menu.Popup>
    <Menu.Item>Approve</Menu.Item>
    <Menu.Item>Reject</Menu.Item>
    <Menu.Separator />
    <Menu.Item>Send to review</Menu.Item>
  </Menu.Popup>
</Menu>
```

### Split button

A primary action on the left, related actions on the right via a `<details>` inside a `<ButtonGroup>`.

**Example**

```html
<div class="btn-group">
  <button class="btn btn-primary" type="button">Save</button>
  <details class="menu">
    <summary
      class="menu-trigger btn btn-primary"
      style="padding-left: 0.75rem; padding-right: 0.75rem"
      aria-label="More save options"
    ></summary>
    <div class="menu-popup" role="menu">
      <button class="menu-item" type="button">Save as draft</button>
      <button class="menu-item" type="button">Save and publish</button>
      <hr class="menu-separator" />
      <button class="menu-item" type="button">Save a copy…</button>
    </div>
  </details>
</div>
```

```tsx
<ButtonGroup>
  <Button variant="primary">Save</Button>
  <Menu>
    <Menu.Trigger
      className="btn btn-primary"
      style={{ paddingLeft: "0.75rem", paddingRight: "0.75rem" }}
      aria-label="More save options"
    />
    <Menu.Popup>
      <Menu.Item>Save as draft</Menu.Item>
      <Menu.Item>Save and publish</Menu.Item>
      <Menu.Separator />
      <Menu.Item>Save a copy…</Menu.Item>
    </Menu.Popup>
  </Menu>
</ButtonGroup>
```

The summary is empty — the chevron from `.menu-trigger::after` is the only visible glyph, so add `aria-label` for screen readers.
