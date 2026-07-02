All notable changes to `@aortl/admin-css` and `@aortl/admin-react` are documented here. The two packages share a version and release together; each entry is tagged `(css)`, `(react)`, or `(both)` to show which package a consumer needs to bump.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.19.1] - 2026-07-02

### Changed

- Copyable `PropertyList` value cells copy on click anywhere in the cell, not only on the copy button (which stays as the keyboard and screen-reader path). Selecting text or clicking an interactive child doesn't trigger a copy; the cell shows a pointer cursor. (both)

## [0.19.0] - 2026-07-02

### Added

- `ToggleButton` — a two-state button styled like `Button` (same variants, sizes, icons, `hotkey`), wrapping Base UI Toggle. CSS-side there is no new class: any `.btn` with an `aria-pressed` attribute renders a leading mini-switch indicator, and `aria-pressed="true"` slides it on and adds a selected wash — so vanilla toggles and `.btn-group` composition work out of the box. (both)

### Fixed

- Dialog body no longer clips its content in Safari. `.dialog-body` (and the form-dialog wrapper) used `flex: 1 1 0%`; Safari collapses a `flex-basis: 0` item that is itself an `overflow` scroll container to ~0 content height, so even short bodies were cut off behind a scrollbar. Switched to `flex: 1 1 auto` — content still shrinks and scrolls when tall. (css)

## [0.18.5] - 2026-06-30

### Fixed

- Global hotkey handling no longer throws on synthetic `keydown` events that omit `key` (autofill, password managers, some IMEs); `normalizeEvent` now treats a `key`-less event as no chord. (react)

## [0.18.4] - 2026-06-29

### Added

- `Tabs` `primary` prop (`.tabs-primary`) fills the active segment of a boxed segmented control with the primary color. (both)
- `.btn-group` members can be wrapped in `.indicator` to float a badge or status dot at a button's corner; the seam, rounding, and full-width/vertical sizing logic now drills through the wrapper. (css)

## [0.18.3] - 2026-06-29

### Added

- `Tabs.Tab` `icon` prop (leading glyph via `renderIcon`); tab SVG icons are pinned to the label size (`.tabs .tab > svg`), so non-Tabler sets (e.g. Heroicons) render uniformly. (both)
- `Tabs` `wrap` prop (`.tabs-wrap`) lets the list wrap onto new rows instead of overflowing, keeping each tab's label on one line. (both)

## [0.18.2] - 2026-06-29

### Added

- `Dialog` `size="auto"` (`.dialog-auto`) shrinks the modal to fit its content, and `size="metabase"` (`.dialog-metabase`) widens it to 1138px with 44px gutters so a full-width embedded iframe lands at 1048px. (both)

## [0.18.1] - 2026-06-25

### Fixed

- Scoped bundle (`admin.scoped.css`) now ships with native CSS nesting pre-flattened. The nested form silently broke once a consumer's build pipeline downleveled it — LightningCSS mis-lowers a nested `&` inside `@scope` to a bare `:scope`, rewriting `._ao-btn:hover` to `:scope:hover` and killing every `:hover`/`:focus`/state rule. (both)

## [0.18.0] - 2026-06-16

### Added

- `classNames` prop for per-slot class overrides on shorthand components — reach inner elements the shorthand props render (`Card`, `StatCard`, `Alert`, `Item`, `Field`, `Dialog`, `Drawer`, `Timeline.Item`, `PropertyList`, `Input`, `NumberInput`, `Pagination`, `Sidebar.Item`/`SubItem`/`Collapsible`/`CollapseToggle`, `Tooltip`). Exports a `SlotClasses` type helper. (react)
- `Alert` dismiss button (`onDismiss` / `.alert-dismiss`). (both)
- `StatCard` `trend` slot with a directional caret and direction-independent intent color (`.stat-card-trend`). (both)
- `AvatarGroup` `max` overflow with a `+N` tile (`.avatar-more`). (both)
- `Indicator` `max` clamp for numeric labels (e.g. `99+`). (react)
- `Table` density (`compact`), an empty-state row (`Table.Empty` / `.table-empty`), and a pinned first column (`pinCol` / `.table-pin-col`). (both)
- `Menu` checkbox/radio items (`checked` / `.menu-item[aria-checked]` + `.menu-item-indicator`). (both)
- `Input` `clearable` button and a `PasswordInput` reveal toggle (`.input-action`). (both)
- `Item` and `ItemGroup` components / `.item` — compact list rows with media, content, and actions. (both)
- `Timeline` component / `.timeline` — vertical event rail with a numbered steps variant. (both)
- `Drawer` component / `.drawer` — edge-anchored panel sharing the `<dialog>` machinery. (both)
- `NumberInput` component / `.number-input` — numeric field with steppers over Base UI NumberField. (both)

## [0.17.0] - 2026-06-15

### Added

- `Separator` component / `.separator` class — a styled `<hr>` with a vertical modifier. (both)
- `Avatar` and `AvatarGroup` / `.avatar` — image with a no-JS initials fallback, circle/square, `sm`/`md`/`lg`, plus `.indicator` auto-offsets for avatar anchors. (both)
- Badge soft tinted variants (`soft` / `.badge-soft`) and a dismissible remove button (`onRemove`, `removeLabel` / `.badge-remove`). (both)
- Alert trailing action slot (`action` / `Alert.Action` / `.alert-action`). (both)
- In-field input icons — `icon` / `iconTrailing` on `Input`, `.input-icon` wrapper. (both)
- Card media slot (`media` / `Card.Media` / `.card-media`) and scroll region (`scroll` on `Card.Container` / `.card-scroll`). (both)
- BrandTile `lg` size, soft tint variants, and bordered image tiles. (both)

### Changed

- `.link` inside an `.alert` inherits the variant's content color instead of the link blue. (css)
- `tfoot` rows are styled by default — semibold cells with a strong divider above the first footer row (previously unstyled). (css)

## [0.16.2] - 2026-06-11

- Add a changelog following the Keep a Changelog format.

## [0.16.1] - 2026-06-03

### Fixed

- Break long unbreakable tokens instead of overflowing flex/grid tracks. (css)

## [0.16.0] - 2026-06-03

### Added

- `Prose` component / `.prose` class for styling rendered markdown and HTML. (both)

### Changed

- Rename the default `Progress` and chart variant from `primary` to `info`. (both)

### Fixed

- Block activation and hotkeys on disabled `Menu` items. (both)
- Style native vanilla checkbox and radio inputs to match the React components. (css)
- Let the `Dialog` body scroll on tall content. (css)
- Merge a consumer-supplied `Dialog` ref so open/close survives. (react)
- Drop `overflow-auto` on `Card` so popovers and focus rings aren't clipped. (css)

## [0.15.1] - 2026-06-02

### Added

- Sliding animation on `Tabs`. (both)

## [0.15.0] - 2026-06-02

### Changed

- Make `primary` a high-contrast neutral and move blue to `info`. (both)
- Use solid color fills for `Alert` and `Badge` status variants. (both)

[Unreleased]: https://github.com/Digital-Udvikling/admin-design-system/compare/v0.19.1...HEAD
[0.16.1]: https://github.com/Digital-Udvikling/admin-design-system/compare/v0.16.0...v0.16.1
[0.16.0]: https://github.com/Digital-Udvikling/admin-design-system/compare/v0.15.1...v0.16.0
[0.15.1]: https://github.com/Digital-Udvikling/admin-design-system/compare/v0.15.0...v0.15.1
[0.15.0]: https://github.com/Digital-Udvikling/admin-design-system/releases/tag/v0.15.0

[0.19.1]: https://github.com/Digital-Udvikling/admin-design-system/compare/v0.19.0...v0.19.1
[0.19.0]: https://github.com/Digital-Udvikling/admin-design-system/compare/v0.18.5...v0.19.0
[0.18.5]: https://github.com/Digital-Udvikling/admin-design-system/compare/v0.18.4...v0.18.5
[0.18.4]: https://github.com/Digital-Udvikling/admin-design-system/compare/v0.18.3...v0.18.4
[0.18.3]: https://github.com/Digital-Udvikling/admin-design-system/compare/v0.18.2...v0.18.3
[0.18.2]: https://github.com/Digital-Udvikling/admin-design-system/compare/v0.18.1...v0.18.2
[0.18.1]: https://github.com/Digital-Udvikling/admin-design-system/compare/v0.18.0...v0.18.1
[0.18.0]: https://github.com/Digital-Udvikling/admin-design-system/compare/v0.17.0...v0.18.0
[0.17.0]: https://github.com/Digital-Udvikling/admin-design-system/compare/v0.16.2...v0.17.0
[0.16.2]: https://github.com/Digital-Udvikling/admin-design-system/releases/tag/v0.16.2
