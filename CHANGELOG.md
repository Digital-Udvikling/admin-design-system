All notable changes to `@aortl/admin-css` and `@aortl/admin-react` are documented here. The two packages share a version and release together; each entry is tagged `(css)`, `(react)`, or `(both)` to show which package a consumer needs to bump.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- `render` on `Navbar.Item`, `Sidebar.Item`, `Sidebar.SubItem`, `Breadcrumbs.Item`, `Link`, `Badge`, `Card.Container`, `Item` / `Item.Container` and `Menu.Item`, to render onto your own element such as a router link: `render={<NextLink href="/orders" />}`. The component's classes, `aria-current` and children go onto the element, its own `className` is appended and its other props win. It takes an element, so it works from a Server Component. (react)
- A `.card`, `.badge` or `.item` that is itself a link (`<a class="card">`, or React `render`) gets a focus ring and a hover state: a strong border on the card, an underline on the badge, the hover wash on the item. (css)
- `menu-popup-end` aligns a menu popup to its trigger's end edge (`Menu.Popup align="end"`, `Navbar.Dropdown align="end"`), and `menu-actions` (`Menu.Actions`) is a right-aligned button row for a filter menu's Reset and Apply. A native checkbox or radio in a `<label class="menu-item">` takes the indicator column. (both)
- `Menu.RadioGroup` and `Menu.RadioItem`, and `closeOnClick` on `Menu.Item`. `Menu.Item` hotkeys fire while the menu is closed. `Navbar.Dropdown` marks its trigger when an item among its children has `aria-current`, also inside a `Menu.Group`. (react)
- `--color-surface-hover` (a 6% text-colour wash) and `--color-surface-stripe` (3% in light mode, 5% in dark) translucent tokens, with `bg-surface-hover` and `bg-surface-stripe` utilities, for hover and zebra fills that show on any container. (css)
- `--surface-current`, the fill a container publishes for elements that mask or paint over it. Cards and their tints, dialogs and their footer, menu and select popups, accordion items, muted and selected list items, selected table rows, the navbar, sidebar and footer set it, and timeline rings, avatar-group rings, stacked-bar seams and pinned or sticky table cells read it; set it on your own filled containers. (css)
- A danger state for number inputs: `number-input-danger` / `<NumberInput variant="danger">`. It also applies from `data-invalid`, an `aria-invalid` or `:user-invalid` field, and an enclosing `.field[data-invalid]`. (both)
- `Input.Action`, a `type="button"` `.input-action` with an `icon` prop, for building the `action` slot. Passing `className="input-action"` rendered an unstyled button, since consumer classes are not prefixed. (react)
- Icon-only menu triggers: a `btn-square` trigger that holds an icon drops the chevron, and `Menu.Trigger` takes an `icon` prop. (both)
- `--chart-legend-gap` sets the space between a chart and its legend: `0.5rem` below it, or `0.5em` beside an inline chart. Set it to `0` on a chart root laid out as a flex row so a side legend stays centred. (css)
- `Timeline.Item` with `status="current"` sets `aria-current="step"`, which an explicit `aria-current` overrides. (react)
- `btn-danger-ghost` (`Button variant="danger-ghost"`), a low-emphasis destructive button with danger text on a transparent fill and border and a `danger-muted` fill on hover, and `menu-item-danger` (`Menu.Item danger`) for destructive menu items. (both)
- `size` on `Select.Trigger`, `Textarea` and `FileInput`, as on `Button` and `NumberInput`, and `icon` on `Select.Trigger` (before the value) and `Accordion.Summary`, rendered at `1em` with `aria-hidden`. `IconProp`, `IconComponent`, `IconRenderProps` and `renderIcon` are exported. (react)
- `table-sort`, a text button for sortable headers whose indicator follows the cell's `aria-sort`, stays visible in forced-colors mode and keeps the plain header's height and type. React's `Table.HeaderCell` takes `sort` (`"ascending" | "descending" | "none"`) and `onSort` and sets `aria-sort` for you. (both)
- `table-cell-actions` (`Table.Cell actions`), a trailing row-actions column that shrinks to its controls, puts 0.25rem between them and drops block padding so a `btn-sm` row is no taller than a text row, and `table-scroll` (`Table.Scroll`), an opt-in scroll region for wide tables that also serves as the scrolling ancestor `table-sticky` and `table-pin-col` need. (both)
- `[data-selected]` on an `.item` fills it with the table-row selection tint and sets its description in the text colour (`Highlight` / `HighlightText` in forced-colors mode); `Item` and `Item.Container` take a `selected` prop, and two adjacent selected items keep a strong divider between them. (both)
- `delay` and `closeDelay` on `Tooltip` for per-tooltip timing; when unset, a surrounding `Tooltip.Provider`'s values apply. (react)
- `Dialog` and `Drawer` focus the first descendant marked `data-autofocus` each time they open, since React's `autoFocus` fires at mount while the dialog is still closed. (react)
- A sidebar group that holds the current page highlights its trigger while the group is closed or the rail is collapsed, and a navbar dropdown whose menu holds a `menu-item` with `aria-current="page"` highlights its trigger, and `menu-item[aria-current="page"]` gets the selected fill in the open menu (`Highlight` in forced-colors mode). `<Navbar.Dropdown>` takes `active` (sets `data-active` on the trigger, for a page in the section that isn't one of its items), `icon` and `classNames` (`trigger`, `popup`), and `.app-shell` switches to the sidebar layout when a `.sidebar` is a direct child, so `app-shell-with-sidebar` / `hasSidebar` is optional. (both)
- `.prose` styles a raw `<kbd>` as the key chip, and GFM task lists, whose checkbox replaces the bullet and hangs in the bullet gutter so wrapped lines line up with the first. (css)
- Vanilla tab panels match `data-value` `1` to `12` (was `1` to `6`). (css)
- A `.sidebar` placed directly in a `<dialog class="dialog drawer">` fills the drawer at the sidebar rail width (capped at 80vw) and hides its collapse toggle, so a vanilla app shell can open its nav as a drawer with invoker commands below 48rem, where a direct-child sidebar is hidden. (css)
- `"use client"` directives on the modules that need the client, so the package works in React Server Components (Next.js App Router). Importing any export from a Server Component used to fail with `createContext is not a function`, so every page rendering a component had to be a Client Component. Stateless components now render as Server Components, and compound parts (`Select.Trigger`, `Sidebar.Item`) and component-reference icons (`<Button icon={IconPlus}>`) work from a Server Component too. `Pagination`'s default buttons still need a Client Component parent; a `renderItem` that returns links works from a server page. The package now ships one file per module so each keeps its directive; entry points are unchanged. (react)

### Changed

- **Breaking:** The vanilla menu is a `popover` instead of a `<details>`: `<div class="menu">` wraps a `<button class="menu-trigger" popovertarget="…">` and a `<div class="menu-popup" id="…" popover>`, so each menu needs a unique `id`. Escape and a click outside close it, and the popup renders in the top layer, so a `<dialog>` or an `overflow: hidden` ancestor no longer clips it. It is a disclosure: drop `role="menu"` and `role="menuitem"`, and use native checkboxes and radios in a `<label class="menu-item">` for checkable rows. `navbar-dropdown` markup follows. (css)
- **Breaking:** `Menu` is built on the Base UI Menu, with arrow-key navigation, typeahead, light dismiss and focus return. `open`, `defaultOpen` and `onOpenChange` replace the `<details>` attributes, and `modal` locks page scroll while open (default `false`). `Menu.Trigger` renders a `<button>`. `Menu.Popup` portals into `AdminRoot` or an enclosing `Dialog` and takes `side`, `align`, `sideOffset` and `alignOffset`. A checkable `Menu.Item` takes `checked` or `defaultChecked` with `onCheckedChange`; `role="menuitemradio"` items become `Menu.RadioItem`s in a `Menu.RadioGroup`, and a link item can't be checkable. A `Dialog` or `Drawer` rendered inside the popup is hidden when the menu closes, so render it outside `<Menu>`. (react)
- **Breaking:** `@aortl/admin-react` ships ES modules only: the CommonJS build (`dist/*.cjs`, the `require` export condition and `main`) is gone, and files are `dist/*.js`. Bundlers and Next.js pick up the ESM build unchanged; a CommonJS caller needs a Node or bundler that can `require()` an ES module. (react)
- **Breaking:** `Avatar` takes `square` (a boolean) instead of `shape="circle" | "square"`, and the `AvatarShape` type is gone. (react)
- **Breaking:** Every sized control takes `size`. `Input` renames `inputSize` to `size`; the native `size` attribute (width in characters) is no longer accepted, so set a width with CSS. `triggerSize` on `Select.Trigger`, `textareaSize` on `Textarea`, `inputSize` on `FileInput` and `relaxed` on `Table` are removed: use `size`, and `density="relaxed"` (the `table-relaxed` class is unchanged). (react)
- `Select` is generic over its value: `Value` is inferred from `value`, `defaultValue` or `onValueChange`, so `onValueChange` receives the item type (`Value[]` with `multiple`) instead of `unknown`. Pass it explicitly (`<Select<Status>>`) when nothing infers it. A handler typed for another value no longer type-checks. (react)
- **Breaking:** `Table.Scroll` renders a `<section>` (was a `<div>`) with `tabIndex={0}`, so a wide or height-capped table scrolls by keyboard, and requires `aria-label` or `aria-labelledby` to name the region. Give a vanilla `table-scroll` wrapper the same: a `<section>` with `tabindex="0"` and a name. (react)
- Dark `--color-danger` moves from red-400 to red-300 (hover red-300 to red-200) and dark `--color-info` from blue-400 to blue-300 (hover blue-300 to blue-200). red-400 was 4.43:1 as text on the page and under the black `-content` text of a filled button, badge or alert, and 3.98:1 on a card; blue-400 was 4.38:1 on a card. Both now pass 4.5:1 on the page, cards and their own `-muted` tint. (css)
- `.input-action` is a 24px square (was 20px), the WCAG 2.5.8 minimum target, sitting 2px further out so the glyph stays where it was. (css)
- `CodeBlock` renders `tabIndex={0}`, so a block that overflows scrolls by keyboard. (react)
- `@base-ui/react` is a `^1.4.1` range instead of an exact `1.4.1`, so an app that also depends on Base UI can share one copy with the components; Base UI context does not reach across two copies. (react)
- Dark `--color-text-muted` moves from base-500 to base-400, light `--color-success` from green-600 to green-700 (hover green-800), and dark `--color-link` from blue-400 to blue-300 (hover blue-200), so text in these colours meets 4.5:1 on chips, tints, selected rows and cards. Dark `--color-code-surface` moves from base-950 to base-850; base-950 equals `surface-muted`, so code blocks lost their box inside cards. (css)
- `--color-system-accent-content` follows the accent's lightness, white below OKLCH L 0.58 and black above it, so bright accents need no manual override. `.brand-tile` derives `--color-system-accent-muted` and `-content` from the accent in scope, so a `--color-system-accent` on the tile, navbar or shell tints `brand-tile-soft` and picks the solid tile's monogram colour (it was near-black on purple or green accents in dark mode); an override of `-muted` or `-content` on `:root`, the navbar or the shell no longer reaches the tile, so set it on the tile. (css)
- Form controls match the `.btn` heights of 26/32/38px at sm/md/lg: `.input` (Chromium rendered 29/36/42px, and `type=time` 38.7px), `.number-input` (was 29/36/42px), React `Select.Trigger` (was 30/34/38px) and the `tabs-boxed` track (was 34/42/50px; bordered tabs keep their heights). `.input` has a fixed height, so it no longer stretches to a taller sibling in a flex row or `.input-group`; pair controls of the same size, such as `input-sm` with `btn-sm`, and drop `tabs-sm` / `size="sm"` from boxed tabs that sit beside md buttons. (both)
- `.input`, `.select`, `.textarea`, `.number-input` and `.file-input` that fail native constraint validation (`required`, `pattern`, `minlength`, `min`/`max`, `type="email"`) show the danger border and focus ring once the user has edited them (`:user-invalid`). Pages that already set these attributes pick this up without a markup change. (css)
- `<Field error>` marks the field invalid (`data-invalid`, and `aria-invalid` on the control) unless `invalid` is passed, so the control turns danger with its message. `error` is for server or form-library messages: a static `error` used for client-side validity with `validationMode` keeps the field invalid, so compose `Field.Error` inside `Field.Container` for that case. (react)
- Button labels no longer wrap. They still wrap in `btn-full-width` and `btn-group-full-width` members, whose width comes from the container, and in a horizontal `btn-group`, `card-actions` or `dialog-footer` row too narrow for them. (css)
- `Select.Popup` aligns to the trigger's start edge by default and accepts `side`, `align` and `alignOffset`. (react)
- An indeterminate checkbox draws a dash instead of a checkmark, so a partially selected select-all header no longer reads as all selected. CSS draws the glyph from the root's `[data-checked]` / `[data-indeterminate]`, which also covers vanilla `role="checkbox"` hosts, and the React `Checkbox` default indicator is an empty `Checkbox.Indicator` in place of the inline SVG; custom indicator children still replace the glyph. (both)
- Checkbox, radio and switch take exactly one line box and pin to the first line of a wrapping `<label>`, with icons and `kbd` in the label centred, so a checkbox cell no longer makes a table row taller. Unchecked checkbox and radio borders and the off switch track use a `text-muted` edge (hover `text`) and meet 3:1 non-text contrast. (css)
- `NumberInput`'s `className` and `style` apply to the visible `number-input` group, so layout utilities such as `max-w-32` take effect; the new `classNames.root` targets the Base UI Root. (react)
- `kbd` takes its text colour from the host and mixes its fill and border from `currentColor`: chips match inverted tooltips, prose chips use the host text colour instead of `text-muted`, and chips in buttons and menus get an 8% fill (was 12%). A chip is exactly one host `em` tall, so a hotkey no longer makes a `btn` or `menu-item` fractionally taller than its siblings, and ← and → render in IBM Plex Mono like ↑ and ↓. (css)
- An `indicator` around a form control (`input`, `input-icon`, `input-group`, `select`, `textarea`, `number-input`, `file-input`) fills the available width like the bare control instead of shrinking to its intrinsic width, and all of these get the `2px` corner offset. For a narrower control, set the width on the `indicator`, not on the control. (css)
- `alert` is a block instead of a flex column, and its text, icon and dismiss align to the top of the row instead of centring on it. Block children (`<p>`, `<div>`, `<ul>`, the title and description) keep their `0.25rem` gap, but bare text right after an `alert-title` sits flush against it, so put body text in `alert-description`. (css)
- Table row hover, stripes and the header band, and `property-list-striped` bands, are translucent washes (`surface-hover`, `surface-stripe`), so they show inside cards and hover shows on striped rows. Table row washes paint as an image layer, so a cell's own background colour stays visible under them. (css)
- Unstriped property lists no longer inset labels and values from the list's edges, so they line up with `property-list-title` and the container's content edge. `property-list-title` and `stat-card-value` use `font-semibold` instead of `font-bold`, which looks the same with IBM Plex Sans (it ships 400–600). (css)
- Timeline `status` colours the dot, icon and numbered marker alike: icons take the status colour, `success` markers are green instead of ink, `danger`/`warning`/`info` colour their markers, and `current` fills in the primary ink everywhere (dots and icons were grey). A timeline nested in a status item keeps its own colours. (css)
- The default `avatar-group` overlap is 6px (was 8px), with 8px after an `avatar-lg` and 4px between `avatar-sm` avatars, whose initials the old overlap clipped. The ring takes its colour from `--surface-current`, falling back to `surface`. (css)
- The selected segment of `tabs-boxed` uses the `primary-muted` fill with no shadow, like the current page link and a pressed toggle; the white thumb had no visible edge and looked recessed in dark mode. (css)
- The accordion, menu trigger and sidebar chevrons are mask-drawn chevrons that stay centred open and closed, no longer jump on toggle and match the stroke weight of adjacent icons. The accordion and menu chevrons are a `1em` Tabler chevron-down in `text-muted`, except on `btn-primary` / `btn-danger` triggers; an empty `btn-square` menu trigger is square (32/26/38px at md/sm/lg), and text triggers are about 7px wider. (css)
- The hidden vanilla tooltip is `display: none` instead of `visibility: hidden`, fading in from `@starting-style` and out with `allow-discrete`, so hidden bubbles no longer take part in layout or widen the page near its right edge. (css)
- `.link` is `inline` by default and becomes inline-flex, with a `0.25rem` gap and baseline alignment, only when it has a direct `<i>`/`<svg>` child; other children (badges, images, icons wrapped in a `<span>`) no longer get the gap. A link in running text wraps with it, the `.link-external` ↗ stays on the line of the last word, webfont icons are no longer underlined, and a wrapping icon link keeps its icon on the first line in both bundles. (css)
- At the first or last page, `Pagination` previous/next set `aria-disabled="true"` without native `disabled`, so they stay focusable and keyboard focus stays on the control; tests that assert `toBeDisabled()` should assert `aria-disabled` instead. Built-in chevrons and custom `previousIcon`/`nextIcon` render at `1em` (14px at the default size, was 16px), as in the vanilla bundle. (react)
- Sidebar rows have one height whatever they contain: items and group triggers are 28px, sub-items 24px. Sub-items are indented 1.5rem so their text lines up with the parent label, and `.sidebar-header` has 1rem side padding. (css)
- The neutral `badge` has a `border` edge (was transparent), so it stays visible on zebra bands and card fills; `badge-primary` takes a border in its fill colour. (css)
- Menu rows are 28px whatever they hold (icon, check indicator or `kbd`), with a 20px line and the leading icon or check on the first line of a wrapped label, and select options match (were 32px). The menu popup caps at 20rem so long labels wrap, including unbreakable IDs and hashes, and where anchor positioning is supported it is at least as wide as its trigger. The select popup caps at `max(20rem, trigger width)`, and long option labels wrap anywhere. (css)
- Field label, description and error share a 16px line height (the label was 14px, help text 19.5px), with 20px for a `field-row` label, and `field-row` uses a 0.5rem gap beside a checkbox or radio and 0.75rem beside a switch. Wrapped rows in a horizontal `.radio-group` are 0.5rem apart (was 1rem), as in the vertical group, and the number input field has tighter inline padding (8/6/10px at md/sm/lg), so narrow quantity fields no longer clip the last digit. (css)
- The `progress` and `.chart-stack` tracks use the `border` colour instead of `surface-strong`, so the whole track shows on cards, and indeterminate `progress` slides a solid segment instead of a soft gradient. (css)
- A `link` inside an alert thickens its underline on hover instead of fading to 85% opacity. (css)
- `card-description` sits 8px below a `card-title` or `card-header` (was 12px), so descriptions line up across cards with and without a toolbar; compact cards keep their 8px gap. (css)
- Vertical bar charts draw a 1px `border` baseline under each column with square bottom corners, so a zero value is visible. `BarChart.Bar` puts the datum `title` on the `.chart-bar` row instead of the fill, so the label, track and value all show the hover read-out and zero-value bars have a hover target. (both)
- Table rows whose link has `aria-current` tint as selected, so master-detail rows need only that attribute. (css)
- `item-media` icons scale with the row size (`1rem` in `item-sm`, `1.5rem` in `item-lg`), and `AvatarGroup` `size` sets the default size of the `Avatar`s inside it; an explicit `size` on an `Avatar` still wins. (both)
- Accordion summary rows are 36px (was 44px), with `0.75rem` inline and `0.5rem` block padding, and content pads `0.75rem`, the inset items and tables use. Open and close take 150ms. (css)
- Tooltip bubbles sit on whole pixels (24px at md, 20px at sm, plus 16px per extra line) and use `text-wrap: pretty`, so multi-line bubbles hug their text. (css)
- `.drawer` is bordered only on the edge facing the page, like `.sidebar-drawer`. (css)
- Active sidebar sub-items tint their `.sidebar-icon` like active items, and `<Sidebar.SubItem>` wraps its children in `<Sidebar.Label>`, so long sub-items truncate like items; `classNames` gains a `label` slot. (both)
- `.container` side padding is `1rem` at every width (was `1.5rem` from 48rem up), the navbar and footer gutter, so page content lines up with the brand and footer text. (css)
- `.prose` tables match `.table`: 6px block padding (33px rows, was 37px), a medium-weight header on the `surface-stripe` wash with a strong divider, and no divider under the last body or footer row. These rules apply only to markdown tables (`table:not(.table)`), so a `.table` inside `.prose` keeps its own styling. The block after a `.prose` heading drops its top margin, so the gap below a heading is 8px (was 12px, and 24px for a subheading directly under a heading). (css)
- The em-dash for an empty property list value (`property-list-value-empty`) is muted. (css)
- Buttons and form controls have a 6px corner radius (`rounded-md`, was 8px): `.btn`, `.input`, `.select`, `.textarea`, `.number-input`, `.file-input` and its picker button, and the end caps of `btn-group` and `input-group`, including a menu trigger at either end of a group. (css)
- Cards are flat: `card`, and so `stat-card`, has a `0.5rem` radius (was `0.75rem`) and no shadow. `card-title` is `text-base` (16px, was 18px), `card-body` pads `1rem` and the `card-scroll` header and actions `1rem` inline (were `1.25rem`), as stat cards do, and an `indicator` on a `card` anchor offsets `2px` to sit on the smaller corner. Card toolbar icons are `1rem` (was `1.25rem`); icon-only `btn-sm btn-square` buttons in the toolbar are 26px like other small controls, while borderless `btn-ghost` / `btn-danger-ghost` squares stay 28px. An `item-group-bordered` directly in a `card-body` has a 6px radius inside the card's 8px corner. (css)
- Dialogs and drawers are flatter and denser: a `border-strong` edge and a small shadow (was large), a 16px `.dialog-title` (was 18px), and 16px header, description, body and footer insets (were 20px). `.dialog` has an 8px radius (was 12px). The mobile sidebar drawer (`.sidebar-drawer`) takes the same edge and shadow. (both)
- Menu and select popups use a `border-strong` edge and `shadow-sm` (were `border` and `shadow-md`), so they stay delimited in dark mode; tooltips use `shadow-sm` too (were `shadow-md`). (css)
- Table column headers, including `.prose` table headers, are semibold in the text colour (were medium weight in `text-muted`). (css)
- A table placed directly in a card, or in a `table-scroll` inside one, lines its first and last cells up with the card's 16px inset (12px in `card-compact`), and `table-cell-gutter` keeps a 1.5rem minimum width when the table overflows. (css)

### Fixed

- The type declarations resolve under TypeScript's `node16` / `nodenext` module resolution: relative imports in `dist/*.d.ts` carry `.js` extensions (they were extensionless, so every export was unresolved under those settings). (react)
- Hover and highlight fills use the translucent `surface-hover` wash instead of an opaque `surface-muted`, so they show inside cards, dialog footers, the navbar and the sidebar: `btn-ghost`, `btn-muted`, `input-ghost`, `select-ghost`, `textarea-ghost`, number-input steppers, select options, menu items, accordion summaries, pagination links and `item-link` rows. The `file-input-ghost` picker takes a full border and radius like a `.btn`, fills the control height and shows the hover and invalid border itself, so it stays visible on muted surfaces. (css)
- In forced-colors mode (Windows High Contrast), state and glyphs stay visible in system colours: checkbox checks and dashes, radio dots, switch thumbs and checked tracks, toggle-button switches, the `btn-loading` and `spinner` arcs, `progress` (an outlined track and `Highlight` fill), `indicator-dot`, timeline rails and markers, the selected tab underline and boxed segment, selected table rows, highlighted select options and menu items, menu separators, menu and accordion chevrons, the current pagination page, current navbar and sidebar items, sidebar chevrons and the hamburger. (css)
- `aria-invalid="true"`, `data-invalid` or an enclosing `.field[data-invalid]` gives `.input`, `.select`, `.textarea`, `.number-input` and `.file-input` the danger border and focus ring, and gives an unchecked checkbox, radio or switch a danger border, which the choice controls also take from their own `aria-invalid`, `data-invalid` or `:user-invalid`. Before, a focused invalid control in a Field showed a blue ring and a bare `aria-invalid` control had no styling; an invalid or danger React `Select.Trigger` also keeps the danger ring while its popup is open. (css)
- `aria-disabled="true"` and `data-disabled` dim `.btn`, `.menu-item`, `.tab` and `.page-link` like `:disabled`, and disabled buttons, menu items and tabs get no hover fill. Buttons keep pointer events so a tooltip can explain why, menu items ignore pointer clicks, and disabled tabs show a not-allowed cursor, including React `Tabs.Tab disabled` (Base UI sets only `data-disabled`), which rendered undimmed, and a vanilla `disabled` `tab-input`. (css)
- Keyboard focus draws an inset ring on menu items and select options, which showed only a fill, and on number-input steppers, accordion summaries (the next item covered the outer ring), sidebar rows (the collapsible panel clipped it on sub-items) and the open React tab panel, which Base UI makes a tab stop. The number-input group ring shows only while its field has focus. (css)
- Shorthand props set to `null`, `false` or `""` render nothing instead of an empty wrapper on `Field`, `Alert`, `Card`, `StatCard`, `Item`, `Dialog`, `Drawer`, and the `badge` and `label` of `Sidebar.Item`, `Sidebar.SubItem` and `Sidebar.Collapsible`, so `actions={canEdit && …}` adds no empty row; `0` still renders. An empty `Field` `error` doesn't mark the field invalid, `PropertyList` `title`, `Timeline.Item` `title` / `time` / `description` and `Indicator` `label` do the same (an empty `Indicator` label shows the dot), a `Card`, `Dialog` or `Drawer` `icon` without a `title` renders no empty heading (in a dialog it had become the accessible name), an `Input` `action` of `false`, `null` or `""` renders no empty `.input-icon`, and `useConfirm` renders no empty description. (react)
- Long unbreakable strings such as URLs, IDs, hashes and emails wrap inside their box instead of overflowing it: accordion summaries (which pushed the chevron out), `item-description` (which ran under the actions), property list values, tooltip bubbles, breadcrumb items, `card-title`, `field-row` labels and links in flex rows. A link in a table cell breaks only between words, so auto-layout columns size to whole words and a wide table scrolls. (both)
- `card-title`, `stat-card-label`, `stat-card-trend`, `dialog-title` and `accordion-summary` lay out as text instead of flex rows: inline `<code>`, links, `<strong>` and badges wrap with the words, a leading `<i>`/`<svg>` or trend caret stays on the first line without shrinking, and a badge in a `card-title` sits on the middle of the line without making the title taller. Children no longer get a flex gap, so in JSX put `{" "}` between text and a trailing element; an `<i>` or `<svg>` that is the first element child hangs before the text even when text comes first in the markup, so wrap a trailing icon in a `<span>`. (css)
- Hovering `btn-danger` keeps its red fill (`danger-hover`) instead of turning grey and hiding the label. `btn-group` joins buttons wrapped in `tooltip-wrap` and lets their tooltips follow `--z-popup` above a focused neighbour, raises a focused split-button trigger's ring above the next button, and stretches the split trigger in vertical and full-width groups, where a chevron-only split trigger keeps its own width. (css)
- A `loading` `Button` sets `aria-disabled` instead of native `disabled`, so it keeps keyboard focus while still blocking clicks and keys, and with both `icon` and `iconTrailing` it keeps the trailing icon, as the vanilla markup does. A `Button` rendered as `<a href>` (`render` + `nativeButton={false}`) keeps its link role and gets no `role="button"` or `type="button"`. (react)
- Date, time, datetime-local, month and week inputs place the picker glyph at the field's trailing edge instead of directly after the value, and a search input in `.input-icon` with an `.input-action` no longer shows the native cancel button beside the clear button. On `Input`, `action` replaces the clear button as documented; the clear button used to hide the action whenever the field had a value. (both)
- `Select.Trigger` and the native `.select` lay out alike: a leading icon sits before the value instead of centring it, a long value truncates with an ellipsis (`Select.Value` renders the new `select-value` class), and the chevron is `1em` at the same inset, stroked in `text-muted` in light and dark mode. Only `Select.Icon` is pushed to the trigger's end, so wrap a custom chevron in it, and a native `.select` showing its `<option value="">` placeholder renders in `text-muted` like the React placeholder. (both)
- The switch thumb sits 2px from the track edge in both states (it was 3px off and 1px on). A disabled checkbox, radio or switch inside a `<label>` dims once to 50% together with its label text instead of compounding to 30%, and a `field-label` dims to 50% when its field's control is disabled (including an input inside `input-icon` or `input-group`) or when it carries `[data-disabled]`, which Base UI sets on a disabled `Field`. (css)
- A `field-row` with a `field-description` or `field-error` becomes a two-column grid, control then label, with the message under the label instead of on its line, and a checkbox, radio or switch in a `field-row` aligns with the first line of a wrapped label. `textarea-autosize` honours `rows` as its minimum height and stays manually resizable in browsers without `field-sizing`. (css)
- Input groups square the joined corners of selects, number inputs, file inputs, icon inputs and menu triggers whatever the stylesheet order, keep the outer radius on a React `Select` or `NumberInput` at the end of a group, and paint a hovered or invalid control's border over its neighbour's edge; buttons, menu triggers, selects and addons keep one line at their content width, and addons follow sm/lg control sizes. The group is its own stacking context, so a focused or invalid control no longer paints over a sticky table header or pinned column, and with a menu open or a `tooltip-wrap` bubble showing it sits at `z-index: 30` so the popup stays on top. A `btn`, `input` or `select` wrapped in a `tooltip-wrap` or `indicator` takes the group's seam corners. (css)
- A `badge` in a flex column or grid (stat cards, card bodies) keeps its content width instead of stretching to a full-width bar, and a `badge` inside a `btn` no longer makes the button taller (26/32/38px with `badge-sm` / `badge` / `badge-lg`). An `indicator` no longer grows past its column when the anchor wraps, `indicator-center` and `indicator-middle` items straddle the anchor's edge with `--indicator-offset` (React `offset`) applying to corner placements only, and `<Indicator label aria-label>` gives the badge `role="status"` like the dot form. (both)
- Text on coloured fills meets WCAG AA: soft `info`, `success` and `danger` badges, `alert-description` (no longer faded to 85% opacity), and `card-description`, `stat-card-label`, `stat-card-detail` and neutral trends on `card-primary`/`-info`/`-success`/`-warning`/`-danger`, which use the text colour, as do chart legends, bar labels and bar values on those cards, with info, success and danger titles mixed toward it. Focus rings inside `alert-info`/`-success`/`-warning`/`-danger` use the variant's content colour, and the `badge-remove` ring stays inside the pill in the badge's text colour, where the blue ring was invisible on `badge-info`. (css)
- Alert text with inline markup (`<code>`, links) flows as one paragraph, and extra blocks such as a list of errors stay in the text column instead of the icon column; beside an icon, action or dismiss, vanilla markup wraps such text in one element (`alert-description` or a `<div>`), and React does this itself, with `Alert.Description` rendering a `<div>` (ref type `HTMLDivElement`) so lists nest validly. The icon and dismiss align to the first line of text, a title-only alert with an icon, action or dismiss is 38px tall (was 42px), in an untitled alert a `btn` action sits on the first line with the icon, text and dismiss without making the alert taller, and an inline `spinner` centres on the surrounding text without making the line 1px taller. (both)
- `card-toolbar` enlarges only direct-child bare icons and icon-only `btn-sm btn-square` buttons, including icon-only and chevron-only menu triggers and a button inside a `tooltip-wrap`, which render as a 28px square, keeps other controls at their own size without shrinking or wrapping, and centres on the title's first line without making the header taller. In a card that a grid stretches to equal height, the last `card-body` fills the spare height when only `card-media` follows it, so `card-actions` reaches the bottom, and `card-bordered` on a colour variant draws an accent-tinted border instead of one the same colour as the fill. (css)
- The donut hole matches the documented `--donut-thickness`: the default 33% ring left a hole about 24% of the diameter, so the centre label spilled onto the ring. The inner edge is anti-aliased, `.chart-donut-center` uses the text colour instead of the chart's info blue, legends sit 0.5rem below a stack or donut (was 0px and 6px), and inline stack and donut charts centre on the text line. (css)
- Inline horizontal bar charts (`.chart-inline.chart-bars`, `<BarChart inline>`) render their bars instead of collapsing them to 0 width, fills stay inside the track when a value exceeds `max` / `--chart-max`, and vertical bar values and labels truncate with an ellipsis in narrow columns instead of overlapping. A proportion bar (`.chart` > `.chart-stack`) fills its container in a flex parent instead of shrinking to its legend's width or to 0px; beside other items in a flex row, give it `flex: 1`. (css)
- Selected rows keep their tint on striped tables: selection paints the cells, so it wins over stripes and hover, two adjacent selected rows get a strong divider between them so they stay countable, and a selected row publishes `--surface-current`, so avatar-group rings in it have no halo. A checked switch in a row (native `input.switch` or React `Switch`) no longer tints the row as selected. (css)
- `table-row-link` takes its hit area from the row's first `<a>` only, including when that link has a `tabindex`, and `item-link` stretches only the `<a>` in `item-title` (or one placed directly in `item-content`). Later links, `a.btn` actions, menus, buttons and form controls in the row stay clickable, the row focus ring shows only for keyboard focus on the row link, and `item-link` hover shows inside cards and on `item-muted` rows. The row overlay uses `::before`, so a `link-external` as the row's link keeps its ↗. (css)
- `table-pin-col` draws a divider on the pinned column's inner edge (strong on selected rows, mirrored in right-to-left tables) and paints the pinned footer cell, so scrolled content no longer shows through. `table-sticky` keeps the header divider while the body scrolls, `table-bordered` keeps the strong header divider and totals rule and adds only vertical cell rules, the status gutter centres React SVG icons and checkboxes and stays 1.5rem wide at compact and relaxed density, and `table-cell-numeric` no longer wraps an amount away from its unit (`12.344,50 kr.`). (css)
- A `<th scope="row">` in `<tbody>` styles as a medium-weight body cell with stripes, hover and selection, and `Table.HeaderCell scope="row"` emits `table-cell` in place of `table-header-cell`. (both)
- Property list labels keep the spaces between inline elements (`EAN <small>(GTIN-13)</small>`), sit on the first line of wrapped text and centre beside an avatar, badge or button. A value that is both `numeric` and copyable ends on the same edge as the other numeric rows, with the copy button before the figure, and `PropertyList.Value` merges a consumer `ref` instead of replacing the internal one, which broke copying. (both)
- Timeline dot and marker rings and icon backing mask the connector in `--surface-current`, so they match the container they sit in, and the connector leaves the same gap above and below each dot and icon. Titles centre on their dot, icon or numbered marker, and `timeline-horizontal` lays items out as equal grid columns as wide as the widest label, so a rail sized to its content no longer crowds or wraps long labels. (css)
- `AvatarGroup`'s `+N` tile has `role="img"`, so screen readers announce its `+N more` label, and `Avatar` `alt` defaults to `""`. (react)
- A layout utility such as `flex` or `grid` on a `tab-panel` works in both bundles: inactive vanilla panels carrying one stayed visible, and the open React panel was forced to `display: block`. `tabs-boxed` hugs its segments instead of stretching to a block container's width or a vertical root's height, the `tabs-wrap` underline sits under the selected tab instead of the last row, `tabs-full-width` spans its container when `.tabs` is a flex item, and the bordered underline no longer slides under `prefers-reduced-motion: reduce`. (css)
- Content inside a closed accordion item, including an open item nested in it, can no longer be focused, is not read by screen readers and is not matched by find-in-page; it still counts toward the item's width, so a shrink-to-fit parent keeps its width when an item opens or closes. A standalone `.accordion-item` outside an `.accordion` keeps its rounded corners and top border, and the summary hover follows the item's rounded corners. (css)
- Menus in `.navbar-actions` / `<Navbar.Actions>` open aligned to their trigger's right edge, and where anchor positioning is supported, other menu popups near the right edge of the viewport (such as last-column row actions) flip to the trigger's right edge instead of overflowing, still flipping above when there is no room below. A menu in a `table-row-link` row or an `item-link` is no longer covered by the row's link overlay or by the rows after it, `item-group-bordered` no longer clips vanilla tooltips and menus, and the `menu-item-indicator` check gutter is 1em, so checkable item labels line up with icon item labels. (css)
- Activating a non-checkable `Menu.Item` or pressing Escape closes the menu and returns focus to the trigger; an item that opens a `Dialog` or `Drawer` rendered inside the menu leaves the menu open under it, and Escape in that dialog closes only the dialog. `aria-disabled` button items no longer fire `onClick`, a `ref` on `Menu.Item` no longer disables its `hotkey`, and `Menu.Group` is named by its `Menu.GroupLabel` via `aria-labelledby`. (react)
- The vanilla tooltip sizes to its content up to 20rem like the React popup, instead of wrapping every word onto its own line, and paints on the popup layer (`--z-popup`, default `1000`) above later positioned siblings, including inside a `btn-group`. Where CSS anchor positioning is supported it escapes ancestor overflow clipping (sidebar nav, dialog body, scroll containers), flips to the opposite side when its own has no room and stays inside the viewport; it opens on keyboard focus (`:focus-visible`) and no longer on a mouse click, which left it open after the pointer moved away. (css)
- Menu, select and tooltip popups inside a `.dialog` or `.drawer` with a `.dialog-body` are no longer clipped by the dialog box: the root sets `overflow: visible` and `.dialog-body` is the scroll region, while a dialog without one still scrolls as a whole. Children of `.dialog-body` no longer shrink, so iframes and charts keep their height and the body scrolls (a nested scroller needs `flex-shrink: 1`), and scrolling past the end of the body no longer scrolls the page. (css)
- `.dialog-auto` shrinks to its content instead of stretching to the viewport width, `.drawer-bottom` is as tall as its content up to its max-height, and drawer and `.dialog-auto` widths use `100%` instead of `100vw`, so classic scrollbars no longer cover the panel's edge. Dialogs without a header or footer get edge padding instead of pulling the description over the top edge, a `.dialog-body` at the dialog's edge keeps its scrollbar and focus ring inside the rounded corners, and the close button centres on the title line without making the header taller. (css)
- Dialogs fade and lift out on close, and dialog and drawer backdrops fade out instead of disappearing. Under `prefers-reduced-motion: reduce`, dialogs drop the lift and drawers fade in place instead of jumping on close. (css)
- `Dialog` and `Drawer` take their accessible name and description from `Dialog.Title` / `Dialog.Description` via `aria-labelledby` / `aria-describedby`, in `Dialog.Container` and `Drawer.Container` compositions too; a consumer-supplied `aria-label`, `aria-labelledby` or `aria-describedby` still wins. (react)
- A breadcrumb item with a leading icon lines up with its siblings, the trail is 20px tall, and `Breadcrumbs.Item` icons render at `1em` as in the vanilla bundle. Pagination prev/next and 2-digit pages stay 32px square, so the row no longer shifts while paging, and `renderItem` receives a second argument, `PaginationItemProps` (exported), with the default item's prefixed classes, ARIA and content to spread onto a router link; the documented router-link example rendered unstyled. (both)
- The `<Sidebar>` mobile drawer portals into `<AdminRoot>`, so it renders styled and positioned instead of as unstyled text at the end of the page, and it hides the collapse toggle, which does nothing there, along with a `.sidebar-footer` that holds only the toggle. In the collapsed rail, labels are visually hidden instead of `display: none`, so icon-only links and group triggers keep their accessible names, and the header and collapse toggle centre on the icon column; sidebar labels no longer clip descenders and diacritics (g, p, Å). (both)
- At exactly 768px the app shell shows the sidebar rail; the sidebar and the hamburger were both hidden at that width. A navbar wider than the viewport no longer widens the main area and footer or shrinks the hamburger, and `--app-shell-sidebar-w` and `--app-shell-sidebar-w-collapsed` set on `:root` take effect, since `.app-shell` no longer redeclares them, sizing both the rail and the React mobile drawer. (css)
- A controlled `<Sidebar.Collapsible open>` no longer opens when the parent ignores the change, and no longer repeats `onOpenChange` for updates that come from the `open` prop. (react)
- In `.prose`, `a.btn` keeps its button colour, radius and no underline instead of taking the link treatment, a `.code-block` keeps its default wrapping and `code-block-nowrap` works, and table cells respect the `align` attribute markdown emits for `| --: |` / `| :-: |` columns. (css)
- An icon in `item-media` aligns with the first line of a wrapping title instead of the middle of the block; avatar media stays centred. A badge after the text of a `card-title` keeps an 8px gap, and `dialog-description` sits 8px under the title, as on cards. (css)
- The `indicator` auto-offset on a `card` anchor is `4px` (was `6px`), so a corner item sits on the rounded corner instead of inside it. (css)
- A single `kbd` directly inside a `menu-item` is pushed to the row end like a `kbd-group`, and button-styled menu triggers keep the `.btn` gap for their size (8px at md, 10px at lg) instead of 6px. (css)
- The dialog close icon renders at 16px whether it is the default X, an `icon` prop or a vanilla `<i class="ti ti-x">`. (both)
- A checkbox, radio, switch or badge in a table cell no longer makes its row taller than a plain row (a small badge in a compact table), avatars centre on the row, and vanilla and React footer rows match. (css)
- In `.prose`, inline `<code>` chips keep their border and padding on both halves when they wrap across lines, and `<th>` row headers in a table body are medium weight in both bundles (`admin.css` rendered them bold and the scoped bundle regular). (css)
- The switch thumb, accordion open and close, and the mobile sidebar drawer no longer animate under `prefers-reduced-motion: reduce`. (css)
- Hotkey chips no longer cause a hydration error on Apple devices when the page is server-rendered (Next.js, Remix, any SSR). The server rendered `Ctrl`, `Shift` and `Alt` in `Kbd` and in the `Button`, `ToggleButton` and `Menu.Item` hotkey chips while an Apple client rendered `⌘`, `⇧` and `⌥`, so React discarded the server HTML and re-rendered the tree. They now hydrate with the server's labels and switch after hydration, and a `mod` binding switches with them. Server renders that are never hydrated (`renderToString` in the browser) keep the non-Apple labels. (react)

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
