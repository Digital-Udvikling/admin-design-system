All notable changes to `@aortl/admin-css` and `@aortl/admin-react` are documented here. The two packages share a version and release together; each entry is tagged `(css)`, `(react)`, or `(both)` to show which package a consumer needs to bump.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.22.0] - 2026-09-30

### Breaking

- `@aortl/admin-css` exports `theme.css`, `components.css` and `fonts.css` in place of `./src/*`; `@aortl/admin-react` drops `./styles.scoped.css` (use `./styles.css`). (both)
- `@aortl/admin-react` ships ES modules only; the CommonJS build and `require` condition are removed. (react)
- The `react` and `react-dom` peer range is `^19.2.0`. (react)
- Form control `danger`/`info`/`success`/`warning` variants are removed: `variant` is `bordered` or `ghost`, and invalid comes from `aria-invalid`, an invalid `Field` or `:user-invalid`. See [Fields](https://digital-udvikling.github.io/admin-design-system/components/forms/fields/). (both)
- `inputSize`, `triggerSize` and `textareaSize` → `size`; `Input` rejects the native `size` attribute. (react)
- `.input`, `.number-input` and `Select.Trigger` match the `.btn` height per size, so pair same-size controls (`input-sm` with `btn-sm`). (both)
- `<Field error>` marks the field invalid unless `invalid` is passed. (react)
- `tabs-primary` / `Tabs` `primary` are removed; drop `tabs-sm` on boxed tabs beside md buttons. (both)
- `item-outline` / `variant="outline"` → `item-bordered` / `variant="bordered"`. (both)
- `brand-tile-info`, `-success` and `-danger` are solid; add `brand-tile-soft` / `soft` for the tint. (both)
- `Avatar` `shape` → `square`; the `AvatarShape` type is removed. (react)
- `.alert` is a block: put body text in `alert-description` after `alert-title`; `Alert.Description` renders a `<div>`. (both)
- `.link` is `inline`, and `inline-flex` only with a direct icon child. (css)
- `Timeline` `horizontal` → `orientation="horizontal"`, `Table.Cell` `align` takes `start`/`center`/`end`, and `tooltip-wrap-left`/`-right` → `-start`/`-end`. (both)
- `--value`, `--bar-color`, `--segment-color`, `--legend-color` → `--chart-value`, `--chart-bar-color`, `--chart-segment-color`, `--chart-legend-color`. (css)
- `BarProps`, `SegmentProps`, `TrendDirection`, `TrendIntent` → `BarChartBarProps`, `StackedBarSegmentProps`, `StatCardTrendDirection`, `StatCardTrendIntent`. (react)
- Vanilla menus use `popover`: new markup, a unique `id` per menu, and native inputs for checkable items. See [Menus](https://digital-udvikling.github.io/admin-design-system/components/menus/). (css)
- `Menu` is built on Base UI Menu: `Menu.Popup` portals, and `role="menuitemradio"` items become `Menu.RadioItem` in a `Menu.RadioGroup`. See [Menus](https://digital-udvikling.github.io/admin-design-system/components/menus/). (react)
- `Navbar.Dropdown` is built on `Menu`, and the vanilla `navbar-dropdown` uses the popover menu markup. (both)
- `Navbar.Item`, `Sidebar.Item`, `Sidebar.SubItem`: `active` → `current`. (react)
- `Spinner`, `Navbar.MobileToggle`, `Sidebar.CollapseToggle`: `label` → `aria-label`. (react)
- `--app-shell-sidebar-w` / `-collapsed` → `--sidebar-width` / `--sidebar-width-collapsed`. (css)
- `page-*` pagination classes → `pagination-item`, `pagination-link`, `pagination-ellipsis`; mark the current page with `aria-current="page"`. (both)
- Undocumented custom properties (`--btn-hover`, `--table-row-bg`, `--timeline-accent`, …) are renamed to internal `--_*`. (css)
- `Table` `relaxed` → `density="relaxed"`. (react)
- The `ChartType` type export is removed. (react)

### Added

- `--color-category-*` and `-muted` tints for colour-coding categories, with `text-`, `bg-` and `border-category-*` utilities. (css)
- `--color-surface-hover` and `--color-surface-stripe` washes, with `bg-` utilities. (css)
- `--surface-current`: set it on your own filled containers so rings and pinned cells match their fill. (css)
- `renderIcon` and the `IconProp`, `IconComponent` and `IconRenderProps` types are exported. (react)
- `btn-danger-ghost` / `<Button variant="danger-ghost">`. (both)
- `BrandTile` `variant="warning"` (`brand-tile-warning`). (both)
- `StatusDot`, a standalone status dot. (both)
- `Tooltip` `delay` and `closeDelay`. (react)
- `number-input-ghost` / `<NumberInput variant="ghost">`, and `aria-invalid` on `NumberInput`. (both)
- `Input.Action` for the `Input` `action` slot. (react)
- `icon` on `Select.Trigger` and `Accordion.Summary`. (react)
- `usePrompt()`, a promise-based `window.prompt`. (react)
- `Dialog` and `Drawer` focus the `data-autofocus` descendant on open. (react)
- Vanilla tab panels up to 12 (`data-value` `1`–`12`). (css)
- `CopyButton` and `useCopy()`. (react)
- `selected` on `Item` / `[data-selected]` on `.item`. (both)
- A `.card`, `.badge` or `.item` that is a link gets hover and focus styles. (css)
- `.prose` styles `<kbd>` and GFM task lists. (css)
- Sortable column headers: `table-sort` / `Table.HeaderCell` `sort` and `onSort`. (both)
- `table-cell-actions` / `Table.Cell actions` for row actions, and `table-scroll` / `Table.Scroll` for wide tables. (both)
- `--chart-legend-gap`. (css)
- `Timeline.Item` `status="current"` sets `aria-current="step"`. (react)
- `Combobox`: filterable single or multi select, with chips, empty/loading states and server search. (both)
- `Menu` keyboard navigation and typeahead, with `open`, `defaultOpen`, `onOpenChange` and `modal`. (react)
- `Menu.Actions`, `Menu.Item` `closeOnClick` and `danger`, `Menu.Popup` `align="end"`, and `Menu.Trigger` `icon`. (both)
- `Navbar.Dropdown` `active`, `align` and `classNames`. (react)
- `page-center` / `PageCenter` for sign-in and error pages. (both)
- `render` on `Link`, `Badge`, `Item`, `Menu.Item`, nav items and more, for router links: `render={<NextLink href="/orders" />}`. (react)
- `Pagination` `renderItem` receives `PaginationItemProps` to spread onto a router link. (react)
- `.sidebar[data-collapsed]`, and `Sidebar` `collapsed` without a collapse toggle. (both)
- A `.sidebar` inside a `.drawer` dialog for a vanilla mobile nav. (css)
- `.app-shell` detects a child `.sidebar`, so `app-shell-with-sidebar` / `hasSidebar` is optional. (both)
- Type exports: `TableDensity`, `TableEmptyProps`, `DonutCenterProps`, `AppShellContextValue`, `HotkeyHandler`, `ConfirmFn`, `PromptFn`, `BrandTileSize`. (react)
- React Server Component support; `Pagination`'s default buttons need a Client Component parent. (react)

### Changed

- Visual refresh: flatter cards, `rounded-md` controls, bordered dialogs and popups, denser menus, accordions and sidebar rows, translucent hover fills, and AA text contrast. (css)
- IBM Plex ships in the package instead of loading from Google Fonts. (both)
- `@base-ui/react` is a `^1.4.1` range, so an app that also uses Base UI shares one copy. (react)
- Scoped tokens have zero specificity, so `._ao-admin-root { --color-primary: … }` overrides them. (css)
- `card-title`, `dialog-title`, `stat-card-label` and similar lay out as text: in JSX put `{" "}` before a trailing element. (css)
- `Select` is generic over its value, so `onValueChange` is typed. (react)
- `Select.Popup` takes `side`, `align` and `alignOffset`; wrap a custom chevron in `Select.Icon`. (both)
- An `Input` `action` replaces the clear button. (both)
- `NumberInput` `ref`, `className` and `style` target the visible group; `classNames.root` targets the Base UI Root. (react)
- An `indicator` around a form control fills the width; set a narrower width on the `indicator`. (css)
- The vanilla tooltip opens on focus but not on click, and flips to stay in the viewport. (css)
- `Menu.Item` hotkeys fire while the menu is closed. (react)
- Pagination previous and next stay focusable with `aria-disabled` at the ends. (both)
- `AvatarGroup` `size` sets its avatars' default size, and `Avatar` `alt` defaults to `""`. (react)
- Closed accordion content is hidden from focus, screen readers and find-in-page. (css)
- Rows and menu items whose link has `aria-current` get the selected tint, as does a sidebar group holding the current page. (both)
- `.container` side padding is `1rem` at every width. (css)

### Fixed

- `admin.utilities.css` no longer ships `table` / `table-cell` utilities that collided with the table component. (css)
- Type declarations resolve under `node16` / `nodenext`. (react)
- Hotkey chips no longer cause a hydration mismatch on Apple devices. (react)
- A `loading` `Button` keeps focus, and a `Button` rendered as `<a href>` keeps its link role. (react)
- `indicator-center` / `indicator-middle` placement, and `role="status"` on a labelled `Indicator`. (both)
- Breadcrumb items with an icon line up with their siblings. (both)
- `Dialog` and `Drawer` take their accessible name from `Dialog.Title`, and `closedby="any"` closes on backdrop click in Safari. (react)
- Popups inside a `.dialog-body` are no longer clipped. (css)
- Layout utilities on a `tab-panel` work in both bundles. (css)
- Soft badges, alert descriptions and text on coloured cards meet WCAG AA. (css)
- Long URLs and IDs wrap in accordions, items, property lists, tooltips, breadcrumbs, card titles and field rows. (both)
- Striped selected rows, pinned, sticky and bordered dividers, numeric units, and row height with controls in tables. (css)
- `table-row-link` and `item-link` no longer block other controls in the row. (css)
- A `<th scope="row">` in `<tbody>` styles as a body cell. (both)
- A focused input-group control no longer paints over a sticky table header. (css)
- `textarea-autosize` honours `rows` as its minimum height. (css)
- `.prose` keeps `a.btn` styling and markdown column `align`. (css)
- The donut hole, inline horizontal bars, values over `max` and zero-value vertical bars render correctly. (both)
- `aria-disabled` `Menu.Item`s don't fire `onClick`, and a `ref` on `Menu.Item` keeps its `hotkey`. (react)
- Menu and select popups flip to fit near the viewport's end edge. (css)
- The `Sidebar` mobile drawer portals into `<AdminRoot>`, and a controlled `Sidebar.Collapsible` follows `open`. (react)
- The app shell shows the sidebar rail at 48rem, and a wide navbar no longer widens the main area. (css)
- `aria-disabled` and `data-disabled` dim buttons, menu items, tabs and pagination links. (css)
- Keyboard focus rings on menu items, options, steppers, accordion summaries and sidebar rows. (css)
- Checks, selections and current items stay visible in forced-colors mode. (css)
- Switch, accordion and mobile drawer respect `prefers-reduced-motion`. (css)
- `PropertyList` copy buttons announce the copy, and the `AvatarGroup` `+N` tile has `role="img"`. (both)
- Shorthand props set to `null`, `false` or `""` render nothing, so `actions={canEdit && …}` adds no empty row. (react)

## [0.21.0] - 2026-09-25

### Breaking

- Stray Tailwind utilities (`.flex`, `.hidden`, `.sr-only`, …) are removed from `admin.css`; vanilla pages using them must add `admin.utilities.css`. (both)

### Added

- `Button` types `commandfor` and `command` for `Dialog` / `Drawer` invokers. (react)
- `systemAccent` on `BrandTile` and `Navbar`. (react)
- `maxWidth` on `Container`. (react)
- `useConfirm()`, a promise-based `window.confirm` hosted by `<AdminRoot>`. (react)
- `variant` and `size` on `Menu.Trigger` style it as a `Button`. (react)

### Changed

- The `.field-label` asterisk follows the control's native `required`; `[data-required="false"]` removes it. (both)

### Fixed

- `.container` widths are no longer capped at Tailwind's breakpoints, so most get wider; Tailwind source builds need v4.1+. (css)
- The checked `Switch` thumb is visible in dark mode. (css)

## [0.20.1] - 2026-07-30

### Fixed

- `Select` and `Tooltip` popups no longer paint behind host elements with a `z-index`; set `--z-popup` to fit a host's scale. (both)

## [0.20.0] - 2026-07-06

### Added

- `Timeline` horizontal variant (`.timeline-horizontal`, `horizontal`). (both)

## [0.19.1] - 2026-07-02

### Changed

- Copyable `PropertyList` values copy on a click anywhere in the cell. (both)

## [0.19.0] - 2026-07-02

### Added

- `ToggleButton`, and a toggle style on any `.btn` with `aria-pressed`. (both)

### Fixed

- `.dialog-body` is no longer clipped in Safari. (css)

## [0.18.5] - 2026-06-30

### Fixed

- Hotkeys no longer throw on `keydown` events without `key`, such as from autofill. (react)

## [0.18.4] - 2026-06-29

### Added

- `Tabs` `primary` (`.tabs-primary`). (both)
- `.btn-group` members can be wrapped in `.indicator`. (css)

## [0.18.3] - 2026-06-29

### Added

- `Tabs.Tab` `icon`. (both)
- `Tabs` `wrap` (`.tabs-wrap`). (both)

## [0.18.2] - 2026-06-29

### Added

- `Dialog` `size="auto"` and `size="metabase"` (`.dialog-auto`, `.dialog-metabase`). (both)

## [0.18.1] - 2026-06-25

### Fixed

- The scoped bundle ships with CSS nesting flattened, so builds that downlevel it keep `:hover` and state rules. (both)

## [0.18.0] - 2026-06-16

### Added

- `classNames` on shorthand components for per-slot classes, and the `SlotClasses` type. (react)
- `Alert` `onDismiss` (`.alert-dismiss`). (both)
- `StatCard` `trend` (`.stat-card-trend`). (both)
- `AvatarGroup` `max` with a `+N` tile (`.avatar-more`). (both)
- `Indicator` `max` for numeric labels, such as `99+`. (react)
- `Table` `compact`, `Table.Empty` and `pinCol` (`.table-empty`, `.table-pin-col`). (both)
- `Menu` checkbox and radio items (`checked`, `.menu-item-indicator`). (both)
- `Input` `clearable` and `PasswordInput` (`.input-action`). (both)
- `Item` and `ItemGroup` (`.item`), compact list rows. (both)
- `Timeline` (`.timeline`). (both)
- `Drawer` (`.drawer`). (both)
- `NumberInput` (`.number-input`). (both)

## [0.17.0] - 2026-06-15

### Added

- `Separator` (`.separator`). (both)
- `Avatar` and `AvatarGroup` (`.avatar`). (both)
- `Badge` `soft` and `onRemove` (`.badge-soft`, `.badge-remove`). (both)
- `Alert` `action` / `Alert.Action` (`.alert-action`). (both)
- `Input` `icon` and `iconTrailing` (`.input-icon`). (both)
- `Card` `media` and `scroll` (`.card-media`, `.card-scroll`). (both)
- `BrandTile` `lg`, soft variants and bordered image tiles. (both)

### Changed

- A `.link` in an `.alert` inherits the alert's text colour. (css)
- `tfoot` rows are styled by default. (css)

## [0.16.2] - 2026-06-11

- Add a changelog following the Keep a Changelog format.

## [0.16.1] - 2026-06-03

### Fixed

- Break long unbreakable tokens instead of overflowing flex/grid tracks. (css)

## [0.16.0] - 2026-06-03

### Breaking

- The default `Progress` and chart variant `primary` → `info`. (both)

### Added

- `Prose` component / `.prose` class for styling rendered markdown and HTML. (both)

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

### Breaking

- `primary` is a high-contrast neutral; blue moves to `info`. (both)

### Changed

- `Alert` and `Badge` status variants use solid fills. (both)

[Unreleased]: https://github.com/Digital-Udvikling/admin-design-system/compare/v0.22.0...HEAD
[0.16.1]: https://github.com/Digital-Udvikling/admin-design-system/compare/v0.16.0...v0.16.1
[0.16.0]: https://github.com/Digital-Udvikling/admin-design-system/compare/v0.15.1...v0.16.0
[0.15.1]: https://github.com/Digital-Udvikling/admin-design-system/compare/v0.15.0...v0.15.1
[0.15.0]: https://github.com/Digital-Udvikling/admin-design-system/releases/tag/v0.15.0

[0.22.0]: https://github.com/Digital-Udvikling/admin-design-system/compare/v0.21.0...v0.22.0
[0.21.0]: https://github.com/Digital-Udvikling/admin-design-system/compare/v0.20.1...v0.21.0
[0.20.1]: https://github.com/Digital-Udvikling/admin-design-system/compare/v0.20.0...v0.20.1
[0.20.0]: https://github.com/Digital-Udvikling/admin-design-system/compare/v0.19.1...v0.20.0
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
