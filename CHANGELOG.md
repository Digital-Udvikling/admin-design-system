All notable changes to `@aortl/admin-css` and `@aortl/admin-react` are documented here. The two packages share a version and release together; each entry is tagged `(css)`, `(react)`, or `(both)` to show which package a consumer needs to bump.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- `--color-category-{red,orange,yellow,green,cyan,blue,purple,magenta}` and their `-muted` tints for colour-coding categories such as event types or chart series, with `text-`, `bg-` and `border-category-*` utilities in `admin.utilities.css`. Each meets 4.5:1 as text on surfaces and its own tint. (css)
- `--color-surface-hover` and `--color-surface-stripe`, translucent washes for hover and zebra fills that show on any container, with `bg-surface-hover` and `bg-surface-stripe` utilities. (css)
- `renderIcon` and the `IconProp`, `IconComponent` and `IconRenderProps` types are exported. (react)
- `btn-danger-ghost` / `<Button variant="danger-ghost">`, a low-emphasis destructive button. (both)
- `StatusDot`, a standalone `indicator-dot`: `aria-hidden` beside its status text, or `role="status"` when given an `aria-label`. (both)
- `delay` and `closeDelay` on `Tooltip`; when unset, the enclosing `Tooltip.Provider`'s values apply. (react)
- `number-input-ghost` / `<NumberInput variant="ghost">`, and `aria-invalid` on `NumberInput`. (both)
- `Input.Action`, a `type="button"` `.input-action` with an `icon` prop for the `Input` `action` slot. (react)
- `icon` on `Select.Trigger` (before the value) and on `Accordion.Summary`. (react)
- `usePrompt()`, a promise-based `window.prompt` that resolves the entered string, or `null` on Cancel, Esc or unmount. It shares `useConfirm()`'s host and queue in `<AdminRoot>`. (react)
- `Dialog` and `Drawer` focus the first descendant marked `data-autofocus` each time they open. (react)
- Vanilla tab panels match `data-value` `1` to `12`. (css)
- `CopyButton` writes `value` to the clipboard and announces `copiedLabel` in a polite live region; `useCopy()` returns `{ copied, copy }` for your own trigger. (react)
- `selected` on `Item` and `Item.Container` (`[data-selected]` on `.item`) applies the selected-row tint. (both)
- A `.card`, `.badge` or `.item` that is itself a link gets a focus ring and a hover state. (css)
- `.prose` styles `<kbd>` as a key chip and GFM task lists with the checkbox in the bullet gutter. (css)
- `--chart-legend-gap` sets the space between a chart and its legend. (css)
- `Timeline.Item` `status="current"` sets `aria-current="step"`. (react)

### Changed

- **Breaking:** `@aortl/admin-css` exports its Tailwind source entries as `theme.css`, `components.css` and `fonts.css` in place of `./src/*`, and `@aortl/admin-react` drops `./styles.scoped.css` (use `./styles.css`). (both)
- **Breaking:** Form controls take `variant` `bordered` or `ghost`; invalid is a state. `input-` and `textarea-` `danger`/`info`/`success`/`warning`, `select-danger` and `file-input-danger` are removed with their `variant` values. Controls, checkboxes, radios and switches show the danger style from `aria-invalid`, `data-invalid`, an invalid `.field`, or `:user-invalid` once edited. (both)
- **Breaking:** Every sized control takes `size`: `inputSize` on `Input` and `FileInput`, `triggerSize` on `Select.Trigger` and `textareaSize` on `Textarea` are removed. `Input` does not accept the native `size` attribute; set a width in CSS. (react)
- **Breaking:** `.input`, `.number-input` and React `Select.Trigger` match the `.btn` height at each size, and `.input` has a fixed height, so pair controls of one size, such as `input-sm` with `btn-sm`. (both)
- **Breaking:** `<Field error>` marks the field invalid unless `invalid` is passed. For client-side validity with `validationMode`, compose `Field.Error` inside `Field.Container`. (react)
- **Breaking:** `tabs-primary` and `Tabs` `primary` are removed; boxed tabs mark the selection with the `primary-muted` fill, and the `tabs-boxed` track matches the control heights, so drop `tabs-sm` from boxed tabs beside md buttons. (both)
- **Breaking:** `item-outline` / `Item variant="outline"` is `item-bordered` / `variant="bordered"`. (both)
- **Breaking:** `BrandTile` takes `variant` `accent`, `info`, `success`, `warning` (`brand-tile-warning`) or `danger`, and a `soft` boolean. `brand-tile-info`, `-success` and `-danger` are solid; add `brand-tile-soft` for the tint. The tile derives its muted and content colours from the `--color-system-accent` in scope. (both)
- **Breaking:** `Avatar` takes `square` instead of `shape`, and the `AvatarShape` type is removed. (react)
- **Breaking:** `alert` is a block instead of a flex column: inline markup flows as one paragraph and the icon and dismiss align to the first line. Put body text after an `alert-title` in `alert-description`; `Alert.Description` renders a `<div>`. (both)
- **Breaking:** `.link` is `inline`, and inline-flex only with a direct `<i>`/`<svg>` child, so a link in running text wraps and the `.link-external` ↗ stays with the last word. (css)
- **Breaking:** Chart custom properties are `--chart-value`, `--chart-bar-color`, `--chart-segment-color` and `--chart-legend-color` (were `--value`, `--bar-color`, `--segment-color`, `--legend-color`). (css)
- **Breaking:** `BarProps`, `SegmentProps`, `TrendDirection` and `TrendIntent` are `BarChartBarProps`, `StackedBarSegmentProps`, `StatCardTrendDirection` and `StatCardTrendIntent`. (react)
- The `react` and `react-dom` peer range is `^19.2.0`, and `@base-ui/react` is a `^1.4.1` range so an app that also uses Base UI shares one copy. (react)
- IBM Plex ships in the package (`dist/fonts/`) instead of loading from Google Fonts. (both)
- The scoped bundle declares its tokens at zero specificity, so `._ao-admin-root { --color-primary: … }` overrides them, and prefixes its `@keyframes` and `@position-try` names with `_ao-`. (css)
- Dark `--color-danger`, `--color-info`, `--color-link` and `--color-text-muted` and light `--color-success` move one step to meet 4.5:1 text contrast on cards and tints, dark `--color-code-surface` is base-850 so code blocks show inside cards, and `--color-system-accent-content` picks white or black from the accent's lightness. (css)
- Buttons use the `rounded-md` radius, labels don't wrap except in full-width buttons and rows too narrow for them, and `btn-danger` keeps its red fill on hover. (css)
- `kbd` takes its colour from the host and is one host `em` tall, so a hotkey doesn't make a button or menu row taller; a single `kbd` in a `menu-item` sits at the row end. (css)
- The neutral `badge` has a `border` edge, badges keep their content width in flex columns and grids, and a badge in a `btn` doesn't make it taller. (css)
- The vanilla tooltip sizes to its content up to 20rem, is `display: none` while hidden, opens on keyboard focus but not on click, and paints on `--z-popup`. Where anchor positioning is supported it escapes overflow clipping and flips to stay in the viewport. (css)
- Checkbox, radio and switch take one line box and align with the first line of a wrapping label, an indeterminate checkbox draws a dash, unchecked borders meet 3:1 contrast, and a disabled control dims once with its label. (both)
- A `field-row` with a description or error is a two-column grid with the message under the label, a `field-label` dims when its control is disabled, and `textarea-autosize` honours `rows` as its minimum height. (css)
- `Select.Trigger` lays out like the native `.select`: a leading icon before the value, an ellipsis on a long value (`select-value`) and a `1em` chevron. Wrap a custom chevron in `Select.Icon`. `Select.Popup` aligns to the trigger's start edge and takes `side`, `align` and `alignOffset`. (both)
- `Select` is generic over its value, so `onValueChange` receives the item type (`Value[]` with `multiple`) instead of `unknown`. (react)
- `.input-action` meets the WCAG 2.5.8 minimum target size, date and time inputs put the picker glyph at the trailing edge, and an `Input` `action` replaces the clear button. (both)
- `NumberInput`'s `ref`, `className` and `style` apply to the visible `number-input` group; `classNames.root` targets the Base UI Root. (react)
- An `indicator` around a form control fills the width like the bare control; set a narrower width on the `indicator`. (css)
- Form controls use the `rounded-md` radius. Input groups square joined corners regardless of stylesheet order, keep the outer radius on a React `Select` or `NumberInput` at the group's end, and form their own stacking context, so a focused control doesn't paint over a sticky table header. (css)
- Dialogs and drawers have a `border-strong` edge, a small shadow and tighter insets, `.drawer` is bordered only on the edge facing the page, `.dialog-auto` shrinks to its content, and dialogs fade out on close. (both)
- Accordion summary rows are denser with a `1em` `text-muted` chevron, and content in a closed item can't be focused, read by screen readers or matched by find-in-page. (css)
- Cards are flat with a smaller radius and `1rem` padding, `card-title` is `text-base`, and `card-toolbar` enlarges only bare icons and icon-only buttons. (css)
- `card-title`, `stat-card-label`, `stat-card-trend`, `dialog-title` and `accordion-summary` lay out as text: inline markup wraps with the words and children get no flex gap, so in JSX put `{" "}` before a trailing element. (css)
- `avatar-group` overlaps scale with the avatar size and take their ring from `--surface-current`, `AvatarGroup` `size` sets its avatars' default size, and the `+N` tile has `role="img"`. `Avatar` `alt` defaults to `""`. (both)
- `item-media` icons scale with the row size and align with the first line of a wrapping title. (css)
- `CodeBlock` renders `tabIndex={0}`, so an overflowing block scrolls by keyboard. (react)
- `.prose` markdown tables match `.table`, the block after a heading drops its top margin, `a.btn` keeps its button styling, and table cells respect markdown's column `align`. (css)
- `progress` and `.chart-stack` tracks use the `border` colour, and indeterminate `progress` slides a solid segment. (css)
- Unstriped property lists line up with `property-list-title`, labels sit on the first line of wrapped text, a copyable `numeric` value aligns with the other numeric rows, and copy buttons announce the copy. (both)
- Timeline `status` colours the dot, icon and numbered marker alike, rings mask the connector in `--surface-current`, and `timeline-horizontal` lays items out as equal columns. (css)

### Removed

- **Breaking:** The CommonJS build of `@aortl/admin-react` (`dist/*.cjs`, the `require` condition and `main`). It ships ES modules as `dist/*.js`. (react)
- **Breaking:** The `ChartType` type export. (react)

### Fixed

- `admin.utilities.css`, and a Tailwind build that imports `theme.css`, ship no `table` and `table-cell` display utilities, which collided with the table component's class names. (css)
- The type declarations resolve under TypeScript's `node16` / `nodenext` module resolution. (react)
- Hotkey chips in `Kbd`, `Button`, `ToggleButton` and `Menu.Item` hydrate without a mismatch on Apple devices: they render the server's `Ctrl`, `Shift` and `Alt` labels and switch to `⌘`, `⇧` and `⌥` after hydration. (react)
- A `loading` `Button` sets `aria-disabled` and keeps keyboard focus, and a `Button` rendered as `<a href>` keeps its link role. (react)
- `indicator-center` and `indicator-middle` straddle the anchor's edge, `--indicator-offset` applies to corner placements only, and `<Indicator label aria-label>` gives the badge `role="status"`. (both)
- Breadcrumb items with a leading icon line up with their siblings, and `Breadcrumbs.Item` icons render at `1em`. (both)
- `Dialog` and `Drawer` take their accessible name and description from `Dialog.Title` and `Dialog.Description`, call `onOpenChange(true)` when an invoker command opens them, and with `closedby="any"` close on a backdrop click in Safari. (react)
- Menu, select and tooltip popups inside a `.dialog` or `.drawer` with a `.dialog-body` are not clipped by the dialog; `.dialog-body` is the scroll region. (css)
- A layout utility such as `flex` on a `tab-panel` works in both bundles, and `tabs-boxed` hugs its segments. (css)
- Text on coloured fills meets WCAG AA: soft `info`, `success` and `danger` badges, `alert-description`, and card, stat-card and chart text on coloured cards. (css)
- Long unbreakable strings such as URLs, IDs and hashes wrap inside accordion summaries, item descriptions, property list values, tooltips, breadcrumbs, card titles and `field-row` labels. (both)
- The donut hole matches `--donut-thickness`, inline horizontal bar charts render their bars, fills stay in the track when a value exceeds `max`, and vertical bars draw a baseline so a zero value shows. (both)

## [0.21.0] - 2026-09-25

### Added

- `Button` types the HTML invoker attributes `commandfor` and `command`, which `@types/react` doesn't declare yet, so the documented `Dialog` and `Drawer` invoker examples type-check. (react)
- `systemAccent` on `BrandTile` and `Navbar`, as on `AdminRoot` and `AppShell`: sets `--color-system-accent` inline. (react)
- `maxWidth` on `Container` sets `--container-max` inline, overriding the `size` preset. (react)
- `useConfirm()`, a promise-based `window.confirm`: `await confirm({ title, description, confirmLabel, cancelLabel, variant })` resolves `true` on Confirm and `false` on Cancel, Esc, or unmount. `<AdminRoot>` hosts the dialog, a `size="sm"` `Dialog` with no light dismiss that renders only while a confirm is pending, and queues concurrent calls in order. `variant: "danger"` renders a danger confirm button and focuses Cancel. Throws outside `<AdminRoot>`. (react)
- `variant` and `size` on `Menu.Trigger` style the trigger as a `Button` (`_ao-btn`, square without children), for button-styled and split-button menus. A raw `className="btn"` on the trigger rendered unstyled under the scoped bundle, since the `_ao-` prefix is added only to admin's own classes. (react)

### Changed

- The asterisk on a `.field-label` follows the control's own `required` (via `:has()`) when the label is a direct child of the `.field`, so pages whose required controls lacked `[data-required]` now show one: React forms without `<Field required>`, and Django templates without crispy's `.asteriskField` (crispy labels are unchanged). `[data-required]` / `<Field required>` still add it, for controls with no native `required`, a wrapped label, or a nested field holding both its own and a sub-field's required control. `[data-required="false"]`, which `<Field required={false}>` now renders, removes it. (both)

### Fixed

- Containers are no longer capped at Tailwind's breakpoint widths. `admin.css` and `admin.scoped.css` shipped Tailwind's `.container` utility, whose later `utilities` layer overrode `max-width` on every `.container` and `<Container>`: the default, `container-sm`/`-lg`/`-fluid`, and per-instance `--container-max`. Container widths change as a result: wider at most viewports, and `90rem` in place of `96rem` at the widest. Tailwind builds that import the source CSS generated the same utility; `theme.css` now excludes it with `@source not inline("container")`, which needs Tailwind v4.1+. (css)
- The checked `Switch` thumb no longer vanishes in dark mode. It was `paper` on the `primary` track, which is also paper in dark mode; the checked thumb now uses `primary-content`, as `ToggleButton`'s mini switch already did. (css)

### Removed

- Stray Tailwind utilities in `admin.css` and `admin.scoped.css`: `.flex`, `.grid`, `.block`, `.inline`, `.hidden`, `.sr-only`, `.relative`, `.absolute`, `.fixed`, `.sticky`, `.flex-1`, `.overflow-hidden`, `.rounded`, `.text-right`, `.tabular-nums` and a few more. The build scanned the repo for class-like strings and emitted whatever matched. Vanilla pages that relied on any of them without `admin.utilities.css` must add that bundle. `Dialog` and `Drawer` headers without a title and `Sidebar.CollapseToggle` used two of them; `.dialog-close` now pins itself to the header end with `margin-inline-start: auto`, and the toggle drops its redundant `sr-only` label (the checkbox keeps its `aria-label`). `admin.utilities.css` also loses `.transform`, which its safelist never included. (both)

## [0.20.1] - 2026-07-30

### Fixed

- `Select` and `Tooltip` popups no longer paint behind host chrome. Base UI positions them in a `position: fixed` wrapper with `z-index: auto`, so an `<AdminRoot>` embedded in a page whose own elements carry a positive `z-index` hid its own dropdowns. Both positioners now carry a `.popup-layer` class: `z-index: var(--z-popup, 1000)`. Declare `--z-popup` on `.admin-root` or any ancestor to slot popups into a host's own stacking scale. (both)

## [0.20.0] - 2026-07-06

### Added

- `Timeline` horizontal variant — `.timeline-horizontal` (React `horizontal` prop) lays items out as equal-width columns with the connector running along the indicator row. Composes with the numbered variant for a step tracker. (both)

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

[Unreleased]: https://github.com/Digital-Udvikling/admin-design-system/compare/v0.21.0...HEAD
[0.16.1]: https://github.com/Digital-Udvikling/admin-design-system/compare/v0.16.0...v0.16.1
[0.16.0]: https://github.com/Digital-Udvikling/admin-design-system/compare/v0.15.1...v0.16.0
[0.15.1]: https://github.com/Digital-Udvikling/admin-design-system/compare/v0.15.0...v0.15.1
[0.15.0]: https://github.com/Digital-Udvikling/admin-design-system/releases/tag/v0.15.0

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
