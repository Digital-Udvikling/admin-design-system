All notable changes to `@aortl/admin-css` and `@aortl/admin-react` are documented here. The two packages share a version and release together; each entry is tagged `(css)`, `(react)`, or `(both)` to show which package a consumer needs to bump.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- `Alert` dismiss button (`onDismiss` / `.alert-dismiss`). (both)
- `StatCard` `trend` slot with a directional caret and direction-independent intent color (`.stat-card-trend`). (both)
- `AvatarGroup` `max` overflow with a `+N` tile (`.avatar-more`). (both)
- `Indicator` `max` clamp for numeric labels (e.g. `99+`). (react)
- `Table` density (`compact`), an empty-state row (`Table.Empty` / `.table-empty`), and a pinned first column (`pinCol` / `.table-pin-col`). (both)

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

[Unreleased]: https://github.com/Digital-Udvikling/admin-design-system/compare/v0.17.0...HEAD
[0.16.1]: https://github.com/Digital-Udvikling/admin-design-system/compare/v0.16.0...v0.16.1
[0.16.0]: https://github.com/Digital-Udvikling/admin-design-system/compare/v0.15.1...v0.16.0
[0.15.1]: https://github.com/Digital-Udvikling/admin-design-system/compare/v0.15.0...v0.15.1
[0.15.0]: https://github.com/Digital-Udvikling/admin-design-system/releases/tag/v0.15.0

[0.17.0]: https://github.com/Digital-Udvikling/admin-design-system/compare/v0.16.2...v0.17.0
[0.16.2]: https://github.com/Digital-Udvikling/admin-design-system/releases/tag/v0.16.2
